"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { originFromHeaders } from "@/lib/origin";

export type LoginState = { error: string | null };

/** Email/password sign-in via Supabase Auth. On success → the admin dashboard. */
export async function signIn(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Email and password are required." };

  const sb = await createSupabaseServerClient();
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  // Carry a post-login flash (e.g. after an email change) through to the
  // dashboard so AdminFlash can show the success banner there.
  const postFlash = String(formData.get("postFlash") ?? "");
  redirect(postFlash === "email-changed" ? "/admin?flash=email-changed" : "/admin");
}

/** Sign out and return to the login screen. */
export async function signOut() {
  const sb = await createSupabaseServerClient();
  await sb.auth.signOut();
  redirect("/admin/login");
}

export type ForgotState = { error: string | null; sent: boolean };

/**
 * Send a password-reset email. The link lands on `/admin/auth/callback`, which
 * exchanges the recovery code for a session and forwards to `/admin/reset`. To
 * avoid leaking which emails exist, we always report success once the email is
 * well-formed.
 */
export async function requestPasswordReset(
  _prev: ForgotState,
  formData: FormData
): Promise<ForgotState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: "Please enter a valid email.", sent: false };

  const origin = originFromHeaders(await headers());
  const sb = await createSupabaseServerClient();
  await sb.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/admin/auth/callback?next=/admin/reset`,
  });
  return { error: null, sent: true };
}

export type ResetState = { error: string | null };

/**
 * Set a new password. Requires the recovery session established by the email
 * link (`/admin/auth/callback`); also works when an admin is already signed in.
 */
export async function updatePassword(
  _prev: ResetState,
  formData: FormData
): Promise<ResetState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirm) return { error: "Passwords don't match." };

  const sb = await createSupabaseServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { error: "Your reset link has expired — please request a new one." };

  const { error } = await sb.auth.updateUser({ password });
  if (error) return { error: error.message };

  redirect("/admin");
}
