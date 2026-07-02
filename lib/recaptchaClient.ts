"use client";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

interface Grecaptcha {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, opts: { action: string }) => Promise<string>;
}

/**
 * Get a reCAPTCHA v3 token for an action, to send with a form POST. Returns ""
 * when reCAPTCHA isn't configured or hasn't loaded — the server skips
 * verification when unconfigured, so forms still work.
 */
export async function getRecaptchaToken(action: string): Promise<string> {
  if (!SITE_KEY) return "";
  const g = (window as unknown as { grecaptcha?: Grecaptcha }).grecaptcha;
  if (!g) return "";
  try {
    await new Promise<void>((resolve) => g.ready(resolve));
    return await g.execute(SITE_KEY, { action });
  } catch {
    return "";
  }
}
