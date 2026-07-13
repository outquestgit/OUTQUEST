"use client";

import { useState } from "react";
import Image from "next/image";
import { getImageProps } from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";
import { showPage } from "@/lib/site/runtime";
import { useMyQuests } from "@/components/site/state/MyQuestsProvider";
import { useOverlay } from "@/components/site/state/OverlayProvider";
import type { ListingData } from "@/lib/site/questMapping";

function optimisedBg(src: string, width: number, height: number): React.CSSProperties {
  const { props } = getImageProps({ src, width, height, quality: 80, alt: "" });
  return {
    backgroundImage: `url("${props.src}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

/**
 * Single-quest detail, reproducing the SPA listing page's exact markup/classes
 * (so `front.css` styles it identically) but fed from the database. It's a client
 * component so the lightbox + FAQ accordion work via React state instead of the
 * SPA's `showListing` runtime (which reads a non-injectable hardcoded map). Next
 * still server-renders it, so the content is in the HTML for SEO.
 */
export function QuestListing({ data }: { data: ListingData }) {
  const router = useRouter();
  const { isSaved, toggle } = useMyQuests();
  const { openMyQuests, showToast, openShare } = useOverlay();
  const share = () => openShare({ title: data.title });
  const saved = isSaved(data.slug);
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIdx, setLbIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const photos = data.photos;
  const n = photos.length;
  const openLb = (i: number) => { setLbIdx(i % n); setLbOpen(true); };
  const lbNav = (dir: number) => setLbIdx((i) => (i + dir + n) % n);

  // Gallery thumbnails (main: 800x530, thumbs: 400x265)
  const photoBg = (p: { image: string | null; gradient: string }, w: number, h: number) =>
    p.image ? optimisedBg(p.image, w, h) : { background: p.gradient };
  const photoArt = (p: { image: string | null; art: string }) => (p.image ? "" : p.art);

  return (
    <div className="quest-detail-route">
      <nav className="bc-nav">
        <span onClick={() => showPage("home")}>Home</span>
        <span className="bc-sep">›</span>
        <span onClick={() => showPage("quests")}>Quests</span>
        <span className="bc-sep">›</span>
        <span className="bc-current">{data.title}</span>
      </nav>

      {/* PHOTO GRID GALLERY */}
      <div className="gallery">
        <div className="g-photo-grid">
          <div className="g-photo-main" onClick={() => openLb(0)} style={photoBg(photos[0], 800, 530)}>
            <div className="g-photo-inner">{photoArt(photos[0])}</div>
            <div className="g-photo-hover-ov"><div className="g-zoom-icon">⤢</div></div>
            <div className="g-content">
              <div className="g-badges">
                {data.badges.map((b, i) => (
                  <span className="gbadge gb-time" key={i}>{b.emoji} {b.label}</span>
                ))}
              </div>
              <h1>{data.title}</h1>
              <p className="g-tagline">{data.tagline}</p>
            </div>
            {n > 1 && (
              <button className="g-all-btn" onClick={(e) => { e.stopPropagation(); openLb(0); }}>
                🖼 View all photos
              </button>
            )}
          </div>
          <div className="g-photo-thumb" onClick={() => openLb(1)} style={photoBg(photos[1] || photos[0], 400, 265)}>
            <div className="g-photo-inner">{photoArt(photos[1] || photos[0])}</div>
            <div className="g-photo-hover-ov"><div className="g-zoom-icon">⤢</div></div>
          </div>
          <div className="g-photo-thumb" onClick={() => openLb(2)} style={photoBg(photos[2] || photos[0], 400, 265)}>
            <div className="g-photo-inner">{photoArt(photos[2] || photos[0])}</div>
            <div className="g-photo-hover-ov"><div className="g-zoom-icon">⤢</div></div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX — uses <Image> for uploaded photos for proper optimisation */}
      <div
        className={`lightbox-wrap${lbOpen ? " show" : ""}`}
        onClick={(e) => { if (e.target === e.currentTarget) setLbOpen(false); }}
      >
        <div className="lightbox-inner">
          <button className="lightbox-close" onClick={() => setLbOpen(false)}>✕</button>
          {(() => {
            const cur = photos[lbIdx] || photos[0];
            return cur.image ? (
              <div className="lightbox-img" style={{ opacity: 1, animation: "none", position: "relative", minHeight: "300px" }}>
                {/* next/image in lightbox: constrained to viewport, quality high for zoom */}
                <Image
                  src={cur.image}
                  alt=""
                  fill
                  sizes="90vw"
                  quality={85}
                  style={{ objectFit: "contain", borderRadius: "16px" }}
                />
              </div>
            ) : (
              <div className="lightbox-img">
                <div className="lightbox-img-bg" style={photoBg(cur, 800, 530)}></div>
                <div className="lightbox-img-emoji">{photoArt(cur)}</div>
              </div>
            );
          })()}
          <div className="lightbox-nav">
            <button className="lb-arr" onClick={() => lbNav(-1)}>←</button>
            <div className="lb-dots">
              {photos.map((_, i) => (
                <div className={`lb-dot${i === lbIdx ? " on" : ""}`} key={i} onClick={() => setLbIdx(i)}></div>
              ))}
            </div>
            <span className="lb-counter">{lbIdx + 1} / {n}</span>
            <button className="lb-arr" onClick={() => lbNav(1)}>→</button>
          </div>
        </div>
      </div>

      <div className="listing-body">
        <div className="listing-save-bar">
          <button
            className={saved ? "listing-save-btn saved" : "listing-save-btn"}
            onClick={() => { if (toggle(data.slug)) showToast("🔖 Saved to My Quests"); }}
          >
            {saved ? "✓ In My Quests" : "🔖 Save to My Quests"}
          </button>
          <button className="listing-share-btn" onClick={() => share()}>Share this quest</button>
          <button className={saved ? "listing-view-mq show" : "listing-view-mq"} onClick={() => openMyQuests()}>
            View My Quests
          </button>
        </div>

        <div className="quest-stats-bar" style={{ marginBottom: "48px" }}>
          {data.stats.map((s, i) => (
            <div className="qs-item" key={i}>
              <div className="qs-icon">{s.icon}</div>
              <div>
                <div className="qs-label">{s.label}</div>
                <div className="qs-val">{s.val}</div>
              </div>
            </div>
          ))}
        </div>

        {data.outcomePills.length > 0 && (
          <div style={{ marginBottom: "40px" }}>
            <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "18px", padding: "22px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--text3)", marginBottom: "12px" }}>
                Outcome Goal
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {data.outcomePills.map((p, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "50px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, color: "var(--text2)" }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {data.intro && (
          <div style={{ marginBottom: "48px" }}>
            <div className="label">Overview</div>
            <h2 className="serif-h" style={{ marginBottom: "16px" }}>About This Quest</h2>
            <p style={{ fontSize: "16px", lineHeight: 1.7, color: "var(--text2)", whiteSpace: "pre-line" }}>{data.intro}</p>
          </div>
        )}

        {data.unlocks.length > 0 && (
          <div style={{ marginBottom: "48px" }}>
            <div className="label">What you gain</div>
            <h2 className="serif-h" style={{ marginBottom: "20px" }}>What This Quest Unlocks</h2>
            <div className="unlock-grid">
              {data.unlocks.map((u, i) => (
                <div className="unlock-card" key={i}>
                  <div className="unlock-icon">{u.i}</div>
                  <h4>{u.t}</h4>
                  <p>{u.p}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.immersive && (
          <div style={{ marginBottom: "48px" }}>
            <div className="label">The experience</div>
            <h2 className="serif-h" style={{ marginBottom: "16px" }}>What This Quest Looks Like</h2>
            <div className="immersive" dangerouslySetInnerHTML={{ __html: data.immersive }} />
          </div>
        )}

        {data.why && (
          <div style={{ marginBottom: "48px" }}>
            <div className="label">Why this matters</div>
            <h2 className="serif-h" style={{ marginBottom: "16px" }}>Why do this</h2>
            <div className="rte-content" style={{ fontSize: "16px", lineHeight: 1.7, color: "var(--text2)" }} dangerouslySetInnerHTML={{ __html: data.why }} />
          </div>
        )}

        {data.embark.length > 0 && (
          <div style={{ marginBottom: "48px" }}>
            <div className="label">Take action</div>
            <h2 className="serif-h" style={{ marginBottom: "16px" }}>Embark On This Quest</h2>
            <div className="embark-list">
              {data.embark.map((e, i) => (
                <div className="embark-item" key={i}>
                  <div className="e-num">{i + 1}</div>
                  <div className="e-body">
                    <strong>{e.t}</strong>
                    <p>{e.p}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.prepTiers.length > 0 && (
          <div style={{ marginBottom: "48px" }}>
            <h2 className="serif-h" style={{ marginBottom: "32px" }}>Everything else you&apos;ll need</h2>
            <div>
              {data.prepTiers.map((tier, ri) => (
                <div className={`prep-tier ${tier.cls}`} key={ri}>
                  <div className="prep-tier-header">
                    <div className="prep-tier-num">{ri + 1}</div>
                    <div><div className="prep-tier-label">{tier.label}</div></div>
                    <span className="prep-tier-sub">{tier.sub}</span>
                  </div>
                  <div className="reel-grid">
                    {tier.items.map((p, ii) => {
                      const href = p.dealPage ? `/deals/${p.dealPage}?from=${data.slug}` : null;
                      // prepTier reel items use static seed data (p.img) — not Supabase URLs.
                      // Keep raw backgroundImage; these are not subject to image optimisation.
                      const body = (
                        <>
                          <div className="reel-img" style={p.img ? { backgroundImage: `url(${p.img})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: p.bg }}>
                            {!p.img && p.i}
                          </div>
                          <div className="reel-body">
                            <h4>{p.t}</h4>
                            {p.btn && <span className="btn-dark" style={{ background: "var(--orange)", display: "block", textAlign: "center" }}>{p.btn}</span>}
                          </div>
                        </>
                      );
                      return href ? (
                        <Link className="reel-card" key={ii} href={href} style={{ display: "block", cursor: "pointer", color: "inherit", textDecoration: "none" }}>
                          {body}
                        </Link>
                      ) : (
                        <div className="reel-card" key={ii}>{body}</div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="cta-band">
          <h3>{data.companion.heading}</h3>
          <p>{data.companion.body}</p>
          <Button style={{ fontSize: "15px", padding: "16px 36px" }} onClick={() => share()}>
            {data.companion.button}
          </Button>
        </div>

        {data.faq.length > 0 && (
          <div style={{ marginTop: "48px", marginBottom: "48px" }}>
            <div className="label">Common questions</div>
            <h2 className="serif-h" style={{ marginBottom: "4px" }}>FAQ</h2>
            <div className="faq-wrap">
              {data.faq.map((f, i) => (
                <div className="fq" key={i}>
                  <div className="fq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{f.q}</span>
                    <div className="fq-ico">{openFaq === i ? "−" : "+"}</div>
                  </div>
                  <div className={`fq-a${openFaq === i ? " open" : ""}`}><p>{f.a}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.similar.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <div className="label">Keep exploring</div>
            <h2 className="serif-h" style={{ marginBottom: "20px" }}>Similar OutQuests</h2>
            <div className="pq-grid" id="l-similar">
              {data.similar.map((s) => (
                <div
                  className="qcard"
                  key={s.slug}
                  onClick={() => router.push(s.href)}
                  style={s.image ? optimisedBg(s.image, 400, 600) : { background: s.gradient }}
                >
                  <div className="qcard-art">{s.image ? "" : s.art}</div>
                  <div className="qcard-ov"></div>
                  <div className="qcard-badge">{s.badge}</div>
                  <div className="qcard-info">
                    <h3>{s.title}</h3>
                    <div className="qcard-meta">{s.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
