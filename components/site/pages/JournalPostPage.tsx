"use client";

import { getImageProps } from "next/image";
import { useRouter } from "next/navigation";
import { showPage } from "@/lib/site/runtime";
import type { BlogPostData } from "@/lib/site/journalMapping";

function optimisedBg(src: string, width: number, height: number): React.CSSProperties {
  const { props } = getImageProps({ src, width, height, quality: 80, alt: "" });
  return {
    backgroundImage: `url("${props.src}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

function artStyle(gradient: string, image?: string | null, w = 400, h = 280): React.CSSProperties {
  return image ? optimisedBg(image, w, h) : { background: gradient };
}

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
  // Hero is a wide banner — 1200x500 is a good optimisation target.
  const heroStyle = post.featuredImage
    ? optimisedBg(post.featuredImage, 1200, 500)
    : { background: post.heroBg };

  return (
    <>
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
            <div className="journal-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
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
