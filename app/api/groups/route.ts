import { supabase } from "@/app/lib/supabase";
import type { CommunityGroup } from "@/app/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const suburb = searchParams.get("suburb")?.trim() ?? "";

  let query = supabase
    .from("community_groups")
    .select("*")
    .order("created_at", { ascending: false });

  if (suburb) {
    query = query.ilike("suburb", `%${suburb}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[groups] select error", error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data ?? []);
}

export async function POST(request: Request) {
  let body: CommunityGroup;
  try {
    body = (await request.json()) as CommunityGroup;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const title = body.title?.trim();
  if (!title) {
    return Response.json({ error: "title is required." }, { status: 400 });
  }

  const row: Omit<CommunityGroup, "id" | "created_at"> = {
    title,
    description: body.description?.trim() ?? "",
    category: body.category?.trim() ?? "",
    suburb: body.suburb?.trim() ?? "",
    address: body.address?.trim() ?? "",
    phone: body.phone?.trim() ?? "",
    email: body.email?.trim() ?? "",
    website: body.website?.trim() ?? "",
    schedule: body.schedule?.trim() ?? "",
  };

  const { data, error } = await supabase
    .from("community_groups")
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error("[groups] insert error", error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data, { status: 201 });
}
