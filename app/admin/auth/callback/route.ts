import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";

/**
 * Auth redirect target for the admin email links (password reset AND email
 * change). Supabase sends one of two link shapes depending on the email template
 * / flow:
 *   - PKCE: `?code=…`  → `exchangeCodeForSession`
 *   - OTP:  `?token_hash=…&type=…` → `verifyOtp` (this is what the email-change
 *           and recovery links use when the template points here directly)
 * We handle both, bind the cookie writes to the redirect `response` so the
 * session survives the redirect, then forward to `next`. The email change is
 * applied by Supabase as part of verifying the link. For an email change we then
 * sign the (now stale) session out and send the admin to the login screen, so
 * they re-authenticate with the new email; a recovery link keeps the session and
 * forwards to the reset form. Falls back to login on failure or a missing token.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = (searchParams.get("type") as EmailOtpType | null) ?? undefined;
  // Default per flow: an email-change link lands on the login screen (re-auth
  // with the new email); a recovery (password reset) link lands on the reset form.
  const next =
    searchParams.get("next") ||
    (type === "email_change" ? "/admin/login?flash=email-changed" : "/admin/reset");

  // No verifiable token → nothing to do; send them to sign in.
  if (!code && !tokenHash) return NextResponse.redirect(`${origin}/admin/login`);

  const response = NextResponse.redirect(`${origin}${next}`);
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : await supabase.auth.verifyOtp({ token_hash: tokenHash!, type: type ?? "email" });

  if (error) {
    const url = new URL(`${origin}/admin/login`);
    url.searchParams.set("error", error.message);
    return NextResponse.redirect(url);
  }

  // Email change: the link has already updated the login email, but the session
  // still belongs to the old one. Clear it (cookie-writes land on `response`) so
  // the admin is forced to sign in fresh with their new email on the login page.
  const isEmailChange = type === "email_change" || next.startsWith("/admin/login");
  if (isEmailChange) await supabase.auth.signOut();

  return response;
}
