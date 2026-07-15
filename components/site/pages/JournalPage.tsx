"use client";

import { useState } from "react";
import { getImageProps } from "next/image";
import { useRouter } from "next/navigation";
import { Page } from "../Page";
import { Breadcrumb } from "../cards/Breadcrumb";
import { Pagination } from "../cards/Pagination";
import { journalGrid, type JournalGridCard } from "@/lib/site/data/journal";
import type { JournalPageConfig } from "@/lib/site/data/pages";
import type { JournalFeatured } from "@/lib/site/journalMapping";
import { openBlogPost } from "@/lib/site/runtime";

function optimisedBg(src: string, width: number, height: number): React.CSSProperties {
  const { props } = getImageProps({ src, width, height, quality: 80, alt: "" });
  return {
    backgroundImage: `url("${props.src}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

/** Card art style: an uploaded image routed through the Next.js optimiser, or gradient + emoji. */
function artStyle(gradient: string, image?: string | null, w = 600, h = 400): React.CSSProperties {
  return image ? optimisedBg(image, w, h) : { background: gradient };
}

/** The Journal index: featured article + "Top Articles" grid. */
export function JournalPage({
  featured,
  grid,
  hero,
}: {
  featured: JournalFeatured | null;
  grid: JournalGridCard[];
  hero: JournalPageConfig;
}) {
  const router = useRouter();
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
    <Page id="journal" active>
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
          <h1 className="serif-h" style={{ marginBottom: "12px" }}>{hero.heading}</h1>
          <p className="sub" style={{ maxWidth: "520px", margin: "0 auto" }}>{hero.subtitle}</p>
        </div>
        <div className="journal-page-wrap">
            {/* FEATURED ARTICLE — larger, use 800x500 */}
          {featured && (
            <div className="journal-featured">
              <div className="jf-left">
                <div className="jf-tag">{featured.tag}</div>
                <div className="jf-title" onClick={() => open(featured)}>{featured.title}</div>
                <p className="jf-desc">{featured.desc}</p>
                <span className="jf-readmore" onClick={() => open(featured)}>Read more</span>
              </div>
              <div className="jf-img" onClick={() => open(featured)}>
                <div className="jf-img-inner" style={artStyle(featured.gradient, featured.image, 800, 500)}>
                  {featured.image ? "" : featured.emoji}
                </div>
              </div>
            </div>
          )}

        {/* TOP ARTICLES GRID — smaller cards, use 400x280 */}
        <div className="journal-section-title">Top Articles</div>
        <div className="journal-grid">
          {pageItems.map((card) => (
            <div className="jg-card" key={card.post} onClick={() => open(card)}>
              <div className="jg-img">
                <div className="jg-img-inner" style={artStyle(card.gradient, card.image, 400, 280)}>
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
