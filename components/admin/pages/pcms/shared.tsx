"use client";

import {
  togglePcmsSection,
  setPcmsStatus,
  deletePcmsSection,
  legalExec,
  legalHeading,
  legalLink,
} from "@/lib/admin/runtime";

/** Pages-CMS page header (title + frontend path/section count + actions). */
export function PcmsPageHeader({ title, path, sections }: { title: string; path: string; sections: number }) {
  return (
    <div className="pcms-page-header">
      <div>
        <div className="pcms-page-title">{title}</div>
        <div className="pcms-page-meta">
          Frontend path: <strong>{path}</strong> · {sections} sections
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button className="btn btn-ghost btn-sm">👁 Preview</button>
        <button className="btn btn-primary btn-sm">Save Page</button>
      </div>
    </div>
  );
}

/** Bottom save bar shared by every Pages-CMS page. */
export function PcmsSaveBar() {
  return (
    <div className="pcms-page-save-bar">
      <button className="btn btn-primary" style={{ justifyContent: "center" }}>
        Save All Sections
      </button>
      <button className="btn btn-ghost" style={{ justifyContent: "center" }}>
        Save as Draft
      </button>
    </div>
  );
}

/** Collapsible CMS section card: header (icon/name/badges/chevron) + body. */
export function PcmsSectionCard({
  icon,
  name,
  order,
  children,
}: {
  icon: string;
  name: string;
  order: number;
  children: React.ReactNode;
}) {
  return (
    <div className="pcms-section-card">
      <div className="pcms-section-header" onClick={(e) => togglePcmsSection(e.currentTarget)}>
        <div className="pcms-section-icon">{icon}</div>
        <div className="pcms-section-name">{name}</div>
        <div className="pcms-section-badges">
          <span className="pcms-order-badge">#{order}</span>
          <span className="pcms-visibility-pill visible">Visible</span>
          <span className="pcms-status-pill published">Published</span>
        </div>
        <span className="chevron" style={{ fontSize: "10px", color: "var(--muted)", marginLeft: "10px" }}>
          ▶
        </span>
      </div>
      <div className="pcms-section-body">{children}</div>
    </div>
  );
}

/** Per-section controls row: show toggle, order, status toggle, edit/delete. */
export function PcmsControls({
  order,
  showLabel = "Show section",
  style,
}: {
  order: number;
  showLabel?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className="pcms-controls-row" style={style}>
      <div className="toggle-wrap">
        <label className="toggle">
          <input type="checkbox" defaultChecked />
          <span className="toggle-slider"></span>
        </label>
        <span className="toggle-label" style={{ fontSize: "12px" }}>
          {showLabel}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "12px", color: "var(--muted)" }}>Order</span>
        <input className="pcms-order-input" type="number" defaultValue={order} min="1" />
      </div>
      <div className="pcms-status-toggle">
        <button className="" onClick={(e) => setPcmsStatus(e.currentTarget, "draft")}>
          Draft
        </button>
        <button className="active-pub" onClick={(e) => setPcmsStatus(e.currentTarget, "published")}>
          Published
        </button>
      </div>
      <button className="pcms-edit-btn">✎ Edit</button>
      <button className="pcms-delete-btn" onClick={(e) => deletePcmsSection(e.currentTarget)} title="Delete this section — frontend will reflow">
        🗑 Delete
      </button>
    </div>
  );
}

/** Standard CMS section (headline/subcopy/icon/CTA/image) — the reusable shape
 *  used by the legal pages' "Page Header", FAQ's hero/intro, etc. */
export function PcmsStandardSection({
  icon = "📋",
  name = "Page Header",
  order = 1,
}: {
  icon?: string;
  name?: string;
  order?: number;
}) {
  return (
    <PcmsSectionCard icon={icon} name={name} order={order}>
      <div className="pcms-field-grid">
        <div className="field">
          <label>Headline</label>
          <input type="text" placeholder="Main headline for this section" />
        </div>
        <div className="field">
          <label>Subcopy</label>
          <input type="text" placeholder="Supporting text" />
        </div>
      </div>
      <div className="pcms-field-grid">
        <div className="field">
          <label>Icon / Emoji</label>
          <input type="text" placeholder="e.g. 🌍 or SVG name" />
        </div>
        <div className="field">
          <label>CTA Label</label>
          <input type="text" placeholder="e.g. Explore Quests" />
        </div>
      </div>
      <div className="pcms-field-grid">
        <div className="field">
          <label>CTA Link</label>
          <input type="url" placeholder="/quests" />
        </div>
        <div className="field">
          <label>Image</label>
          <div className="pcms-img-compact">
            <input type="file" accept="image/*" />
            <div className="pcms-img-compact-icon">🖼</div>
            <div className="pcms-img-compact-label">Upload Image</div>
          </div>
        </div>
      </div>
      <PcmsControls order={order} />
    </PcmsSectionCard>
  );
}

/** Rich-text "legal editor" (privacy/terms). `bodyId` (e.g. `privacy-body`)
 *  drives the toolbar's runtime calls; `html` is the default body content
 *  (rendered as-is so the rich markup matches the reference exactly). */
export function LegalEditor({ bodyId, html }: { bodyId: string; html: string }) {
  const toolbarId = bodyId.replace("-body", "-toolbar");
  return (
    <div className="legal-editor-wrap" style={{ border: "1.5px solid var(--border)", borderRadius: "10px", overflow: "hidden", background: "#fff" }}>
      <div
        className="legal-editor-toolbar"
        id={toolbarId}
        style={{ display: "flex", flexWrap: "wrap", gap: "2px", padding: "8px 10px", background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}
      >
        <button type="button" className="le-btn" onClick={() => legalExec(bodyId, "bold")} title="Bold">
          <b>B</b>
        </button>
        <button type="button" className="le-btn" onClick={() => legalExec(bodyId, "italic")} title="Italic">
          <i>I</i>
        </button>
        <button type="button" className="le-btn" onClick={() => legalExec(bodyId, "underline")} title="Underline">
          <u>U</u>
        </button>
        <div className="le-sep"></div>
        <button type="button" className="le-btn" onClick={() => legalHeading(bodyId, "h2")} title="Heading 2">
          H2
        </button>
        <button type="button" className="le-btn" onClick={() => legalHeading(bodyId, "h3")} title="Heading 3">
          H3
        </button>
        <div className="le-sep"></div>
        <button type="button" className="le-btn" onClick={() => legalExec(bodyId, "insertOrderedList")} title="Numbered list">
          1.
        </button>
        <button type="button" className="le-btn" onClick={() => legalExec(bodyId, "insertUnorderedList")} title="Bullet list">
          •
        </button>
        <div className="le-sep"></div>
        <button type="button" className="le-btn" onClick={() => legalLink(bodyId)} title="Insert link">
          🔗
        </button>
        <button type="button" className="le-btn" onClick={() => legalExec(bodyId, "removeFormat")} title="Clear formatting">
          ✕
        </button>
        <div className="le-sep"></div>
        <button type="button" className="le-btn le-btn-sm" onClick={() => legalExec(bodyId, "undo")}>
          ↩
        </button>
        <button type="button" className="le-btn le-btn-sm" onClick={() => legalExec(bodyId, "redo")}>
          ↪
        </button>
      </div>
      <div
        id={bodyId}
        contentEditable="true"
        suppressContentEditableWarning
        className="legal-editor-body"
        style={{ minHeight: "420px", padding: "20px 22px", fontSize: "13.5px", lineHeight: 1.8, color: "var(--text)", outline: "none" }}
        spellCheck="true"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
