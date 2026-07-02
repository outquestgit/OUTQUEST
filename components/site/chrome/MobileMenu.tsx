"use client";

import { Fragment } from "react";
import type { NavConfig } from "@/lib/site/chromeConfig";
import { DEFAULT_NAV, DEFAULT_CTA, DEFAULT_DISPLAY } from "@/lib/site/chromeConfig";
import { showPage, openQuiz, navigateTo, internalHref } from "@/lib/site/runtime";
import { useMyQuests } from "@/components/site/state/MyQuestsProvider";
import { useOverlay } from "@/components/site/state/OverlayProvider";
import { AppLink } from "@/components/site/ui/AppLink";
import { NavLogo } from "./NavLogo";

/**
 * Slide-in mobile navigation (overlay + panel). Mirrors `<Nav>` from the same
 * admin-managed `nav` config — a link with dropdown children becomes a labelled
 * section; a childless link is a single top-level entry. The footer button
 * mirrors the desktop CTA. Every link closes the menu before routing.
 * Visibility is toggled by the runtime via the `#mobile-menu*` ids.
 */
export function MobileMenu({ nav = DEFAULT_NAV }: { nav?: NavConfig }) {
  const { count } = useMyQuests();
  const { openMyQuests, closeMobileMenu, mobileMenuOpen } = useOverlay();
  const links = nav.links ?? DEFAULT_NAV.links;
  const brand = nav.brand;
  const cta = { ...DEFAULT_CTA, ...nav.cta };
  const display = { ...DEFAULT_DISPLAY, ...nav.display };

  // "Show nav on all pages" off → no mobile menu either (the hamburger that
  // opens it is gone too).
  if (!display.showOnAllPages) return null;

  const go = (url: string, target?: "_self" | "_blank") => {
    closeMobileMenu();
    navigateTo(url, target);
  };
  // Mirror the desktop nav: a custom logo link routes there (after closing the
  // menu); otherwise the logo returns home.
  const hasLogoLink = brand?.logoLink && brand.logoLink !== "/";
  const onLogo = hasLogoLink
    ? () => go(brand!.logoLink)
    : () => {
        closeMobileMenu();
        showPage("home");
      };
  const logoHref = hasLogoLink ? internalHref(brand!.logoLink) : "/";
  return (
    <>
      <div
        className={mobileMenuOpen ? "mobile-menu-overlay open" : "mobile-menu-overlay"}
        id="mobile-menu-overlay"
        onClick={() => closeMobileMenu()}
      ></div>
      <div className={mobileMenuOpen ? "mobile-menu open" : "mobile-menu"} id="mobile-menu">
        <div className="mobile-menu-header">
          <NavLogo size={20} marginRight={5} onClick={onLogo} href={logoHref} brand={brand} />
          <button className="mobile-menu-close" onClick={() => closeMobileMenu()}>
            ✕
          </button>
        </div>
        <nav className="mobile-menu-links">
          {links.map((link, i) => {
            const hasDropdown = !!link.dropdown && link.dropdown.length > 0;
            return (
              <Fragment key={i}>
                {i > 0 && <div className="mm-divider"></div>}
                {hasDropdown ? (
                  <>
                    {/* The section label links to the parent's own URL when it
                        has one (so it's openable in a new tab); otherwise it's a
                        plain header. */}
                    {link.url ? (
                      <AppLink
                        className="mm-section-label"
                        style={{ cursor: "pointer", display: "block" }}
                        href={internalHref(link.url)}
                        target={link.target}
                        onActivate={() => go(link.url, link.target)}
                      >
                        {link.label}
                      </AppLink>
                    ) : (
                      <div className="mm-section-label">{link.label}</div>
                    )}
                    {link.dropdown!.map((child, k) => (
                      <AppLink key={k} href={internalHref(child.url)} onActivate={() => go(child.url)}>
                        {child.label}
                      </AppLink>
                    ))}
                  </>
                ) : (
                  <AppLink
                    href={internalHref(link.url)}
                    target={link.target}
                    onActivate={() => go(link.url, link.target)}
                  >
                    {link.label}
                  </AppLink>
                )}
              </Fragment>
            );
          })}
        </nav>
        <div className="mobile-menu-footer">
          <button
            className="mq-nav-btn"
            style={{ width: "100%", justifyContent: "center", marginBottom: "10px" }}
            onClick={() => {
              closeMobileMenu();
              openMyQuests();
            }}
          >
            🗺️ My Quests{" "}
            <span className={count > 0 ? "mq-badge show" : "mq-badge"} id="mq-nav-badge-m">
              {count}
            </span>
          </button>
          {cta.show &&
            (cta.url ? (
              <AppLink
                className="btn-orange"
                style={{ width: "100%", padding: "14px", textAlign: "center" }}
                href={internalHref(cta.url)}
                onActivate={() => go(cta.url)}
              >
                {cta.label}
              </AppLink>
            ) : (
              // No URL → opens the quiz, so it stays a button.
              <button
                className="btn-orange"
                style={{ width: "100%", padding: "14px" }}
                onClick={() => {
                  closeMobileMenu();
                  openQuiz();
                }}
              >
                {cta.label}
              </button>
            ))}
        </div>
      </div>
    </>
  );
}
