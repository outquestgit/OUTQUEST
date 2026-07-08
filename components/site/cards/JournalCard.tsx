"use client";

import { useRouter } from "next/navigation";
import type { JournalCard as JournalCardData } from "@/lib/site/data/home";
import { openBlogPost } from "@/lib/site/runtime";

/**
 * The home page's Journal strip card (`.jcard`). Markup is identical to the
 * inline version it was extracted from — an uploaded `image` paints the banner,
 * otherwise the gradient + emoji art is used. Note this is a different design
 * from the Journal index grid card (`.jg-card`), which stays separate.
 */
export function JournalCard({ card }: { card: JournalCardData }) {
  const router = useRouter();
  return (
    <div
      className="jcard"
      // DB posts route to their real page (leaves a history entry, so Back returns
      // here); static seed cards have no route and keep the SPA overlay.
      onClick={() => (card.href ? router.push(card.href) : openBlogPost(card.post))}
      style={{ cursor: "pointer" }}
    >
      <div
        className="jcard-img"
        style={
          card.image
            ? {
                backgroundImage: `url(${card.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : { background: card.imgGradient }
        }
      >
        {card.image ? "" : card.emoji}
      </div>
      <div className="jcard-body">
        <div className="jtag">{card.tag}</div>
        <h3>{card.title}</h3>
        <p>{card.excerpt}</p>
      </div>
    </div>
  );
}
