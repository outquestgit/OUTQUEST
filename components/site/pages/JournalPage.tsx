"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Page } from "../Page";
import { Breadcrumb } from "../cards/Breadcrumb";
import { Pagination } from "../cards/Pagination";
import { journalGrid, type JournalGridCard } from "@/lib/site/data/journal";
import { DEFAULT_JOURNAL_PAGE, type JournalPageConfig } from "@/lib/site/data/pages";
import type { JournalFeatured } from "@/lib/site/journalMapping";
import { openBlogPost } from "@/lib/site/runtime";

/** Static fallback for the hero article when the DB has no `featured` post. */
const FALLBACK_FEATURED: JournalFeatured = {
  post: "japan-ski",
  tag: "Seasonal Jobs",
  title: "4 months in a Japanese ski resort — the honest version",
  desc: "Powder days, staff dorms, instant friendships, and the best decision I made at 26. Here's what nobody tells you before you go.",
  gradient: "linear-gradient(135deg,#1B3A5A,#2E7AA8,#5BA3D9)",
  emoji: "🏔️",
  image: null,
};

/** Card art style: an uploaded image (cover) or the gradient + emoji. */
function artStyle(gradient: string, image?: string | null) {
  return image
    ? { backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: gradient };
}

/** The Journal index: featured article + "Top Articles" grid. */
export function JournalPage({
  featured = FALLBACK_FEATURED,
  grid = journalGrid,
  hero = DEFAULT_JOURNAL_PAGE,
}: {
  featured?: JournalFeatured;
  grid?: JournalGridCard[];
  hero?: JournalPageConfig;
}) {
  const router = useRouter();
  /**
   * DB posts have a real `/journal/{slug}` route: navigate, so the click leaves a
   * history entry and Back returns here. `openBlogPost` only swaps the in-DOM
   * `blog-post` section (it's in front.js's `_SPA_NO_URL`) and pushes nothing, so
   * Back skipped the listing entirely and landed on whatever preceded it — home.
   * Static seed cards have no route, so they keep the overlay.
   */
  const open = (card: { post: string; href?: string | null }) =>
    card.href ? router.push(card.href) : openBlogPost(card.post);

  const PER_PAGE = 12;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(grid.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const pageItems = grid.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const goPage = (n: number) => {
    if (n < 1 || n > totalPages) return;
    setPage(n);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <Page id="journal">
      <Breadcrumb trail={[{ label: "Home", page: "home" }]} current="Journal" />
      <div
        style={{
          background: "var(--bg2)",
          borderBottom: "1px solid var(--border)",
          padding: "56px 5% 48px",
          textAlign: "center",
        }}
      >
        <div className="label">{hero.label}</div>
        <h1 className="serif-h" style={{ marginBottom: "12px" }}>
          {hero.heading}
        </h1>
        <p className="sub" style={{ maxWidth: "520px", margin: "0 auto" }}>
          {hero.subtitle}
        </p>
      </div>
      <div className="journal-page-wrap">
        {/* FEATURED ARTICLE */}
        <div className="journal-featured">
          <div className="jf-left">
            <div className="jf-tag">{featured.tag}</div>
            <div className="jf-title" onClick={() => open(featured)}>
              {featured.title}
            </div>
            <p className="jf-desc">{featured.desc}</p>
            <span className="jf-readmore" onClick={() => open(featured)}>
              Read more
            </span>
          </div>
          <div className="jf-img" onClick={() => open(featured)}>
            <div className="jf-img-inner" style={artStyle(featured.gradient, featured.image)}>
              {featured.image ? "" : featured.emoji}
            </div>
          </div>
        </div>

        {/* TOP ARTICLES GRID */}
        <div className="journal-section-title">Top Articles</div>
        <div className="journal-grid">
          {pageItems.map((card) => (
            <div className="jg-card" key={card.post} onClick={() => open(card)}>
              <div className="jg-img">
                <div className="jg-img-inner" style={artStyle(card.gradient, card.image)}>
                  {card.image ? "" : card.emoji}
                </div>
              </div>
              <div className="jg-tag">{card.tag}</div>
              <div className="jg-title">{card.title}</div>
            </div>
          ))}
        </div>
        <Pagination current={current} total={totalPages} onGo={goPage} />
      </div>
    </Page>
  );
}
