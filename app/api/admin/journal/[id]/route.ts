import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth";
import { JOURNAL_TAG } from "@/lib/journal";
import { buildJournalPayload } from "@/lib/admin/journalPayload";
import { pingIndexNow } from "@/lib/indexnow";

/** Update a journal post. */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb } = auth;
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const built = buildJournalPayload(body);
  if ("error" in built) return NextResponse.json({ error: built.error }, { status: 400 });
  const { payload, slug } = built;

  const { data: clash } = await sb
    .from("journal_posts")
    .select("id")
    .eq("slug", slug)
    .neq("id", id)
    .maybeSingle();
  if (clash)
    return NextResponse.json({ error: `The slug "${slug}" is already in use.` }, { status: 409 });

  const { error } = await sb.from("journal_posts").update(payload).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateTag(JOURNAL_TAG, { expire: 0 });

  // Ping Bing IndexNow so published journal posts get crawled immediately.
  if (payload.visibility === "published") {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.joinoutquest.com";
    pingIndexNow(`${siteUrl}/journal/${slug}`);
  }

  // Invalidate the front route + client router cache too, so edits show on a
  // normal refresh (tag revalidation alone is served stale-while-revalidate).
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, id });
}

/** Delete a journal post. */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb } = auth;
  const { id } = await params;

  const { error } = await sb.from("journal_posts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateTag(JOURNAL_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}