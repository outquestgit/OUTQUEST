"use client";

import { useRouter } from "next/navigation";
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
      <nav className="bc-nav">
        <span onClick={() => router.push("/")}>Home</span>
        <span className="bc-sep">›</span>
        <span onClick={() => router.push("/?p=journal")}>Journal</span>
        <span className="bc-sep">›</span>
        <span className="bc-current">{post.title || "Article"}</span>
      </nav>
      <div className="blog-back-bar">
        <button className="blog-back-btn" onClick={() => router.push("/?p=journal")}>
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
            <div className="journal-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
              {post.related.map((r) => (
                <div
                  className="jg-card"
                  key={r.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push(`/journal/${r.id}`)}
                >
                  <div className="jg-img">
                    <div className="jg-img-inner" style={{ background: r.bg }}>
                      {r.icon}
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
