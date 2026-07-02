"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

/**
 * A real `<a href>` that still soft-navigates the SPA on a plain left click.
 *
 * The front site routes in-place via the `front.js` runtime, so links were
 * `<button onClick>`/`<div onClick>` — which the browser can't "Open in new
 * tab", ⌘/Ctrl-click, or middle-click. `AppLink` renders an anchor (so all
 * those work natively from `href`) and only calls `onActivate` for an
 * unmodified primary-button click; every "open elsewhere" intent is left to the
 * browser.
 *
 * `capture` uses the capture phase, needed where `front.js` attaches a
 * bubble-phase `stopPropagation` (e.g. the desktop nav dropdowns) that would
 * otherwise swallow the handler.
 */
export function AppLink({
  href,
  onActivate,
  target,
  capture = false,
  children,
  ...rest
}: {
  href: string;
  onActivate?: () => void;
  target?: "_self" | "_blank";
  capture?: boolean;
  children?: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "onClick" | "children">) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    // Let the browser handle new-tab/window intents: explicit target, modifier
    // keys, or any non-primary button. (Right-click never fires click at all.)
    if (
      target === "_blank" ||
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    )
      return;
    if (!onActivate) return; // plain anchor → normal navigation
    e.preventDefault();
    onActivate();
  };
  return (
    <a
      href={href}
      target={target}
      {...(capture ? { onClickCapture: handle } : { onClick: handle })}
      {...rest}
    >
      {children}
    </a>
  );
}
