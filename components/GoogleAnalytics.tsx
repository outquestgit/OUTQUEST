"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** GA4 measurement ID — overridable via env, defaults to the project property. */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-FRRPPYH22G";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Fire a GA4 page_view for the current URL. Exposed so `front.js`'s SPA
 *  navigation (`showPage`, which doesn't change the URL) can report views too. */
export function gaPageview() {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", {
    page_path: window.location.pathname + window.location.search,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/**
 * Loads GA4 and tracks page views across the whole app: the initial load via
 * `gtag('config', …, { send_page_view: true })`, and Next.js client route
 * changes via the `usePathname` effect (first run skipped — the config already
 * sent it). The front site's SPA navigation reports separately from `front.js`.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (!GA_ID) return;
    if (first.current) {
      first.current = false; // initial view already sent by the config call
      return;
    }
    gaPageview();
  }, [pathname]);

  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:true});`}
      </Script>
    </>
  );
}
