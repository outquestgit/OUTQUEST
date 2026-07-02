import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { originFromHeaders } from "@/lib/origin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Current signed-in admin's login email (to show in Settings → Security). */
export async function GET() {
  const auth = await requireAdminApi();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const {
    data: { user },
  } = await auth.sb.auth.getUser();
  return NextResponse.json({ email: user?.email ?? "" });
}

/**
 * Change the signed-in admin's login email. Re-authenticates with the current
 * password, then asks Supabase to update the email — which sends a confirmation
 * link to the new address (and, if "secure email change" is on, the old one too).
 * The change only takes effect once the link is clicked; the link lands on
 * `/admin/auth/callback` like the password-reset flow.
 */
export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb } = auth;

  const body = (await req.json().catch(() => ({}))) as {
    newEmail?: unknown;
    currentPassword?: unknown;
  };
  const newEmail = String(body.newEmail ?? "").trim().toLowerCase();
  const currentPassword = String(body.currentPassword ?? "");

  if (!EMAIL_RE.test(newEmail))
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });

  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  if (newEmail === user.email.toLowerCase())
    return NextResponse.json({ error: "That's already your login email." }, { status: 400 });

  // Re-authenticate to confirm the current password is correct.
  const { error: reauthError } = await sb.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (reauthError)
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 403 });

  // Use the request's own origin so the confirmation link points at the domain
  // the admin is on (must match Supabase's redirect-URL allowlist).
  const origin = originFromHeaders(req.headers);
  // After confirming the link, send the admin to the login screen to sign in
  // with their NEW email (the callback signs the stale session out). The login
  // page shows an "email changed" notice, and once they sign in the dashboard
  // shows the success banner (AdminFlash reads `?flash=email-changed`).
  const next = encodeURIComponent("/admin/login?flash=email-changed");
  const { error } = await sb.auth.updateUser(
    { email: newEmail },
    { emailRedirectTo: `${origin}/admin/auth/callback?next=${next}` }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, email: newEmail });
}
