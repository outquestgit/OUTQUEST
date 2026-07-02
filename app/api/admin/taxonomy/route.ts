import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth";
import { QUESTS_TAG } from "@/lib/quests";
import { parseTaxonomyInput, TAX_PAGE_PREFIX } from "@/lib/admin/taxonomy";

/** Create a taxonomy term. */
export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb } = auth;

  const parsed = parseTaxonomyInput(await req.json().catch(() => ({})));
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { kind, name, slug } = parsed;

  const { data: clash } = await sb
    .from("taxonomy_terms")
    .select("id")
    .eq("kind", kind)
    .eq("slug", slug)
    .maybeSingle();
  if (clash)
    return NextResponse.json(
      { error: `The slug "${slug}" already exists in this taxonomy.` },
      { status: 409 }
    );

  // Append after the current highest sort_order for this kind.
  const { data: top } = await sb
    .from("taxonomy_terms")
    .select("sort_order")
    .eq("kind", kind)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort_order = (top?.sort_order ?? 0) + 1;

  const { data, error } = await sb
    .from("taxonomy_terms")
    .insert({
      kind,
      name,
      slug,
      active: true,
      sort_order,
      generates_page_prefix: TAX_PAGE_PREFIX[kind] ?? null,
    })
    .select("id, kind, slug, name, active, sort_order")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateTag(QUESTS_TAG, { expire: 0 });
  // Invalidate the front route + client router cache too, so taxonomy edits show
  // on a normal refresh (tag revalidation alone is served stale-while-revalidate).
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, term: data });
}
