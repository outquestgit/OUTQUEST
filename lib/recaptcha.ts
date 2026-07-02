/**
 * reCAPTCHA v3 server-side verification. If `RECAPTCHA_SECRET_KEY` is not set the
 * check is skipped (returns ok) so the site keeps working when reCAPTCHA isn't
 * configured; once a secret is present a valid token + score is required.
 */
const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const MIN_SCORE = 0.5;

export async function verifyRecaptcha(
  token: string,
  expectedAction: string,
  ip?: string
): Promise<{ ok: boolean; score?: number; reason?: string }> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return { ok: true, reason: "not-configured" };
  if (!token) return { ok: false, reason: "missing-token" };

  try {
    const params = new URLSearchParams({ secret, response: token });
    if (ip) params.set("remoteip", ip);
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: params,
    });
    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      score?: number;
      action?: string;
    };
    if (!data.success) return { ok: false, reason: "failed" };
    if (expectedAction && data.action && data.action !== expectedAction)
      return { ok: false, reason: "action-mismatch" };
    if (typeof data.score === "number" && data.score < MIN_SCORE)
      return { ok: false, score: data.score, reason: "low-score" };
    return { ok: true, score: data.score };
  } catch {
    return { ok: false, reason: "verify-error" };
  }
}
