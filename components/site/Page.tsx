/**
 * SPA "page" wrapper: `<div id="page-{id}" class="page[ active]">`. The runtime's
 * `showPage()` toggles the `active` class to switch pages, so only the home page
 * starts active. Pages live in the DOM simultaneously, exactly as in the source.
 *
 * `suppressHydrationWarning`: on a deep-link (e.g. `/?p=quests` or `/faq`) the
 * `initial-page-activate` inline script (SiteApp) moves the `.active` class off
 * home and onto the requested section *before* React hydrates. Without this flag
 * React 19 sees the `.active` className mismatch as a hard hydration error and
 * bails hydration of the whole SPA tree — leaving every onClick (nav, lightbox,
 * save, share…) dead. The class is owned by the pre-paint script + front.js after
 * SSR, not React, so suppressing the warning is correct here.
 */
export function Page({
  id,
  active = false,
  children,
}: {
  id: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div id={`page-${id}`} className={active ? "page active" : "page"} suppressHydrationWarning>
      {children}
    </div>
  );
}
