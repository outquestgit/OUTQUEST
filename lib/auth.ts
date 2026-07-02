import "server-only";
import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "./supabase/server";

/**
 * Admin gate for Route Handlers (which return JSON, not redirects). Returns an
 * authenticated admin Supabase client, or an `{ error, status }` to respond with.
 */
export async function requireAdminApi(): Promise<
  { sb: SupabaseClient } | { error: string; status: number }
> {
  const sb = await createSupabaseServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { error: "Not signed in.", status: 401 };
  const { data: profile } = await sb
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") return { error: "Not authorized.", status: 403 };
  return { sb };
}

/** The signed-in Supabase user for this request, or null. */
export async function getCurrentUser(): Promise<User | null> {
  const sb = await createSupabaseServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  return user;
}

/**
 * Server-side gate for admin pages and Server Actions. Returns the admin user or
 * redirects to the login page. Because Server Actions are reachable by direct
 * POST (not just via our UI), each mutation should also call this — the proxy
 * gate alone is not sufficient. Database RLS (`is_admin()`) is the final backstop.
 */
export async function requireAdmin(): Promise<User> {
  const sb = await createSupabaseServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await sb
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") redirect("/admin/login");
  return user;
}
