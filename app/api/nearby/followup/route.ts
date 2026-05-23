import { FOLLOWUP_SYSTEM_PROMPT } from "@/app/lib/system-prompt";
import { LANG_NAME } from "@/app/lib/i18n";
import type { FollowUpRequest, FollowUpResponse } from "@/app/lib/types";

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

  let body: FollowUpRequest;
  try {
    body = (await request.json()) as FollowUpRequest;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { suburb, need, demographic, lang, services, history, question } = body;

  if (!question?.trim()) {
    return Response.json({ error: "question is required." }, { status: 400 });
  }

  const langName = LANG_NAME[lang] ?? "English";

  const contextBlock = `Context: the user is in ${suburb}, looking for "${need}"${demographic ? `, demographic: ${demographic}` : ""}. Language: ${lang} (${langName}).

Services already shown:
${services
  .map(
    (s, i) =>
      `${i + 1}. ${s.name} — ${s.address}. Hours: ${s.hours}. Access: ${s.access}.`,
  )
  .join("\n")}`;

  const messages = [
    { role: "user" as const, content: contextBlock },
    { role: "assistant" as const, content: "Understood. What would you like to know?" },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: question.trim() },
  ];

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
        max_tokens: 800,
        system: FOLLOWUP_SYSTEM_PROMPT,
        messages,
      }),
    });
  } catch (err) {
    console.error("[followup] upstream fetch failed", err);
    return Response.json(
      { error: "Could not reach the Anthropic API." },
      { status: 502 },
    );
  }

  if (!upstream.ok) {
    const text = await upstream.text();
    console.error("[followup] upstream error", upstream.status, text);
    return Response.json(
      { error: `Anthropic API returned ${upstream.status}.` },
      { status: 502 },
    );
  }

  const raw = (await upstream.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };

  const answer =
    raw.content
      ?.filter((b) => b.type === "text")
      .map((b) => b.text ?? "")
      .join("\n")
      .trim() ?? "";

  if (!answer) {
    return Response.json(
      { error: "Empty response from model." },
      { status: 502 },
    );
  }

  return Response.json({ answer } satisfies FollowUpResponse);
}
