"use client";

import Image from "next/image";
import type { NavBrand } from "@/lib/site/chromeConfig";
import { AppLink } from "@/components/site/ui/AppLink";

/**
 * The "OutQuest" wordmark + compass glyph. Shared by the desktop nav and the
 * mobile-menu header, which use slightly different glyph sizes/margins — so
 * those are props. Rendered as a real link (`href`, default home) so it can be
 * opened in a new tab; a plain click runs `onClick` for SPA soft-navigation
 * (callers wire the exact handler, e.g. the mobile header also closes the menu).
 *
 * When admin branding supplies a `logoUrl`, that uploaded image replaces the
 * wordmark glyph entirely (alt text from the branding config).
 */
export function NavLogo({
  size = 22,
  marginRight = 6,
  onClick,
  href = "/",
  brand,
}: {
  size?: number;
  marginRight?: number;
  onClick: () => void;
  href?: string;
  brand?: NavBrand;
}) {
  if (brand?.logoUrl) {
    return (
      <AppLink className="nav-logo nav-logo--img" href={href} onActivate={onClick}>
        <Image
          src={brand.logoUrl}
          alt={brand.logoAlt || "Home"}
          width={size + 12}
          height={size + 12}
          priority 
          style={{ width: "auto", display: "block", marginRight: "8px" }}
        />
        {/* Brand name beside the uploaded logo image. The whole wordmark uses the
            inherited (near-black) text color — `.nav-logo span` is `color:inherit`. */}
        <span style={{ color: "inherit" }}>
          Out<span>Quest</span>
        </span>
      </AppLink>
    );
  }
  return (
    <AppLink className="nav-logo" href={href} onActivate={onClick}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: "inline-block",
          verticalAlign: "middle",
          marginRight: `${marginRight}px`,
          borderRadius: "6px",
          background: "var(--orange)",
          padding: "3px",
        }}
      >
        <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="1.4" fill="none" />
        <ellipse cx="11" cy="11" rx="3.5" ry="7" stroke="white" strokeWidth="1.4" fill="none" />
        <line x1="4" y1="11" x2="18" y2="11" stroke="white" strokeWidth="1.4" />
      </svg>
      Out<span>Quest</span>
    </AppLink>
  );
}