import { supabase } from "@/app/lib/supabase";

export const dynamic = "force-dynamic";

const STALE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const suburb = searchParams.get("suburb")?.trim() ?? "";
  if (!suburb) return Response.json({ services: [] });

  const suburbKey = suburb.toLowerCase();

  const { data: fetchRecord } = await supabase
    .from("location_fetches")
    .select("fetched_at")
    .eq("suburb_key", suburbKey)
    .single();

  const isStale =
    !fetchRecord ||
    Date.now() - new Date(fetchRecord.fetched_at).getTime() > STALE_MS;

  if (isStale) {
    // Fire-and-forget — don't await so the GET returns fast
    fetch(`${origin}/api/services/refresh`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ suburb }),
    }).catch((err) => console.error("[services] refresh trigger failed", err));
  }

  const { data: services } = await supabase
    .from("location_services")
    .select("*")
    .eq("suburb_key", suburbKey)
    .order("name");

  return Response.json({ services: services ?? [], stale: isStale });
}
