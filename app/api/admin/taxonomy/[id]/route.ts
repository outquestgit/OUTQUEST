import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth";
import { QUESTS_TAG } from "@/lib/quests";
import { parseTaxonomyInput } from "@/lib/admin/taxonomy";

/** Update a taxonomy term (name + slug). */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb } = auth;
  const { id } = await params;

  const parsed = parseTaxonomyInput(await req.json().catch(() => ({})));
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { kind, name, slug } = parsed;

  const { data: clash } = await sb
    .from("taxonomy_terms")
    .select("id")
    .eq("kind", kind)
    .eq("slug", slug)
    .neq("id", id)
    .maybeSingle();
  if (clash)
    return NextResponse.json(
      { error: `The slug "${slug}" already exists in this taxonomy.` },
      { status: 409 }
    );

  const { error } = await sb.from("taxonomy_terms").update({ name, slug }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateTag(QUESTS_TAG, { expire: 0 });
  // Invalidate the front route + client router cache too, so edits show on a
  // normal refresh (tag revalidation alone is served stale-while-revalidate).
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, term: { id, kind, name, slug } });
}

/** Delete a taxonomy term (its quest_terms links cascade). */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb } = auth;
  const { id } = await params;

  const { error } = await sb.from("taxonomy_terms").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateTag(QUESTS_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
