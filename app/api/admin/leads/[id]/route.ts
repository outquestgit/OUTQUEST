import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";

const STATUSES = new Set(["new", "contacted", "qualified", "closed"]);

/** Update a lead's status (New / Contacted / Closed). */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb } = auth;
  const { id } = await params;

  const body = (await req.json().catch(() => ({}))) as { status?: unknown };
  const status = String(body.status ?? "").toLowerCase();
  if (!STATUSES.has(status))
    return NextResponse.json({ error: "Unknown status." }, { status: 400 });

  const { error } = await sb.from("leads").update({ status }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

/** Delete a lead. */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb } = auth;
  const { id } = await params;

  const { error } = await sb.from("leads").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
