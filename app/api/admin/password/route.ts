import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";

/**
 * Change the signed-in admin's password. Verifies the current password by
 * re-authenticating, then updates it. Requires an authenticated admin session.
 */
export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb } = auth;

  const body = (await req.json().catch(() => ({}))) as {
    currentPassword?: unknown;
    newPassword?: unknown;
  };
  const currentPassword = String(body.currentPassword ?? "");
  const newPassword = String(body.newPassword ?? "");

  if (newPassword.length < 8)
    return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });

  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  if (newPassword === currentPassword)
    return NextResponse.json({ error: "New password must be different." }, { status: 400 });

  // Re-authenticate to confirm the current password is correct.
  const { error: reauthError } = await sb.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (reauthError)
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 403 });

  const { error } = await sb.auth.updateUser({ password: newPassword });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
