"use client";

import {
  previewBrandAsset,
  removeItem,
  addFooterLink,
  addFooterColumn,
} from "@/lib/admin/runtime";

/** Footer columns (reference defaults; FooterBridge rebuilds from DB settings).
 *  Column 1's inner repeater keeps its `footer-col-1-links` id per the source. */
const COLUMNS: { heading: string; innerId?: string; links: [string, string][] }[] = [
  {
    heading: "Explore",
    innerId: "footer-col-1-links",
    links: [
      ["Quests", "/quests"],
      ["Deals", "/deals"],
      ["Journal", "/journal"],
    ],
  },
  {
    heading: "Company",
    links: [
      ["About Us", "/about"],
      ["How It Works", "/how-it-works"],
      ["Contact", "/contact"],
    ],
  },
  {
    heading: "Legal",
    links: [
      ["Privacy Policy", "/privacy"],
      ["Terms of Use", "/terms"],
    ],
  },
];

const SOCIAL_SYMBOLS: { id: string; value: string; label: string; placeholder: string; style: React.CSSProperties }[] =
  [
    { id: "ft-social1", value: "📷", label: "Instagram URL", placeholder: "https://instagram.com/outquest", style: { textAlign: "center", fontSize: "16px" } },
    { id: "ft-social2", value: "♪", label: "TikTok URL", placeholder: "https://tiktok.com/@outquest", style: { textAlign: "center", fontSize: "16px" } },
    { id: "ft-social3", value: "✕", label: "X / Twitter URL", placeholder: "https://x.com/outquest", style: { textAlign: "center", fontSize: "16px" } },
    { id: "ft-social4", value: "in", label: "LinkedIn URL", placeholder: "https://linkedin.com/company/outquest", style: { textAlign: "center", fontSize: "14px", fontWeight: 700 } },
    { id: "ft-social5", value: "S", label: "Substack URL", placeholder: "https://outquest.substack.com", style: { textAlign: "center", fontSize: "15px", fontWeight: 700 } },
  ];

/**
 * Footer editor (`#page-footer`). Faithful transcription; `FooterBridge`
 * loads/saves by id + the column repeaters. Inputs uncontrolled; inline
 * handlers call the runtime.
 */
export function FooterPage() {
  return (
    <div className="page" id="page-footer" suppressHydrationWarning>
      <div className="edit-layout">
        <div className="edit-main" style={{ gap: "14px" }}>
          {/* NEWSLETTER */}
          <div className="section-card">
            <div className="section-card-header">
              Newsletter / Email Capture{" "}
              <span style={{ fontSize: "11px", fontWeight: 400, color: "var(--muted)" }}>
                — global section above footer
              </span>
            </div>
            <div className="section-card-body">
              <div className="field-hint" style={{ marginBottom: "10px" }}>
                The newsletter strip shown above the footer sitewide. Has an eyebrow, H2, sub, email
                input placeholder, button label, and disclaimer.
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Eyebrow Label</label>
                  <input type="text" id="ft-nl-eyebrow" defaultValue="The OutQuest Dispatch" />
                </div>
                <div className="field">
                  <label>Button Label</label>
                  <input type="text" id="ft-nl-button" defaultValue="Subscribe" />
                </div>
              </div>
              <div className="field">
                <label>H2 Headline</label>
                <input
                  type="text"
                  id="ft-nl-heading"
                  defaultValue="New quests. New directions. No noise."
                />
              </div>
              <div className="field">
                <label>Subtext</label>
                <textarea
                  rows={2}
                  id="ft-nl-subtext"
                  defaultValue="Monthly drops — quest releases, real stories, and early access for people actually on the move."
                />
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Email Input Placeholder</label>
                  <input type="text" id="ft-nl-placeholder" defaultValue="Your email address" />
                </div>
                <div className="field">
                  <label>Disclaimer / Fine Print</label>
                  <input
                    type="text"
                    id="ft-nl-disclaimer"
                    defaultValue="No spam. Unsubscribe any time."
                  />
                </div>
              </div>
              <div className="toggle-wrap" style={{ marginTop: "6px" }}>
                <label className="toggle">
                  <input type="checkbox" id="ft-nl-show" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
                <span className="toggle-label">Show newsletter strip</span>
              </div>
            </div>
          </div>

          {/* BRANDING */}
          <div className="section-card">
            <div className="section-card-header">Footer Branding</div>
            <div className="section-card-body">
              <div className="field-hint" style={{ marginBottom: "10px" }}>
                The footer logo is a text wordmark — two-tone coloured text, not an image. Edit the
                name parts and tagline below. Upload an image only if you want to override the
                wordmark with a graphic logo.
              </div>
              <div className="field-row">
                <div className="field">
                  <label>
                    Wordmark Part 1{" "}
                    <span style={{ fontWeight: 400, color: "var(--muted)" }}>(default colour)</span>
                  </label>
                  <input type="text" id="ft-wordmark1" defaultValue="Out" />
                </div>
                <div className="field">
                  <label>
                    Wordmark Part 2{" "}
                    <span style={{ fontWeight: 400, color: "var(--muted)" }}>
                      (accent colour span)
                    </span>
                  </label>
                  <input type="text" id="ft-wordmark2" defaultValue="Quest" />
                </div>
              </div>
              <div className="field">
                <label>
                  Footer Tagline{" "}
                  <span style={{ fontWeight: 400, color: "var(--muted)" }}>
                    (line below wordmark)
                  </span>
                </label>
                <textarea
                  rows={2}
                  id="ft-tagline"
                  defaultValue="Short-term immersive experiences that help you explore a new direction."
                />
              </div>
              <div className="field-row">
                <div className="field">
                  <label>
                    Override with Image Logo <span className="opt">optional</span>
                  </label>
                  <div className="img-upload" style={{ padding: "9px" }} id="ft-logo-upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        previewBrandAsset(e.currentTarget, "ft-logo-preview", "ft-logo-upload-area")
                      }
                    />
                    <img
                      id="ft-logo-preview"
                      style={{
                        display: "none",
                        maxHeight: "40px",
                        maxWidth: "160px",
                        objectFit: "contain",
                        borderRadius: "4px",
                      }}
                    />
                    <div className="img-upload-icon">🖼</div>
                    <div className="img-upload-label">
                      Upload image logo (SVG/PNG · light variant)
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "10px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                    marginBottom: "8px",
                  }}
                >
                  Social Icons — Symbols &amp; URLs
                </div>
                <div className="field-hint" style={{ marginBottom: "8px" }}>
                  Edit the symbol character shown for each icon. Leave URL blank to hide that
                  platform.
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {SOCIAL_SYMBOLS.map((s) => (
                    <div key={s.id} style={{ display: "flex", gap: "6px", alignItems: "flex-end" }}>
                      <div className="field" style={{ margin: 0, flex: "0 0 50px" }}>
                        <label>Symbol</label>
                        <input
                          type="text"
                          id={s.id}
                          defaultValue={s.value}
                          maxLength={4}
                          style={s.style}
                        />
                      </div>
                      <div className="field" style={{ margin: 0, flex: 1 }}>
                        <label>{s.label}</label>
                        <input type="url" id={`${s.id}-url`} placeholder={s.placeholder} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER COLUMNS */}
          <div className="section-card">
            <div className="section-card-header">
              Footer Link Columns
              <span style={{ fontSize: "11px", fontWeight: 400, color: "var(--muted)" }}>
                up to 4 columns
              </span>
            </div>
            <div className="section-card-body">
              <div className="repeater" id="footer-cols-repeater">
                {COLUMNS.map((col, ci) => (
                  <div className="repeater-item" key={ci}>
                    <div className="repeater-item-header">
                      <span className="repeater-drag">⠿</span>
                      <span className="repeater-item-title">Column {ci + 1}</span>
                      <button
                        className="repeater-remove"
                        onClick={(e) => removeItem(e.currentTarget)}
                      >
                        ×
                      </button>
                    </div>
                    <div className="field">
                      <label>Column Heading</label>
                      <input type="text" defaultValue={col.heading} />
                    </div>
                    <div className="repeater" style={{ marginTop: "6px" }} id={col.innerId}>
                      {col.links.map(([label, url], li) => (
                        <div className="repeater-item" style={{ padding: "9px 11px" }} key={li}>
                          <div className="field-row">
                            <div className="field">
                              <label style={{ fontSize: "10.5px" }}>Label</label>
                              <input type="text" defaultValue={label} />
                            </div>
                            <div className="field">
                              <label style={{ fontSize: "10.5px" }}>URL</label>
                              <input type="text" defaultValue={url} />
                            </div>
                            <button
                              className="repeater-remove"
                              onClick={(e) => removeItem(e.currentTarget)}
                              style={{ marginTop: "20px" }}
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      className="add-repeater-btn"
                      style={{ marginTop: "6px" }}
                      onClick={(e) => addFooterLink(e.currentTarget)}
                    >
                      ＋ Add Link
                    </button>
                  </div>
                ))}
              </div>
              <button className="add-repeater-btn" onClick={() => addFooterColumn()}>
                ＋ Add Column
              </button>
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div className="section-card">
            <div className="section-card-header">Bottom Bar</div>
            <div className="section-card-body">
              <div className="field">
                <label>Copyright Text</label>
                <input
                  type="text"
                  id="ft-copyright"
                  defaultValue="© 2026 OutQuest. All rights reserved."
                />
                <div className="field-hint">Use {"{year}"} to auto-insert the current year</div>
              </div>
              <div className="field">
                <label>Bottom Bar Tagline</label>
                <input
                  type="text"
                  id="ft-bottom-tagline"
                  defaultValue="Built for people who want more."
                />
              </div>
              <div className="toggle-wrap">
                <label className="toggle">
                  <input type="checkbox" id="ft-show-social-bottom" />
                  <span className="toggle-slider"></span>
                </label>
                <span className="toggle-label">Show social icons in bottom bar</span>
              </div>
            </div>
          </div>
        </div>
        <div className="edit-sidebar">
          <div className="section-card">
            <div className="section-card-header">Save Changes</div>
            <div className="section-card-body">
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                Save Footer
              </button>
              <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
                Discard
              </button>
              <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
                👁 Preview Site
              </button>
            </div>
          </div>
          <div className="section-card">
            <div className="section-card-header">Footer Style</div>
            <div className="section-card-body">
              <div className="field">
                <label>Background Colour</label>
                <input
                  type="color"
                  id="ft-style-bg"
                  defaultValue="#1a1814"
                  style={{ height: "36px", padding: "3px 6px", cursor: "pointer" }}
                />
              </div>
              <div className="field">
                <label>Text Colour</label>
                <input
                  type="color"
                  id="ft-style-text"
                  defaultValue="#f5f3ef"
                  style={{ height: "36px", padding: "3px 6px", cursor: "pointer" }}
                />
              </div>
              <div className="field">
                <label>Layout</label>
                <select id="ft-style-layout">
                  <option value="4col">4-column grid</option>
                  <option value="3col">3-column grid</option>
                  <option value="2col">2-column grid</option>
                  <option value="centered">Centered / minimal</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
