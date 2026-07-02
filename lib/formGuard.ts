import { NextResponse } from "next/server";
import { rateLimit } from "./rateLimit";
import { verifyRecaptcha } from "./recaptcha";

/** Best-effort client IP from the standard proxy headers. */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || req.headers.get("cf-connecting-ip") || "unknown";
}

/**
 * Shared guard for public form POSTs: rate-limit (10 / IP / hour, per `action`)
 * then verify the reCAPTCHA v3 token. Returns a `NextResponse` to send back when
 * the request should be rejected, or `null` when it may proceed.
 */
export async function guardForm(
  req: Request,
  action: string,
  recaptchaToken: string
): Promise<NextResponse | null> {
  const ip = getClientIp(req);

  const rl = rateLimit(`${action}:${ip}`, 10);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in a little while." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  const rc = await verifyRecaptcha(recaptchaToken, action, ip);
  if (!rc.ok) {
    return NextResponse.json(
      { error: "Couldn't verify you're human. Please refresh and try again." },
      { status: 403 }
    );
  }

  return null;
}
