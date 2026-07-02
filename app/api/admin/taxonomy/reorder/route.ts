import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth";
import { QUESTS_TAG } from "@/lib/quests";
import { TAXONOMY_KINDS, type TaxKind } from "@/lib/admin/taxonomy";

/** Persist a new term order within one taxonomy kind. */
export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb } = auth;

  const body = (await req.json().catch(() => ({}))) as { kind?: unknown; ids?: unknown };
  const kind = String(body.kind ?? "") as TaxKind;
  const ids = Array.isArray(body.ids) ? body.ids.map((x) => String(x)) : [];
  if (!(TAXONOMY_KINDS as readonly string[]).includes(kind))
    return NextResponse.json({ error: "Unknown taxonomy." }, { status: 400 });
  if (ids.length === 0)
    return NextResponse.json({ error: "No order provided." }, { status: 400 });

  // Renumber sequentially (1-based) in the order received. Only rows of this
  // kind whose id is in the list are touched, so a stale id is a no-op.
  for (let i = 0; i < ids.length; i++) {
    const { error } = await sb
      .from("taxonomy_terms")
      .update({ sort_order: i + 1 })
      .eq("id", ids[i])
      .eq("kind", kind);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidateTag(QUESTS_TAG, { expire: 0 });
  // Invalidate the front route + client router cache too, so the reorder shows on
  // a normal refresh (tag revalidation alone is served stale-while-revalidate).
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
