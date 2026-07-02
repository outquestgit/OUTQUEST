"use client";

import { Page } from "../Page";
import { showPage, closeBlogPost } from "@/lib/site/runtime";

/**
 * Blog-post reader shell. The breadcrumb title (`#bc-blog-title`) and the body
 * (`#blog-post-content`) are filled by the runtime when a post is opened.
 */
export function BlogPostPage() {
  return (
    <Page id="blog-post">
      <nav className="bc-nav">
        <span onClick={() => showPage("home")}>Home</span>
        <span className="bc-sep">›</span>
        <span onClick={() => showPage("journal")}>Journal</span>
        <span className="bc-sep">›</span>
        <span className="bc-current" id="bc-blog-title">
          Article
        </span>
      </nav>
      <div className="blog-back-bar">
        <button className="blog-back-btn" onClick={() => closeBlogPost()}>
          Back to Journal
        </button>
      </div>
      <div className="blog-post-wrap" id="blog-post-content"></div>
    </Page>
  );
}
