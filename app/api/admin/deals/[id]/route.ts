import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth";
import { DEALS_TAG } from "@/lib/deals";
import { QUESTS_TAG } from "@/lib/quests";
import { buildDealPayload } from "@/lib/admin/dealPayload";

/** Update a deal; re-syncs the connected quests (delete-then-insert). */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb } = auth;
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const built = buildDealPayload(body);
  if ("error" in built) return NextResponse.json({ error: built.error }, { status: 400 });
  const { payload, slug, questIds } = built;

  const { data: clash } = await sb
    .from("deals")
    .select("id")
    .eq("slug", slug)
    .neq("id", id)
    .maybeSingle();
  if (clash)
    return NextResponse.json({ error: `The slug "${slug}" is already in use.` }, { status: 409 });

  const { error } = await sb.from("deals").update(payload).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await sb.from("deal_quests").delete().eq("deal_id", id);
  if (questIds.length) {
    const { error: qErr } = await sb
      .from("deal_quests")
      .insert(questIds.map((quest_id) => ({ deal_id: id, quest_id })));
    if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 });
  }

  revalidateTag(DEALS_TAG, { expire: 0 });
  revalidateTag(QUESTS_TAG, { expire: 0 });
  // Invalidate the front route + client router cache too, so edits show on a
  // normal refresh (tag revalidation alone is served stale-while-revalidate).
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, id });
}

/** Delete a deal. `deal_quests` cascade (FK on delete cascade). */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb } = auth;
  const { id } = await params;

  const { error } = await sb.from("deals").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateTag(DEALS_TAG, { expire: 0 });
  revalidateTag(QUESTS_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
