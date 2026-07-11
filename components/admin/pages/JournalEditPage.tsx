"use client";

import {
  switchTab,
  autoSlug,
  syncJournalSerp,
  rteCmd,
  applyBlockFormat,
  openLinkModal,
  insertRteImage,
  handleRteImage,
  handleRteKeydown,
  rteSaveSelection,
  rteRestoreSelection,
  updateJournalSeo,
  updateJournalSeoDesc,
  setStatus,
  toggleDatePicker,
  dpShift,
  toggleSchedFields,
} from "@/lib/admin/runtime";

/** Schedule timezones — [offset in minutes east of UTC, label]. JournalBridge
 *  uses the offset to compute the absolute UTC publish moment, so a scheduled
 *  post goes live at the chosen wall-clock time in this zone, wherever it's
 *  viewed. */
const TIMEZONES: [string, string][] = [
  ["-480", "UTC-8 (Los Angeles)"],
  ["-300", "UTC-5 (New York)"],
  ["-180", "UTC-3 (São Paulo)"],
  ["0", "UTC±0 (London)"],
  ["60", "UTC+1 (Paris / Berlin)"],
  ["180", "UTC+3 (Moscow / Nairobi)"],
  ["240", "UTC+4 (Dubai)"],
  ["330", "UTC+5:30 (India)"],
  ["420", "UTC+7 (Bangkok / Jakarta)"],
  ["480", "UTC+8 (Kuala Lumpur / Singapore)"],
  ["540", "UTC+9 (Tokyo / Seoul)"],
  ["600", "UTC+10 (Sydney)"],
];

/**
 * Journal post editor (`#page-journal-edit`). Faithful transcription of the
 * reference (tabbed editor, RTE toolbar, SEO SERP preview, publish + schedule
 * date pickers). `JournalBridge` wires Save/Edit by id; inline handlers call the
 * runtime; inputs stay uncontrolled.
 */
export function JournalEditPage() {
  return (
    <div className="page" id="page-journal-edit" suppressHydrationWarning>
      <div className="edit-layout">
        <div className="edit-main">
          <div className="section-card">
            <div className="tabs" id="journal-tabs">
              <div className="tab active" onClick={() => switchTab("journal-tabs", "journal-panels", 0)}>
                Content
              </div>
              <div className="tab" onClick={() => switchTab("journal-tabs", "journal-panels", 1)}>
                Categories
              </div>
              <div className="tab" onClick={() => switchTab("journal-tabs", "journal-panels", 2)}>
                SEO
              </div>
            </div>
            <div id="journal-panels">
              {/* CONTENT TAB */}
              <div className="tab-panel active" style={{ gap: "14px" }}>
                <div className="field">
                  <label>Post Title</label>
                  <input
                    type="text"
                    id="j-title"
                    placeholder="e.g. Top 5 Quests This Monsoon"
                    onInput={() => {
                      autoSlug("j-title", "j-slug");
                      syncJournalSerp();
                    }}
                  />
                </div>
                <div className="field">
                  <label>Slug</label>
                  <div className="slug-wrap">
                    <span className="slug-prefix">/journal/</span>
                    <input
                      type="text"
                      id="j-slug"
                      placeholder="top-5-quests-monsoon"
                      onInput={() => syncJournalSerp()}
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Featured Image</label>
                  <div className="img-upload">
                    <input type="file" accept="image/*" />
                    <div className="img-upload-icon">🖼</div>
                    <div className="img-upload-label">Click to upload featured image</div>
                    <div className="img-upload-hint">JPG, PNG or WEBP · max 5MB</div>
                  </div>
                </div>
                <div className="field">
                  <label>Excerpt</label>
                  <textarea placeholder="Short summary shown in listings and previews…" rows={3} />
                </div>
                <div className="field">
                  <label>🔥 Body Content</label>
                  <div className="rte" id="journal-rte">
                    {/* Cancelling mousedown keeps focus (and the caret) in the
                        editor, so every command below applies to the selection
                        the author actually made. Clicks still fire. */}
                    <div
                      className="rte-toolbar"
                      id="journal-rte-toolbar"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {/* Text style */}
                      <button className="rte-btn" id="rfb-b" title="Bold (Ctrl+B)" onClick={() => rteCmd("bold")}>
                        <b>B</b>
                      </button>
                      <button className="rte-btn" id="rfb-i" title="Italic (Ctrl+I)" onClick={() => rteCmd("italic")}>
                        <i>I</i>
                      </button>
                      <button className="rte-btn" id="rfb-u" title="Underline (Ctrl+U)" onClick={() => rteCmd("underline")}>
                        <u>U</u>
                      </button>
                      <button
                        className="rte-btn"
                        id="rfb-s"
                        title="Strikethrough"
                        onClick={() => rteCmd("strikeThrough")}
                        style={{ textDecoration: "line-through" }}
                      >
                        S
                      </button>
                      <div className="rte-sep"></div>
                      {/* Alignment */}
                      <button className="rte-btn active" title="Align left" onClick={() => rteCmd("justifyLeft")}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <line x1="1" y1="2.5" x2="13" y2="2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="1" y1="6" x2="9" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="1" y1="9.5" x2="13" y2="9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="1" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                      <button className="rte-btn" title="Align centre" onClick={() => rteCmd("justifyCenter")}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <line x1="1" y1="2.5" x2="13" y2="2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="3" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="1" y1="9.5" x2="13" y2="9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="3.5" y1="13" x2="10.5" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                      <button className="rte-btn" title="Align right" onClick={() => rteCmd("justifyRight")}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <line x1="1" y1="2.5" x2="13" y2="2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="5" y1="6" x2="13" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="1" y1="9.5" x2="13" y2="9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="6" y1="13" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                      <button className="rte-btn" title="Justify" onClick={() => rteCmd("justifyFull")}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <line x1="1" y1="2.5" x2="13" y2="2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="1" y1="6" x2="13" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="1" y1="9.5" x2="13" y2="9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="1" y1="13" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                      <div className="rte-sep"></div>
                      {/* Block format headings */}
                      <button className="rte-btn rte-block-btn" title="Heading 1" onClick={() => applyBlockFormat("h1", "journal-body")} style={{ fontSize: "11px", fontWeight: 800 }}>
                        H1
                      </button>
                      <button className="rte-btn rte-block-btn" title="Heading 2" onClick={() => applyBlockFormat("h2", "journal-body")} style={{ fontSize: "11px", fontWeight: 700 }}>
                        H2
                      </button>
                      <button className="rte-btn rte-block-btn" title="Heading 3" onClick={() => applyBlockFormat("h3", "journal-body")} style={{ fontSize: "11px", fontWeight: 600 }}>
                        H3
                      </button>
                      <button className="rte-btn rte-block-btn" title="Heading 4" onClick={() => applyBlockFormat("h4", "journal-body")} style={{ fontSize: "11px", fontWeight: 600 }}>
                        H4
                      </button>
                      <button className="rte-btn rte-block-btn" title="Heading 5" onClick={() => applyBlockFormat("h5", "journal-body")} style={{ fontSize: "11px", fontWeight: 600 }}>
                        H5
                      </button>
                      <button className="rte-btn rte-block-btn" title="Heading 6" onClick={() => applyBlockFormat("h6", "journal-body")} style={{ fontSize: "11px", fontWeight: 600 }}>
                        H6
                      </button>
                      <button className="rte-btn rte-block-btn" title="Paragraph" onClick={() => applyBlockFormat("p", "journal-body")} style={{ fontSize: "11px", fontWeight: 600 }}>
                        P
                      </button>
                      <button className="rte-btn rte-block-btn" title="Code block" onClick={() => applyBlockFormat("pre", "journal-body")} style={{ fontSize: "11px", fontFamily: "monospace", fontWeight: 600 }}>
                        PRE
                      </button>
                      <div className="rte-sep"></div>
                      {/* Lists */}
                      <button className="rte-btn" id="rfb-ul" title="Bullet list" onClick={() => rteCmd("insertUnorderedList")}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="2" cy="3.5" r="1.2" fill="currentColor" />
                          <line x1="5" y1="3.5" x2="13" y2="3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <circle cx="2" cy="7" r="1.2" fill="currentColor" />
                          <line x1="5" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <circle cx="2" cy="10.5" r="1.2" fill="currentColor" />
                          <line x1="5" y1="10.5" x2="13" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                      <button className="rte-btn" id="rfb-ol" title="Numbered list" onClick={() => rteCmd("insertOrderedList")}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <text x="0.5" y="5" fontSize="5" fill="currentColor" fontWeight="700">1.</text>
                          <line x1="5" y1="3.5" x2="13" y2="3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <text x="0.5" y="9" fontSize="5" fill="currentColor" fontWeight="700">2.</text>
                          <line x1="5" y1="7.5" x2="13" y2="7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <text x="0.5" y="13" fontSize="5" fill="currentColor" fontWeight="700">3.</text>
                          <line x1="5" y1="11.5" x2="13" y2="11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                      <button className="rte-btn" title="Quote" onClick={() => applyBlockFormat("blockquote", "journal-body")} style={{ fontSize: "15px", fontWeight: 700, lineHeight: 1 }}>
                        &quot;
                      </button>
                      <div className="rte-sep"></div>
                      {/* Row 2 items */}
                      <button className="rte-btn" title="Indent" onClick={() => rteCmd("indent")}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <line x1="1" y1="2.5" x2="13" y2="2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <polyline points="4,5.5 7,7.5 4,9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                          <line x1="8" y1="7.5" x2="13" y2="7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="1" y1="11.5" x2="13" y2="11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                      <button className="rte-btn" title="Outdent" onClick={() => rteCmd("outdent")}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <line x1="1" y1="2.5" x2="13" y2="2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <polyline points="8,5.5 5,7.5 8,9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                          <line x1="1" y1="7.5" x2="4" y2="7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="1" y1="11.5" x2="13" y2="11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                      <button className="rte-btn" title="Insert link" onClick={() => openLinkModal("journal-body")}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M5.5 8.5a3 3 0 0 0 4.243 0l2-2a3 3 0 0 0-4.243-4.243l-1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M8.5 5.5a3 3 0 0 0-4.243 0l-2 2a3 3 0 0 0 4.243 4.243l1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                      <button className="rte-btn" title="Remove link" onClick={() => rteCmd("unlink")}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M5.5 8.5a3 3 0 0 0 4.243 0l2-2a3 3 0 0 0-4.243-4.243l-1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 1.5" />
                          <path d="M8.5 5.5a3 3 0 0 0-4.243 0l-2 2a3 3 0 0 0 4.243 4.243l1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 1.5" />
                          <line x1="11" y1="3" x2="13" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="1" y1="13" x2="3" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                      <button className="rte-btn" title="Insert image" onClick={() => insertRteImage("journal-body")}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                          <circle cx="4.75" cy="5.75" r="1" fill="currentColor" />
                          <path d="M1.5 10.5l3-3 2.5 2.5 2-2 3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button className="rte-btn" title="Horizontal rule" onClick={() => rteCmd("insertHorizontalRule")} style={{ fontSize: "13px", fontWeight: 700 }}>
                        —
                      </button>
                      <button className="rte-btn" title="Pin / Highlight" onClick={() => rteCmd("hiliteColor", "#fff9c4")} style={{ fontSize: "14px", color: "var(--accent)" }}>
                        📌
                      </button>
                      <div className="rte-sep"></div>
                      <button
                        className="rte-btn"
                        title="Text color"
                        onClick={() => {
                          // The native colour dialog drops the selection; save it first.
                          rteSaveSelection("journal-body");
                          document.getElementById("rte-color-pick")?.click();
                        }}
                        style={{ fontSize: "13px", fontWeight: 700, position: "relative" }}
                      >
                        A
                        <span style={{ display: "block", height: "3px", background: "var(--accent)", borderRadius: "2px", marginTop: "2px", width: "100%" }}></span>
                        <input
                          id="rte-color-pick"
                          type="color"
                          style={{ position: "absolute", opacity: 0, width: "1px", height: "1px", pointerEvents: "none" }}
                          onChange={(e) => {
                            const color = e.currentTarget.value;
                            rteRestoreSelection("journal-body");
                            rteCmd("foreColor", color);
                          }}
                        />
                      </button>
                      <div className="rte-sep"></div>
                      <button className="rte-btn" title="Undo" onClick={() => rteCmd("undo")}>
                        ↩
                      </button>
                      <button className="rte-btn" title="Redo" onClick={() => rteCmd("redo")}>
                        ↪
                      </button>
                      <input
                        type="file"
                        id="rte-img-input"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleRteImage(e.currentTarget, "journal-body")}
                      />
                    </div>
                    <div
                      className="rte-area"
                      id="journal-body"
                      contentEditable="true"
                      suppressContentEditableWarning
                      data-placeholder="Write your journal post here…"
                      style={{ minHeight: "360px" }}
                      onKeyDown={(e) => handleRteKeydown(e.nativeEvent)}
                    ></div>
                  </div>
                </div>
              </div>
              {/* CATEGORIES TAB */}
              <div className="tab-panel" style={{ gap: "14px" }}>
                <div className="section-card">
                  <div className="section-card-header">
                    Journal Categories
                    <span style={{ fontSize: "11px", fontWeight: 400, color: "var(--muted)" }}>
                      shown on front-end journal listings
                    </span>
                  </div>
                  <div className="section-card-body">
                    {/* Filled by JournalBridge from the Journal Category taxonomy. */}
                    <div className="jcat-list" id="jcat-list"></div>
                    <div className="field-hint" style={{ marginTop: "8px" }}>
                      Manage these under <strong>Taxonomies → Journal Category</strong>.
                    </div>
                    <div className="field-hint" style={{ marginTop: "4px" }}>
                      Each category gets a dedicated page at{" "}
                      <span style={{ fontWeight: 600 }}>/journal/category/slug</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* SEO TAB */}
              <div className="tab-panel" style={{ gap: "14px" }}>
                <div className="section-card">
                  <div className="section-card-header">SEO</div>
                  <div className="section-card-body">
                    {/* SERP PREVIEW */}
                    <div>
                      <div style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--muted2)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "8px" }}>
                        Search Preview
                      </div>
                      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px", boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
                        <div style={{ fontSize: "12px", color: "#188038", marginBottom: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <span style={{ width: "14px", height: "14px", background: "var(--surface3)", borderRadius: "50%", display: "inline-block", verticalAlign: "middle" }}></span>
                          joinoutquest.com › journal ›{" "}
                          <span id="j-serp-slug" style={{ color: "#188038" }}>your-post-slug</span>
                        </div>
                        <div id="j-serp-title" style={{ fontSize: "18px", color: "#1558d6", fontWeight: 400, marginBottom: "4px", lineHeight: 1.3, wordBreak: "break-word" }}>
                          Your SEO title will appear here
                        </div>
                        <div id="j-serp-desc" style={{ fontSize: "13px", color: "#4d5156", lineHeight: 1.55 }}>
                          Your meta description will appear here — write something that makes people want to read your post.
                        </div>
                      </div>
                      <div style={{ marginTop: "7px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ flex: 1, height: "5px", background: "var(--surface3)", borderRadius: "3px", overflow: "hidden" }}>
                          <div id="j-title-bar" className="seo-bar" style={{ height: "100%", background: "var(--accent2)", width: "0%", transition: "width .2s,background .2s" }}></div>
                        </div>
                        <span id="j-seo-title-count" style={{ fontSize: "11px", fontWeight: 600, color: "var(--muted)", whiteSpace: "nowrap" }}>
                          0 / 60
                        </span>
                      </div>
                    </div>

                    <div style={{ height: "1px", background: "var(--border)", margin: "2px 0" }}></div>

                    {/* SEO TITLE */}
                    <div className="field">
                      <label>SEO Title</label>
                      <input
                        type="text"
                        id="j-seo-title"
                        placeholder="Override the post title for search engines…"
                        maxLength={60}
                        onInput={(e) => updateJournalSeo(e.currentTarget)}
                      />
                      <div className="field-hint">Recommended: 50–60 characters</div>
                    </div>

                    {/* META DESCRIPTION */}
                    <div className="field">
                      <label>Meta Description</label>
                      <textarea
                        id="j-meta-desc"
                        placeholder="150–160 characters shown in search results…"
                        rows={3}
                        maxLength={160}
                        onInput={(e) => updateJournalSeoDesc(e.currentTarget)}
                      ></textarea>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                        <div style={{ flex: 1, height: "5px", background: "var(--surface3)", borderRadius: "3px", marginRight: "10px", overflow: "hidden" }}>
                          <div id="j-desc-bar" className="seo-bar" style={{ height: "100%", background: "var(--accent2)", width: "0%" }}></div>
                        </div>
                        <span id="j-meta-count" style={{ fontSize: "11px", fontWeight: 600, color: "var(--muted)", whiteSpace: "nowrap" }}>
                          0 / 160
                        </span>
                      </div>
                    </div>

                    {/* FOCUS KEYWORD */}
                    <div className="field">
                      <label>
                        Focus Keyword <span className="opt">optional</span>
                      </label>
                      <input type="text" placeholder="e.g. southeast asia travel budget" />
                      <div className="field-hint">Primary keyword this post should rank for</div>
                    </div>

                    <div className="field">
                      <label>
                        Canonical URL <span className="opt">optional</span>
                      </label>
                      <input type="url" placeholder="https://outquest.com/journal/…" />
                                            <input type="url" placeholder="https://joinoutquest.com/journal/…" />
                      <div className="field-hint">Leave blank — defaults to post slug URL</div>
                    </div>

                    <div style={{ height: "1px", background: "var(--border)" }}></div>

                    {/* OG */}
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted2)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "2px" }}>
                      Open Graph / Social
                    </div>
                    <div className="field">
                      <label>
                        OG Image <span className="opt">falls back to featured image</span>
                      </label>
                      <div className="img-upload">
                        <input type="file" accept="image/*" />
                        <div className="img-upload-icon">📷</div>
                        <div className="img-upload-label">Upload Open Graph image</div>
                        <div className="img-upload-hint">Recommended 1200×630px</div>
                      </div>
                    </div>

                    <div style={{ height: "1px", background: "var(--border)" }}></div>

                    <div className="toggle-wrap">
                      <label className="toggle">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                      <span className="toggle-label">Index this page (allow search engines)</span>
                    </div>
                    <div className="toggle-wrap">
                      <label className="toggle">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                      <span className="toggle-label">Follow links on this page</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="edit-sidebar">
          <div className="section-card">
            <div className="section-card-header">Publish</div>
            <div className="section-card-body">
              <div className="status-toggle" id="j-status">
                <button className="active-draft" onClick={(e) => setStatus("j-status", "draft", e.currentTarget)}>
                  Draft
                </button>
                <button onClick={(e) => setStatus("j-status", "published", e.currentTarget)}>Published</button>
              </div>
              <div className="field">
                <label>Publish Date</label>
                <div className="date-picker-wrap" id="pub-date-wrap">
                  <div className="date-picker-display" id="pub-date-display" onClick={() => toggleDatePicker("pub")}>
                    <span className="date-picker-text" id="pub-date-text">22/06/2026</span>
                    <span className="date-picker-icon">📅</span>
                  </div>
                  <div className="date-picker-dropdown" id="pub-date-dropdown">
                    <div className="dp-nav">
                      <button className="dp-nav-btn" onClick={() => dpShift("pub", -1)}>‹</button>
                      <span className="dp-month-label" id="pub-dp-label"></span>
                      <button className="dp-nav-btn" onClick={() => dpShift("pub", 1)}>›</button>
                    </div>
                    <div className="dp-weekdays">
                      <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                    </div>
                    <div className="dp-grid" id="pub-dp-grid"></div>
                  </div>
                </div>
                <input type="hidden" id="pub-date-value" defaultValue="2026-06-22" />
              </div>
              <div className="field">
                <label>Category</label>
                {/* Options are filled from the Journal Category taxonomy by
                    JournalBridge (rebuildCategories); see the hint below. */}
                <select id="j-category">
                  <option value="">Select…</option>
                </select>
                <div className="field-hint">
                  Manage categories under <strong>Taxonomies → Journal Category</strong>
                </div>
              </div>
              {/* Label is set by JournalBridge: "Publish" for a new post, "Save"
                  when editing an existing one. */}
              <button className="btn btn-primary" id="j-save-publish" style={{ width: "100%", justifyContent: "center" }}>
                Publish
              </button>
              <button className="btn btn-ghost" id="j-save-draft" style={{ width: "100%", justifyContent: "center" }}>
                Save Draft
              </button>
              <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
                👁 Preview
              </button>
            </div>
          </div>

          {/* SCHEDULE POST */}
          <div className="sched-card">
            <div className="sched-hd">⏰ Schedule Post</div>
            <div className="sched-bd">
              <div className="sched-toggle-row">
                <div>
                  <div className="sched-toggle-label">Schedule for later</div>
                  <div className="sched-toggle-sub">Set a future publish date &amp; time</div>
                </div>
                <label className="toggle">
                  <input type="checkbox" id="sched-toggle" onChange={(e) => toggleSchedFields(e.currentTarget)} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="sched-fields hidden" id="sched-fields">
                <div className="field" style={{ margin: 0 }}>
                  <label>Scheduled Date</label>
                  <div className="date-picker-wrap" id="sched-date-wrap">
                    <div className="date-picker-display" id="sched-date-display" onClick={() => toggleDatePicker("sched")}>
                      <span className="date-picker-text" id="sched-date-text">Pick a date…</span>
                      <span className="date-picker-icon">📅</span>
                    </div>
                    <div className="date-picker-dropdown" id="sched-date-dropdown">
                      <div className="dp-nav">
                        <button className="dp-nav-btn" onClick={() => dpShift("sched", -1)}>‹</button>
                        <span className="dp-month-label" id="sched-dp-label"></span>
                        <button className="dp-nav-btn" onClick={() => dpShift("sched", 1)}>›</button>
                      </div>
                      <div className="dp-weekdays">
                        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                      </div>
                      <div className="dp-grid" id="sched-dp-grid"></div>
                    </div>
                  </div>
                  <input type="hidden" id="sched-date-value" />
                </div>
                <div className="sched-time-row">
                  <div className="field" style={{ margin: 0 }}>
                    <label>Hour</label>
                    <select id="sched-hour" style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "13px", background: "#fff", fontFamily: "var(--sans)" }}>
                      {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map((h) => (
                        <option key={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <label>Min</label>
                    <select id="sched-min" style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "13px", background: "#fff", fontFamily: "var(--sans)" }}>
                      {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")).map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="field" style={{ margin: 0 }}>
                  <label>Timezone</label>
                  <select id="sched-tz" style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "13px", background: "#fff", fontFamily: "var(--sans)" }}>
                    {TIMEZONES.map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ padding: "9px 12px", background: "rgba(74,108,247,.07)", border: "1px solid rgba(74,108,247,.22)", borderRadius: "8px", fontSize: "12px", color: "var(--accent3)", lineHeight: 1.5 }}>
                  📅 With this on, the <strong>Schedule</strong> button above holds
                  the post until the date &amp; time set here — it then appears in
                  the Journal list as <strong>Scheduled</strong> and publishes
                  automatically.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
