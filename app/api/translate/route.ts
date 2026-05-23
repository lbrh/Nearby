import type { AppCopy } from "@/app/lib/app-copy";
import { BUILT_IN } from "@/app/lib/app-copy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5-20251001"; // fast + cheap for translation

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

  // Use English as the source
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

  return Response.json(parsed);
}
