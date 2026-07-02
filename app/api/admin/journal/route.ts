import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth";
import { JOURNAL_TAG } from "@/lib/journal";
import { buildJournalPayload } from "@/lib/admin/journalPayload";

/** Create a journal post from the reference admin's Journal editor (JournalBridge). */
export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb } = auth;

  const body = await req.json().catch(() => ({}));
  const built = buildJournalPayload(body);
  if ("error" in built) return NextResponse.json({ error: built.error }, { status: 400 });
  const { payload, slug } = built;

  const { data: existing } = await sb
    .from("journal_posts")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (existing)
    return NextResponse.json({ error: `The slug "${slug}" is already in use.` }, { status: 409 });

  const { data: inserted, error } = await sb
    .from("journal_posts")
    .insert(payload)
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateTag(JOURNAL_TAG, { expire: 0 });
  // Invalidate the front route + client router cache too, so the post shows on a
  // normal refresh (tag revalidation alone is served stale-while-revalidate).
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, id: inserted.id });
}
