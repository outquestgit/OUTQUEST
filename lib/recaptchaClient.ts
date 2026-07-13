"use client";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const SCRIPT_SRC = SITE_KEY ? `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}` : "";

let loadPromise: Promise<void> | null = null;

interface Grecaptcha {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, opts: { action: string }) => Promise<string>;
}

/**
 * Get a reCAPTCHA v3 token for an action, to send with a form POST. Returns ""
 * when reCAPTCHA isn't configured or hasn't loaded — the server skips
 * verification when unconfigured, so forms still work.
 */
function ensureRecaptchaLoaded(): Promise<void> {
  if (!SITE_KEY) return Promise.resolve();
  const g = (window as unknown as { grecaptcha?: Grecaptcha }).grecaptcha;
  if (g) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-recaptcha-script="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => resolve(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.dataset.recaptchaScript = "true";
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => resolve(), { once: true });
    document.head.appendChild(script);
  }).finally(() => {
    loadPromise = null;
  });

  return loadPromise;
}

export async function getRecaptchaToken(action: string): Promise<string> {
  if (!SITE_KEY) return "";
  try {
    await ensureRecaptchaLoaded();
    const g = (window as unknown as { grecaptcha?: Grecaptcha }).grecaptcha;
    if (!g) return "";
    await new Promise<void>((resolve) => g.ready(resolve));
    return await g.execute(SITE_KEY, { action });
  } catch {
    return "";
  }
}
