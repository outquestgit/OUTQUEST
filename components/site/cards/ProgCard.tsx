"use client";

import { useRouter } from "next/navigation";
import type { Program } from "@/lib/site/questMapping";
import { AppLink } from "@/components/site/ui/AppLink";

/**
 * Homepage "Popular Programs" card — the new reference's `.prog-card`. Faithful
 * to the source markup, but the banner uses a gradient + emoji art fallback that
 * always renders, and every action routes to `p.href` (a deal or quest page),
 * since the grid is fed dynamically from the database rather than hardcoded.
 */
export function ProgCard({ program: p }: { program: Program }) {
  const router = useRouter();
  const go = () => router.push(p.href);
  return (
    <div className="prog-card">
      {/* Full-card link (under the footer actions) so the whole card opens in a
          new tab on right/⌘/middle-click; a plain click soft-navigates. */}
      <AppLink
        className="prog-card-cover"
        href={p.href}
        onActivate={go}
        aria-label={p.title}
        style={{ position: "absolute", inset: 0, zIndex: 1 }}
      />
      {p.featured && <div className="prog-card-featured">★ Featured</div>}
      <div className="prog-card-banner">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded URL; sized by CSS (.prog-card-banner img)
          <img src={p.image} alt={p.imageAlt || p.title} loading="lazy" decoding="async" />
        ) : (
          <div className="prog-card-banner-fallback" style={{ background: p.gradient }}>
            {p.art}
          </div>
        )}
      </div>
      <div className="prog-card-body">
        <span className="prog-card-type">{p.type}</span>
        <h3>{p.title}</h3>
        <p className="prog-card-meta">{p.meta}</p>
        {p.tags.length > 0 && (
          <div className="prog-card-tags">
            {p.tags.map((t, i) => (
              <span className="prog-tag" key={i}>
                {t}
              </span>
            ))}
          </div>
        )}
        {/* Above the cover link (z-index) so these stay independently clickable
            and right-clickable. */}
        <div className="prog-card-footer" style={{ position: "relative", zIndex: 2, justifyContent: "flex-end" }}>
          <AppLink className="prog-cta" href={p.href} onActivate={go}>
            {p.questLabel}
          </AppLink>
        </div>
      </div>
    </div>
  );
}