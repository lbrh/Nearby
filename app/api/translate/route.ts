import type { AppCopy } from "@/app/lib/app-copy";
import { BUILT_IN } from "@/app/lib/app-copy";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5-20251001"; // fast + cheap for translation

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/** Normalise language name to a consistent cache key, e.g. "French" → "french" */
function langKey(language: string) {
  return language.trim().toLowerCase();
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "ANTHROPIC_API_KEY not set." }, { status: 500 });
  }

  let body: { language: string; strings: AppCopy };
  try {
    body = (await request.json()) as { language: string; strings: AppCopy };
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { language } = body;
  if (!language?.trim()) {
    return Response.json({ error: "language is required." }, { status: 400 });
  }

  const supabase = getSupabase();

  // ── 1. Check Supabase cache ────────────────────────────────────────────────
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("translations")
        .select("copy")
        .eq("language", langKey(language))
        .maybeSingle();

      if (!error && data?.copy) {
        const copyObj = data.copy as any;
        if (copyObj && copyObj.landing && copyObj.howItWorks) {
          console.log(`[translate] cache hit for "${language}"`);
          return Response.json(copyObj as AppCopy);
        } else {
          console.log(`[translate] cache miss due to outdated keys/schema for "${language}"`);
        }
      }
    } catch (err) {
      // Non-fatal: fall through to Anthropic
      console.warn("[translate] Supabase read failed, falling back to Anthropic:", err);
    }
  }

  // ── 2. Generate via Anthropic ──────────────────────────────────────────────
  const source = BUILT_IN.en;

  const userMsg = `Translate all string values in the following JSON into ${language}.
Return ONLY the translated JSON object — no explanation, no markdown fences.
Rules:
- Keep the exact same JSON structure and keys
- Preserve special characters: ↺ … · — + →
- Keep "Nearby" and place names (Carlton, Melbourne, etc.) in English
- Translate arrays element by element
- If a value is already in ${language}, keep it as-is

${JSON.stringify(source, null, 2)}`;

  let upstream: Response;
  try {
    upstream = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2000,
        messages: [{ role: "user", content: userMsg }],
      }),
    });
  } catch (err) {
    console.error("[translate] upstream fetch failed", err);
    return Response.json({ error: "Could not reach Anthropic API." }, { status: 502 });
  }

  if (!upstream.ok) {
    const text = await upstream.text();
    console.error("[translate] upstream error", upstream.status, text);
    return Response.json({ error: `Anthropic API returned ${upstream.status}.` }, { status: 502 });
  }

  const raw = (await upstream.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };

  const text =
    raw.content
      ?.filter((b) => b.type === "text")
      .map((b) => b.text ?? "")
      .join("")
      .trim() ?? "";

  // Strip code fences if present
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) {
    return Response.json({ error: "Model returned unparseable response." }, { status: 502 });
  }

  let parsed: AppCopy;
  try {
    parsed = JSON.parse(cleaned.slice(start, end + 1)) as AppCopy;
  } catch {
    return Response.json({ error: "Model returned malformed JSON." }, { status: 502 });
  }

  // ── 3. Persist to Supabase ────────────────────────────────────────────────
  if (supabase) {
    supabase
      .from("translations")
      .upsert(
        {
          language: langKey(language),
          language_display: language,
          copy: parsed,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "language" },
      )
      .then(({ error }) => {
        if (error) console.error("[translate] Supabase upsert failed:", error.message);
        else console.log(`[translate] stored "${language}" in Supabase`);
      });
    // Fire-and-forget: don't block the response
  }

  return Response.json(parsed);
}
