import Image from "next/image";
import type { Program } from "@/lib/site/questMapping";

/**
 * Homepage "Popular Programs" card — the new reference's `.prog-card`. Faithful
 * to the source markup, but the banner uses a gradient + emoji art fallback that
 * always renders, and every action routes to `p.href` (a deal or quest page),
 * since the grid is fed dynamically from the database rather than hardcoded.
 */
export function ProgCard({ program: p }: { program: Program }) {
  return (
    <div className="prog-card">
      <a className="prog-card-cover" href={p.href} aria-label={p.title} style={{ position: "absolute", inset: 0, zIndex: 1 }} />
      {p.featured && <div className="prog-card-featured">★ Featured</div>}
      <div className="prog-card-banner">
        {p.image ? (
          <Image
            src={p.image}
            alt={p.title}
            fill
            sizes="(max-width:600px) 100vw, (max-width:1000px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            loading="lazy"
          />
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
          <a className="prog-cta" href={p.href}>
            {p.questLabel}
          </a>
        </div>
      </div>
    </div>
  );
}