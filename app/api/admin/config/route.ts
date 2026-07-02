import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import type { AdminEmailConfig } from "@/lib/site/data/adminConfig";

const str = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);

function cleanEmail(v: unknown): AdminEmailConfig {
  const e = (v ?? {}) as Partial<AdminEmailConfig>;
  return {
    recipients: str(e.recipients, 500),
    sender: str(e.sender, 200),
    smtpHost: str(e.smtpHost, 200),
    smtpPort: str(e.smtpPort, 10),
    smtpUser: str(e.smtpUser, 200),
    smtpPass: str(e.smtpPass, 500),
  };
}

/**
 * Save the PRIVATE admin config (lead-alert email) to the admin-only
 * `admin_config` table. Uses the authenticated admin client, so the is_admin()
 * RLS guards the write. Never exposed to the public site.
 */
export async function PUT(req: Request) {
  const auth = await requireAdminApi();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb } = auth;

  const body = await req.json().catch(() => ({}));
  const payload: Record<string, unknown> = { id: 1 };
  if (body.email !== undefined) {
    const email = cleanEmail(body.email);
    // Blank SMTP password = "keep the existing one" (it's never sent to the
    // client, so an unchanged form submits it empty).
    if (!email.smtpPass) {
      const { data } = await sb.from("admin_config").select("email").eq("id", 1).maybeSingle();
      const prev = (data?.email ?? {}) as { smtpPass?: string };
      email.smtpPass = typeof prev.smtpPass === "string" ? prev.smtpPass : "";
    }
    payload.email = email;
  }

  const { error } = await sb.from("admin_config").upsert(payload, { onConflict: "id" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
