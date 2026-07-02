"use client";

import Script from "next/script";

/**
 * Loads the reCAPTCHA v3 API when `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set, so the
 * front forms can fetch a token via `getRecaptchaToken`. Renders nothing (and the
 * server skips verification) when no key is configured.
 */
export function RecaptchaLoader() {
  const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!key) return null;
  return (
    <Script src={`https://www.google.com/recaptcha/api.js?render=${key}`} strategy="afterInteractive" />
  );
}
