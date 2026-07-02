import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Proxy (Next 16's renamed `middleware`). Runs before admin routes render:
 * refreshes the Supabase auth session cookie and gates `/admin` — an
 * unauthenticated request to anything under `/admin` (except the login page) is
 * redirected to `/admin/login`. The admin session stays alive until the admin
 * explicitly signs out (there is no idle timeout); Supabase governs the
 * underlying token lifetime.
 *
 * This is the coarse "are you signed in?" gate. The admin *role* check lives in
 * `requireAdmin()` + database RLS. We deliberately do NOT bounce authenticated
 * users off `/admin/login` here — doing so would create a redirect loop for a
 * signed-in non-admin (login → /admin → requireAdmin → login → …).
 *
 * Cookie handling follows the @supabase/ssr SSR pattern.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() (not getSession()) revalidates the token with Supabase.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api/");

  // Admin API routes (`/api/admin/*`): only refresh the session here, then let
  // the request through — the route handler's `requireAdminApi()`
  // returns a proper JSON 401/403. We must NOT redirect these: `fetch` follows
  // the 307 to `/admin/login`, gets the login HTML as a 200, and the caller would
  // wrongly read it as a successful save. Refreshing here (instead of letting
  // each route handler refresh ad-hoc) keeps the server cookie in sync with the
  // browser client and avoids refresh-token rotation races that otherwise
  // surface as intermittent 401s on save.
  if (isApi) return response;

  // Public admin paths: sign-in, the forgot-password request, and the reset
  // email-link callback (which has no session yet — it establishes one).
  const isPublic =
    pathname === "/admin/login" ||
    pathname === "/admin/forgot" ||
    pathname.startsWith("/admin/auth/");

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
