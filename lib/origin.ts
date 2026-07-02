/**
 * Resolve the public origin (scheme + host) from the incoming request's
 * forwarded/host headers, falling back to `NEXT_PUBLIC_SITE_URL`.
 *
 * Prefer this over reading `NEXT_PUBLIC_SITE_URL` directly for auth email links
 * (password reset, email change): the redirect target then always matches the
 * domain the admin is actually on — `localhost:3000` in dev, the deployed domain
 * in prod — which is what Supabase's redirect-URL allowlist checks. Relying on
 * the env var alone breaks when it's unset/wrong on the host (e.g. left at
 * localhost on Vercel), silently sending confirmation links to the wrong origin.
 */
export function originFromHeaders(h: Headers): string {
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const proto = h.get("x-forwarded-proto") ?? (/^(localhost|127\.|\[::1\])/.test(host) ? "http" : "https");
    return `${proto}://${host}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}
