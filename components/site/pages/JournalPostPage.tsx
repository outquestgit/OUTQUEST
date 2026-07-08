"use client";

import { useRouter } from "next/navigation";
import { showPage } from "@/lib/site/runtime";
import type { BlogPostData } from "@/lib/site/journalMapping";

/**
 * Single journal post — reproduces the SPA `openBlogPost` markup/classes exactly
 * (so `front.css` styles it identically) but rendered from the database. Like the
 * Quest/Deal detail components it does NOT use the `.page` wrapper: front.js
 * strips `.active` from every `.page` on load, which would hide a standalone
 * route. The route wraps this in `.quest-detail-route` instead.
 */
export function JournalPostPage({ post }: { post: BlogPostData }) {
  const router = useRouter();
  const artStyle = (gradient: string, image?: string | null) =>
    image
      ? {
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : { background: gradient };

  // A real uploaded featured image paints the hero (cover); else gradient + emoji.
  const heroStyle = post.featuredImage
    ? {
        backgroundImage: `url(${post.featuredImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : { background: post.heroBg };

  return (
    <>
      {/* Route via showPage(), as QuestListing does. A router.push("/?p=journal")
          soft-navigates to the `/` route, whose SiteApp mounts with no
          `initialPage` — PageActivator then re-asserts "home" and the `?p=` query
          is never read (FrontBoot only reads it on script load). showPage() sees
          `#page-journal` is absent on this standalone route and deep-links properly. */}
      <nav className="bc-nav">
        <span onClick={() => showPage("home")}>Home</span>
        <span className="bc-sep">›</span>
        <span onClick={() => showPage("journal")}>Journal</span>
        <span className="bc-sep">›</span>
        <span className="bc-current">{post.title || "Article"}</span>
      </nav>
      <div className="blog-back-bar">
        <button className="blog-back-btn" onClick={() => showPage("journal")}>
          Back to Journal
        </button>
      </div>
      <div className="blog-post-wrap" id="blog-post-content">
        <div className="blog-hero-img" style={heroStyle}>
          {post.featuredImage ? "" : post.heroIcon}
        </div>
        <div className="blog-tag">{post.tag}</div>
        <h1 className="blog-title">{post.title}</h1>
        <div className="blog-meta">
          <span>{post.author}</span>
          <div className="blog-meta-dot"></div>
          <span>{post.date}</span>
        </div>
        <div className="blog-body" dangerouslySetInnerHTML={{ __html: post.body }} />
        {post.related.length > 0 && (
          <div className="blog-related">
            <h3>More from the Journal</h3>
            {/* No inline columns / no `.blog-related` overrides: these are the
                journal-index cards, styled entirely by `.journal-grid` + `.jg-card`. */}
            <div className="journal-grid">
              {post.related.map((r) => (
                <div
                  className="jg-card"
                  key={r.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push(`/journal/${r.id}`)}
                >
                  <div className="jg-img">
                    <div className="jg-img-inner" style={artStyle(r.bg, r.image)}>
                      {r.image ? "" : r.icon}
                    </div>
                  </div>
                  <div className="jg-tag">{r.tag}</div>
                  <div className="jg-title">{r.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
