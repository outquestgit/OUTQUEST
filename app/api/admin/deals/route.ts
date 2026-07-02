import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth";
import { DEALS_TAG } from "@/lib/deals";
import { QUESTS_TAG } from "@/lib/quests";
import { buildDealPayload } from "@/lib/admin/dealPayload";

/** Create a deal from the reference admin's Deal editor (wired by DealsBridge). */
export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb } = auth;

  const body = await req.json().catch(() => ({}));
  const built = buildDealPayload(body);
  if ("error" in built) return NextResponse.json({ error: built.error }, { status: 400 });
  const { payload, slug, questIds } = built;

  const { data: existing } = await sb.from("deals").select("id").eq("slug", slug).maybeSingle();
  if (existing)
    return NextResponse.json({ error: `The slug "${slug}" is already in use.` }, { status: 409 });

  const { data: inserted, error } = await sb.from("deals").insert(payload).select("id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (questIds.length) {
    const { error: qErr } = await sb
      .from("deal_quests")
      .insert(questIds.map((quest_id) => ({ deal_id: inserted.id, quest_id })));
    if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 });
  }

  revalidateTag(DEALS_TAG, { expire: 0 });
  revalidateTag(QUESTS_TAG, { expire: 0 });
  // Invalidate the front route + client router cache too, so the change shows on
  // a normal refresh (tag revalidation alone is served stale-while-revalidate).
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, id: inserted.id });
}
