import { supabase } from "@/app/lib/supabase";
import type { HourSlot } from "@/app/lib/hours";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";

interface ServiceItem {
  name: string;
  category: string;
  address: string;
  hours_raw: string;
  hours_structured: HourSlot[];
  phone: string;
  website: string;
}

const SYSTEM_PROMPT = `You are a local services database for City of Melbourne, Australia. When given a suburb name, return a JSON array of real community services, facilities, and programs available there or nearby that have defined opening hours.

Focus on: libraries, community centres, community gardens, food relief, repair cafés, health services, pools, council services.

For each service return an object with these fields:
- name: service name (string)
- category: one of: Library, Community garden, Food relief, Community centre, Health, Pool & recreation, Repair café, Council service, Childcare, Youth service
- address: full street address including suburb (string)
- hours_raw: human-readable hours, e.g. "Mon–Fri 9am–5pm, Sat 10am–2pm" (string)
- hours_structured: array of objects { days: number[], opens: "HH:MM", closes: "HH:MM" } where days uses 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat and times are 24-hour format
- phone: phone number or "" (string)
- website: website URL or "" (string)

RULES:
- Only include services you are confident are real and exist
- Include 8–14 services
- Respond ONLY with the raw JSON array — no markdown fences, no prose, no explanation`;

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return Response.json({ error: "No API key" }, { status: 500 });

  let suburb: string;
  try {
    const body = (await request.json()) as { suburb?: string };
    suburb = body.suburb?.trim() ?? "";
    if (!suburb) return Response.json({ error: "suburb required" }, { status: 400 });
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const suburbKey = suburb.toLowerCase();

  let services: ServiceItem[];
  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          { role: "user", content: `Suburb: ${suburb}, Melbourne, Victoria, Australia` },
        ],
      }),
    });

    if (!res.ok) throw new Error(`Anthropic ${res.status}`);
    const raw = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
    const text =
      raw.content
        ?.filter((b) => b.type === "text")
        .map((b) => b.text ?? "")
        .join("")
        .trim() ?? "";

    services = JSON.parse(text) as ServiceItem[];
    if (!Array.isArray(services)) throw new Error("Not an array");
  } catch (err) {
    console.error("[services/refresh] Claude error", err);
    return Response.json({ error: "Failed to generate services" }, { status: 502 });
  }

  const rows = services.map((s) => ({
    suburb_key: suburbKey,
    name: s.name ?? "",
    category: s.category ?? "",
    address: s.address ?? "",
    hours_raw: s.hours_raw ?? "",
    hours_structured: s.hours_structured ?? [],
    phone: s.phone ?? "",
    website: s.website ?? "",
  }));

  const { error: upsertErr } = await supabase
    .from("location_services")
    .upsert(rows, { onConflict: "suburb_key,name" });

  if (upsertErr) {
    console.error("[services/refresh] upsert error", upsertErr);
    return Response.json({ error: "DB write failed" }, { status: 500 });
  }

  await supabase
    .from("location_fetches")
    .upsert({ suburb_key: suburbKey, fetched_at: new Date().toISOString() });

  return Response.json({ ok: true, count: rows.length });
}
