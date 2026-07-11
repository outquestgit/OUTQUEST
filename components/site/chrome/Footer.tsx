"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import type { FooterConfig } from "@/lib/site/chromeConfig";
import { DEFAULT_FOOTER, DEFAULT_FOOTER_STYLE } from "@/lib/site/chromeConfig";
import { navigateTo, internalHref } from "@/lib/site/runtime";
import { AppLink } from "@/components/site/ui/AppLink";

/** Renders the social glyph row — each glyph links out when a URL is set. */
function SocialRow({ socials, urls }: { socials: string[]; urls: string[] }) {
  return (
    <div className="si">
      {socials.map((icon, i) =>
        urls[i] ? (
          <a className="sb" key={i} href={urls[i]} target="_blank" rel="noreferrer">
            {icon}
          </a>
        ) : (
          <div className="sb" key={i}>
            {icon}
          </div>
        )
      )}
    </div>
  );
}

/** Site footer: brand blurb + social row, link columns, and the bottom bar. */
export function Footer({ footer = DEFAULT_FOOTER }: { footer?: FooterConfig }) {
  const copyright = footer.copyright.replace(/\{year\}/g, String(new Date().getFullYear()));
  const socials = footer.socials ?? [];
  const urls = footer.socialUrls ?? [];
  const style = { ...DEFAULT_FOOTER_STYLE, ...footer.style };

  const footerStyle: CSSProperties = {};
  if (style.bgColor) footerStyle.background = style.bgColor;
  if (style.textColor) footerStyle.color = style.textColor;

  // The `.ft-top` grid is 5 tracks (brand + 4 columns) by default; the layout
  // preset overrides how many tracks it uses.
  const topStyle: CSSProperties = {};
  if (style.layout === "centered") {
    topStyle.gridTemplateColumns = "1fr";
    topStyle.textAlign = "center";
    topStyle.justifyItems = "center";
  } else if (style.layout === "3col") {
    topStyle.gridTemplateColumns = "minmax(0,1.6fr) repeat(3,minmax(0,1fr))";
  } else if (style.layout === "2col") {
    topStyle.gridTemplateColumns = "minmax(0,1.6fr) repeat(2,minmax(0,1fr))";
  }

  return (
    <footer className={style.textColor ? "ft-custom-text" : undefined} style={footerStyle}>
      {/* Footer text colours are hardcoded in the stylesheet, so a custom colour
          needs a scoped override (hex-validated server-side). The column-label
          and wordmark accent stay orange on purpose. */}
      {style.textColor && (
        <style>{`footer.ft-custom-text .ft-logo,footer.ft-custom-text .ft-desc,footer.ft-custom-text a,footer.ft-custom-text .ft-bot p{color:${style.textColor}}`}</style>
      )}
      <div className="ft-top" style={topStyle}>
        <div>
          {footer.logoUrl ? (
            <Image
              className="ft-logo"
              src={footer.logoUrl}
              alt={`${footer.wordmark1}${footer.wordmark2}`}
              width={160}
              height={40}
              style={{ maxHeight: "40px", width: "auto" }}
            />
          ) : (
            <span className="ft-logo">
              {footer.wordmark1}
              <span>{footer.wordmark2}</span>
            </span>
          )}
          <p className="ft-desc">{footer.tagline}</p>
          <SocialRow socials={socials} urls={urls} />
        </div>
        {footer.columns.map((col, i) => (
          <div key={i}>
            <div className="fc-lbl">{col.label}</div>
            {col.links.map((link, k) => (
              <AppLink key={k} href={internalHref(link.url)} onActivate={() => navigateTo(link.url)}>
                {link.label}
              </AppLink>
            ))}
          </div>
        ))}
      </div>
      <div className="ft-bot">
        <p>{copyright}</p>
        {footer.showSocialBottom ? <SocialRow socials={socials} urls={urls} /> : null}
        <p>{footer.bottomTagline}</p>
      </div>
    </footer>
  );
}