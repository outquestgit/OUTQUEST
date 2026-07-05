import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  SITE ON/OFF SWITCH                                                     │
 * │                                                                        │
 * │  SITE_DISABLED = true   →  the WHOLE site is offline (503 for every     │
 * │                            page, the admin area, and all API routes).  │
 * │  SITE_DISABLED = false  →  the site is live again.                      │
 * │                                                                        │
 * │  After changing this line you must restart the dev server (or redeploy │
 * │  the live site) for it to take effect.                                 │
 * └──────────────────────────────────────────────────────────────────────┘
 */
const SITE_DISABLED = true;

function maintenanceEnabled(): boolean {
  // The `MAINTENANCE_MODE` env var can also force this on without a code edit.
  return SITE_DISABLED || /^(1|true|on|yes)$/i.test((process.env.MAINTENANCE_MODE ?? "").trim());
}

/** Self-contained 503 page shown while the site is switched off. No external
 *  assets, so it renders even with every route blocked. */
function maintenanceResponse(): NextResponse {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Temporarily unavailable</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: flex; align-items: center;
    justify-content: center; padding: 24px;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    background: #0b0d12; color: #e7eaf0;
  }
  .card {
    max-width: 440px; text-align: center;
    background: #12151c; border: 1px solid #232833; border-radius: 16px;
    padding: 40px 32px; box-shadow: 0 12px 40px rgba(0,0,0,.4);
  }
  h1 { margin: 0 0 12px; font-size: 22px; letter-spacing: -.01em; }
  p { margin: 0; color: #9aa3b2; line-height: 1.6; font-size: 15px; }
  .dot {
    display: inline-block; width: 10px; height: 10px; border-radius: 50%;
    background: #f0a020; margin-bottom: 20px;
  }
</style>
</head>
<body>
  <div class="card">
    <span class="dot"></span>
    <h1>This site is temporarily unavailable</h1>
    <p>We're doing some maintenance right now. Please check back shortly.</p>
  </div>
</body>
</html>`;
  return new NextResponse(html, {
    status: 503,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "retry-after": "3600",
      "cache-control": "no-store, no-cache, must-revalidate",
    },
  });
}

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
  // Kill switch takes precedence over everything: block the whole site.
  if (maintenanceEnabled()) return maintenanceResponse();

  // The matcher now runs on every route (so the kill switch can cover them),
  // but the auth gate below only concerns the admin area. For any other path
  // there is nothing to do — pass straight through without the Supabase call.
  const { pathname } = request.nextUrl;
  const isAdminArea =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/api/admin/");
  if (!isAdminArea) return NextResponse.next({ request });

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
  // Runs on every route (so the MAINTENANCE_MODE kill switch can cover the whole
  // site) except Next.js internals and the favicon. The admin auth gate inside
  // the handler is guarded to only act on `/admin` + `/api/admin` paths, so
  // public routes just pass straight through during normal operation.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
