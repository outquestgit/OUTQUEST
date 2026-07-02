"use client";

import type { CSSProperties } from "react";
import type { NavConfig } from "@/lib/site/chromeConfig";
import {
  DEFAULT_NAV,
  DEFAULT_CTA,
  DEFAULT_DISPLAY,
  DEFAULT_NAV_STYLE,
} from "@/lib/site/chromeConfig";
import { showPage, openQuiz, navigateTo, internalHref } from "@/lib/site/runtime";
import { useMyQuests } from "@/components/site/state/MyQuestsProvider";
import { useOverlay } from "@/components/site/state/OverlayProvider";
import { AppLink } from "@/components/site/ui/AppLink";
import { NavLogo } from "./NavLogo";

/**
 * Desktop top navigation: logo, the hover dropdowns (driven by the admin-managed
 * nav `links`), the "My Quests" drawer button, the CTA button, and the mobile
 * hamburger. A link with `dropdown` children renders as a hover pill-dropdown;
 * a childless link is a plain pill that routes on click. Behaviour is delegated
 * to the runtime via `lib/site/runtime`.
 *
 * The whole admin-managed `nav` config drives appearance: `cta` (label/url/
 * style/visibility), `display` (sticky / show-on-all-pages / transparent-on-
 * hero), and `style` (background / text colour / bottom border).
 */
export function Nav({ nav = DEFAULT_NAV }: { nav?: NavConfig }) {
  const { count } = useMyQuests();
  const { openMyQuests, toggleMobileMenu, mobileMenuOpen } = useOverlay();
  const links = nav.links ?? DEFAULT_NAV.links;
  const brand = nav.brand;
  const cta = { ...DEFAULT_CTA, ...nav.cta };
  const display = { ...DEFAULT_DISPLAY, ...nav.display };
  const style = { ...DEFAULT_NAV_STYLE, ...nav.style };

  // "Show nav on all pages" off → render nothing (also hides the hamburger).
  if (!display.showOnAllPages) return null;

  // A custom logo link (other than home/"/") routes there; otherwise the logo
  // returns to the SPA home view as before.
  const hasLogoLink = brand?.logoLink && brand.logoLink !== "/";
  const onLogo = hasLogoLink ? () => navigateTo(brand!.logoLink) : () => showPage("home");
  const logoHref = hasLogoLink ? internalHref(brand!.logoLink) : "/";

  const navStyle: CSSProperties = {};
  if (!display.sticky) navStyle.position = "relative"; // overrides the sticky default

  const innerStyle: CSSProperties = {};
  if (style.bgColor) innerStyle.background = style.bgColor;
  if (style.textColor) innerStyle.color = style.textColor;
  if (!style.showBorder) innerStyle.border = "none";

  const navClass =
    [display.transparentOnHero ? "nav-hero-transparent" : "", style.textColor ? "nav-custom-text" : ""]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <nav className={navClass} style={navStyle}>
      {/* The pill colours are set with !important in the stylesheet, so a custom
          text colour needs an equally-specific override (colour is hex-validated
          server-side before it ever reaches here). */}
      {style.textColor && (
        <style>{`nav.nav-custom-text .nav-pill,nav.nav-custom-text .nav-logo,nav.nav-custom-text .mq-nav-btn{color:${style.textColor} !important}`}</style>
      )}
      <div className="nav-inner" style={innerStyle}>
        <NavLogo onClick={onLogo} href={logoHref} brand={brand} />
        <div className="nav-pill-bar" id="nav-pill-bar">
          <div className="nav-pill-track">
            {links.map((link, i) => {
              const hasDropdown = !!link.dropdown && link.dropdown.length > 0;
              return (
                <div className="nav-pill-dd" key={i}>
                  {hasDropdown ? (
                    <>
                      {/* The parent pill is a real link to its own URL (so it
                          opens in a new tab on right/⌘/middle-click); the dropdown
                          still opens on hover. `capture` fires before front.js's
                          bubble handler — which toggles the menu + stopPropagation
                          — so a plain click's soft-nav isn't swallowed. With no URL
                          it stays a pure dropdown toggle (a plain button). */}
                      {link.url ? (
                        <AppLink
                          className={`nav-pill${i === 0 ? " active-pill" : ""} nav-pill-arrow`}
                          href={internalHref(link.url)}
                          target={link.target}
                          capture
                          onActivate={() => navigateTo(link.url, link.target)}
                        >
                          {link.label} <span className="nav-pill-caret">▾</span>
                        </AppLink>
                      ) : (
                        <button className={`nav-pill${i === 0 ? " active-pill" : ""} nav-pill-arrow`}>
                          {link.label} <span className="nav-pill-caret">▾</span>
                        </button>
                      )}
                      <div className="nav-pill-dropdown">
                        {link.dropdown!.map((child, k) => (
                          // `capture`: front.js attaches a bubble-phase
                          // stopPropagation to `.nav-pill-dropdown`, which would
                          // kill React's delegated handler before it reaches the
                          // root. Capturing fires first.
                          <AppLink
                            key={k}
                            href={internalHref(child.url)}
                            capture
                            onActivate={() => navigateTo(child.url)}
                          >
                            {child.label}
                          </AppLink>
                        ))}
                      </div>
                    </>
                  ) : (
                    <AppLink
                      className={`nav-pill${i === 0 ? " active-pill" : ""}`}
                      href={internalHref(link.url)}
                      target={link.target}
                      onActivate={() => navigateTo(link.url, link.target)}
                    >
                      {link.label}
                    </AppLink>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="nav-right">
          <button className="mq-nav-btn" id="mq-nav-btn" onClick={() => openMyQuests()}>
            🗺️ My Quests{" "}
            <span className={count > 0 ? "mq-badge show" : "mq-badge"} id="mq-nav-badge">
              {count}
            </span>
          </button>
          {cta.show &&
            (cta.url ? (
              <AppLink
                className={`nav-cta${cta.style === "ghost" ? " nav-cta-ghost" : ""}`}
                href={internalHref(cta.url)}
                onActivate={() => navigateTo(cta.url)}
              >
                {cta.label}
              </AppLink>
            ) : (
              // No URL → the CTA opens the quiz, so it stays a button.
              <button
                className={`nav-cta${cta.style === "ghost" ? " nav-cta-ghost" : ""}`}
                onClick={() => openQuiz()}
              >
                {cta.label}
              </button>
            ))}
        </div>
        <button
          className={mobileMenuOpen ? "hamburger-btn open" : "hamburger-btn"}
          id="hamburger-btn"
          onClick={() => toggleMobileMenu()}
          aria-label="Open menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
