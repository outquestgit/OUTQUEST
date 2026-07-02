import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth";
import { QUESTS_TAG, type QuestContent } from "@/lib/quests";
import { buildQuestPayload, MANAGED_CONTENT_KEYS } from "@/lib/admin/questPayload";

/**
 * Update an existing quest (Edit flow). Same payload rules as create; the slug
 * uniqueness check excludes the quest itself, and the taxonomy tags are re-synced
 * (delete-then-insert). The editor-managed `content` keys are replaced wholesale
 * while any other keys already in the DB are preserved (merge below).
 */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb } = auth;
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const built = buildQuestPayload(body);
  if ("error" in built) return NextResponse.json({ error: built.error }, { status: 400 });
  const { payload, slug, termIds } = built;

  // Slug must be unique across every other quest.
  const { data: clash } = await sb
    .from("quests")
    .select("id")
    .eq("slug", slug)
    .neq("id", id)
    .maybeSingle();
  if (clash)
    return NextResponse.json({ error: `The slug "${slug}" is already in use.` }, { status: 409 });

  // Merge content: drop the editor-managed keys from the stored content, then
  // apply the freshly-edited ones — so unmanaged keys survive but cleared
  // repeaters are really cleared.
  const { data: current } = await sb.from("quests").select("content").eq("id", id).maybeSingle();
  const existing = (current?.content ?? {}) as QuestContent;
  const preserved: QuestContent = { ...existing };
  for (const k of MANAGED_CONTENT_KEYS) delete preserved[k];
  payload.content = { ...preserved, ...payload.content };

  const { error } = await sb.from("quests").update(payload).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Re-sync taxonomy tags.
  await sb.from("quest_terms").delete().eq("quest_id", id);
  if (termIds.length) {
    const { error: tErr } = await sb
      .from("quest_terms")
      .insert(termIds.map((term_id) => ({ quest_id: id, term_id })));
    if (tErr) return NextResponse.json({ error: tErr.message }, { status: 500 });
  }

  revalidateTag(QUESTS_TAG, { expire: 0 });
  // Invalidate the front route + client router cache too, so edits show on a
  // normal refresh (tag revalidation alone is served stale-while-revalidate).
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, id });
}

/** Delete a quest. `quest_terms` / `quest_images` cascade (FK on delete cascade). */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb } = auth;
  const { id } = await params;

  const { error } = await sb.from("quests").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateTag(QUESTS_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
