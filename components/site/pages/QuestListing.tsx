"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";
import { showPage } from "@/lib/site/runtime";
import { useMyQuests } from "@/components/site/state/MyQuestsProvider";
import { useOverlay } from "@/components/site/state/OverlayProvider";
import type { ListingData } from "@/lib/site/questMapping";

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
  const openLb = (i: number) => {
    setLbIdx(i % n);
    setLbOpen(true);
  };
  const lbNav = (dir: number) => setLbIdx((i) => (i + dir + n) % n);
  // A photo paints either a real uploaded image (cover) or a gradient + emoji art.
  const photoBg = (p: { image: string | null; gradient: string }) =>
    p.image
      ? { backgroundImage: `url(${p.image})`, backgroundSize: "cover", backgroundPosition: "center" }
      : { background: p.gradient };
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
          <div className="g-photo-main" onClick={() => openLb(0)} style={photoBg(photos[0])}>
            <div className="g-photo-inner">{photoArt(photos[0])}</div>
            <div className="g-photo-hover-ov">
              <div className="g-zoom-icon">⤢</div>
            </div>
            <div className="g-content">
              <div className="g-badges">
                {data.badges.map((b, i) => (
                  <span className="gbadge gb-time" key={i}>
                    {b.emoji} {b.label}
                  </span>
                ))}
              </div>
              <h1>{data.title}</h1>
              <p className="g-tagline">{data.tagline}</p>
            </div>
            {n > 1 && (
              <button
                className="g-all-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openLb(0);
                }}
              >
                🖼 View all photos
              </button>
            )}
          </div>
          <div className="g-photo-thumb" onClick={() => openLb(1)} style={photoBg(photos[1] || photos[0])}>
            <div className="g-photo-inner">{photoArt(photos[1] || photos[0])}</div>
            <div className="g-photo-hover-ov">
              <div className="g-zoom-icon">⤢</div>
            </div>
          </div>
          <div className="g-photo-thumb" onClick={() => openLb(2)} style={photoBg(photos[2] || photos[0])}>
            <div className="g-photo-inner">{photoArt(photos[2] || photos[0])}</div>
            <div className="g-photo-hover-ov">
              <div className="g-zoom-icon">⤢</div>
            </div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      <div
        className={`lightbox-wrap${lbOpen ? " show" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setLbOpen(false);
        }}
      >
        <div className="lightbox-inner">
          <button className="lightbox-close" onClick={() => setLbOpen(false)}>
            ✕
          </button>
          {/* The gradient+emoji fallback gets its height from the 160px emoji and
              is intentionally dimmed to 0.28 (front.css `.lightbox-img` + `lbImgIn`).
              A real uploaded photo has an EMPTY emoji, so the emoji-driven height
              collapses and the absolutely-positioned `.lightbox-img-bg` (inset:0)
              has no area to fill — the image never shows (only the nav renders).
              So render a real <img> for photos: it supplies its own height and
              shows at full opacity; keep the dimmed gradient+emoji for fallbacks. */}
          {(() => {
            const cur = photos[lbIdx] || photos[0];
            return cur.image ? (
              <div className="lightbox-img" style={{ opacity: 1, animation: "none" }}>
                <img
                  src={cur.image}
                  alt=""
                  style={{ maxWidth: "100%", maxHeight: "78vh", display: "block", borderRadius: "16px" }}
                />
              </div>
            ) : (
              <div className="lightbox-img">
                <div className="lightbox-img-bg" style={photoBg(cur)}></div>
                <div className="lightbox-img-emoji">{photoArt(cur)}</div>
              </div>
            );
          })()}
          <div className="lightbox-nav">
            <button className="lb-arr" onClick={() => lbNav(-1)}>
              ←
            </button>
            <div className="lb-dots">
              {photos.map((_, i) => (
                <div className={`lb-dot${i === lbIdx ? " on" : ""}`} key={i} onClick={() => setLbIdx(i)}></div>
              ))}
            </div>
            <span className="lb-counter">
              {lbIdx + 1} / {n}
            </span>
            <button className="lb-arr" onClick={() => lbNav(1)}>
              →
            </button>
          </div>
        </div>
      </div>

      <div className="listing-body">
        <div className="listing-save-bar">
          <button
            className={saved ? "listing-save-btn saved" : "listing-save-btn"}
            onClick={() => {
              if (toggle(data.slug)) showToast("🔖 Saved to My Quests");
            }}
          >
            {saved ? "✓ In My Quests" : "🔖 Save to My Quests"}
          </button>
          <button className="listing-share-btn" onClick={() => share()}>
            Share this quest
          </button>
          <button
            className={saved ? "listing-view-mq show" : "listing-view-mq"}
            onClick={() => openMyQuests()}
          >
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
            <div
              style={{
                background: "var(--white)",
                border: "1px solid var(--border)",
                borderRadius: "18px",
                padding: "22px 24px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "var(--text3)",
                  marginBottom: "12px",
                }}
              >
                Outcome Goal
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {data.outcomePills.map((p, i) => (
                  <span
                    key={i}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "50px",
                      padding: "8px 16px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--text2)",
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {data.unlocks.length > 0 && (
          <div style={{ marginBottom: "48px" }}>
            <div className="label">What you gain</div>
            <h2 className="serif-h" style={{ marginBottom: "20px" }}>
              What this OutQuest unlocks
            </h2>
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
            <h2 className="serif-h" style={{ marginBottom: "16px" }}>
              What this quest looks like
            </h2>
            <div className="immersive" dangerouslySetInnerHTML={{ __html: data.immersive }} />
          </div>
        )}

        {data.why && (
          <div style={{ marginBottom: "48px" }}>
            <div className="label">Why this matters</div>
            <h2 className="serif-h" style={{ marginBottom: "16px" }}>
              Why do this
            </h2>
            <div
              className="rte-content"
              style={{ fontSize: "16px", lineHeight: 1.7, color: "var(--text2)" }}
              dangerouslySetInnerHTML={{ __html: data.why }}
            />
          </div>
        )}


        {data.embark.length > 0 && (
          <div style={{ marginBottom: "48px" }}>
            <div className="label">Take action</div>
            <h2 className="serif-h" style={{ marginBottom: "16px" }}>
              Embark On This OutQuest
            </h2>
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
            <h2 className="serif-h" style={{ marginBottom: "32px" }}>
              Everything else you&apos;ll need
            </h2>
            <div>
              {data.prepTiers.map((tier, ri) => (
                <div className={`prep-tier ${tier.cls}`} key={ri}>
                  <div className="prep-tier-header">
                    <div className="prep-tier-num">{ri + 1}</div>
                    <div>
                      <div className="prep-tier-label">{tier.label}</div>
                    </div>
                    <span className="prep-tier-sub">{tier.sub}</span>
                  </div>
                  <div className="reel-grid">
                    {tier.items.map((p, ii) => {
                      const href = p.dealPage ? `/deals/${p.dealPage}?from=${data.slug}` : null;
                      const body = (
                        <>
                          <div
                            className="reel-img"
                            style={
                              p.img
                                ? { backgroundImage: `url(${p.img})`, backgroundSize: "cover", backgroundPosition: "center" }
                                : { background: p.bg }
                            }
                          >
                            {!p.img && p.i}
                          </div>
                          <div className="reel-body">
                            <h4>{p.t}</h4>
                            {p.btn && (
                              <span
                                className="btn-dark"
                                style={{ background: "var(--orange)", display: "block", textAlign: "center" }}
                              >
                                {p.btn}
                              </span>
                            )}
                          </div>
                        </>
                      );
                      // Render linked deals as a real anchor wrapping the whole
                      // card, so the entire card is one reliable click target
                      // (keyboard-accessible, middle-click/open-in-new-tab, and
                      // no lost first-tap from the hover lift on touch devices).
                      return href ? (
                        <Link
                          className="reel-card"
                          key={ii}
                          href={href}
                          style={{ display: "block", cursor: "pointer", color: "inherit", textDecoration: "none" }}
                        >
                          {body}
                        </Link>
                      ) : (
                        <div className="reel-card" key={ii}>
                          {body}
                        </div>
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
          <Button
            style={{ fontSize: "15px", padding: "16px 36px" }}
            onClick={() => share()}
          >
            {data.companion.button}
          </Button>
        </div>

        {data.faq.length > 0 && (
          <div style={{ marginTop: "48px", marginBottom: "48px" }}>
            <div className="label">Common questions</div>
            <h2 className="serif-h" style={{ marginBottom: "4px" }}>
              FAQ
            </h2>
            <div className="faq-wrap">
              {data.faq.map((f, i) => (
                <div className="fq" key={i}>
                  <div className="fq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{f.q}</span>
                    <div className="fq-ico">{openFaq === i ? "−" : "+"}</div>
                  </div>
                  <div className={`fq-a${openFaq === i ? " open" : ""}`}>
                    <p>{f.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.similar.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <div className="label">Keep exploring</div>
            <h2 className="serif-h" style={{ marginBottom: "20px" }}>
              Similar OutQuests
            </h2>
            <div className="pq-grid" id="l-similar">
              {data.similar.map((s) => (
                <div
                  className="qcard"
                  key={s.slug}
                  onClick={() => router.push(s.href)}
                  style={{ background: s.gradient }}
                >
                  <div className="qcard-art">{s.art}</div>
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
