import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth";
import { QUESTS_TAG } from "@/lib/quests";
import { buildQuestPayload } from "@/lib/admin/questPayload";

/**
 * Create a quest from the reference admin's Quest editor (wired by
 * QuestEditorBridge). Auth is enforced here because route handlers are reachable
 * directly, not only via the UI.
 */
export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb } = auth;

  const body = await req.json().catch(() => ({}));
  const built = buildQuestPayload(body);
  if ("error" in built) return NextResponse.json({ error: built.error }, { status: 400 });
  const { payload, slug, termIds } = built;

  const { data: existing } = await sb.from("quests").select("id").eq("slug", slug).maybeSingle();
  if (existing)
    return NextResponse.json({ error: `The slug "${slug}" is already in use.` }, { status: 409 });

  const { data: inserted, error } = await sb
    .from("quests")
    .insert(payload)
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (termIds.length) {
    const { error: tErr } = await sb
      .from("quest_terms")
      .insert(termIds.map((term_id) => ({ quest_id: inserted.id, term_id })));
    if (tErr) return NextResponse.json({ error: tErr.message }, { status: 500 });
  }

  revalidateTag(QUESTS_TAG, { expire: 0 });
  // Also invalidate the front route cache (and client router cache) so the change
  // shows on a normal refresh, not just a hard reload. Tag revalidation alone is
  // served stale-while-revalidate; quests appear across the whole `(site)` tree
  // (home, /quests, category + detail pages), so revalidate the layout.
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, id: inserted.id });
}
