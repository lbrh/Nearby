import { NEARBY_SYSTEM_PROMPT } from "@/app/lib/system-prompt";
import { LANG_NAME } from "@/app/lib/i18n";
import type { NearbyRequest, NearbyResponse } from "@/app/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY is not set on the server." },
      { status: 500 },
    );
  }

  let body: NearbyRequest;
  try {
    body = (await request.json()) as NearbyRequest;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const suburb = String(body.suburb || "").trim();
  const need = String(body.need || "").trim();
  const demographic = String(body.demographic || "").trim();
  const lang = (body.lang || "en") as keyof typeof LANG_NAME;

  if (!suburb || !need) {
    return Response.json(
      { error: "Please provide both `suburb` and `need`." },
      { status: 400 },
    );
  }

  const userMsg = `SUBURB: ${suburb}
NEED: ${need}
DEMOGRAPHIC: ${demographic || "(not provided)"}
LANGUAGE: ${lang} (${LANG_NAME[lang] ?? "English"})

Return ONLY the JSON object as specified.`;

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
        system: NEARBY_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMsg }],
      }),
    });
  } catch (err) {
    console.error("[nearby] upstream fetch failed", err);
    return Response.json(
      { error: "Could not reach the Anthropic API." },
      { status: 502 },
    );
  }

  if (!upstream.ok) {
    const text = await upstream.text();
    console.error("[nearby] upstream error", upstream.status, text);
    return Response.json(
      { error: `Anthropic API returned ${upstream.status}.` },
      { status: 502 },
    );
  }

  const raw = (await upstream.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };

  const text =
    raw.content
      ?.filter((b) => b.type === "text")
      .map((b) => b.text ?? "")
      .join("\n")
      .trim() ?? "";

  // Robustly extract JSON — strip code fences, locate outermost braces
  const cleaned = text
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) {
    return Response.json(
      { error: "Could not parse the model's response." },
      { status: 502 },
    );
  }

  let parsed: NearbyResponse;
  try {
    parsed = JSON.parse(cleaned.slice(start, end + 1)) as NearbyResponse;
  } catch (err) {
    console.error("[nearby] JSON parse failed", err, cleaned);
    return Response.json(
      { error: "Model returned malformed JSON." },
      { status: 502 },
    );
  }

  if (!parsed.services || !Array.isArray(parsed.services)) {
    return Response.json(
      { error: "Model response missing services." },
      { status: 502 },
    );
  }

  return Response.json(parsed);
}
