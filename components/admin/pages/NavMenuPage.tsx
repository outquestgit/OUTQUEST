"use client";

import { previewBrandAsset, removeItem, addNavLink } from "@/lib/admin/runtime";

/** Sample nav links (the reference defaults; NavMenuBridge rebuilds the repeater
 *  from DB nav settings — these are placeholders kept for DOM fidelity). */
const SAMPLE_LINKS: [string, string][] = [
  ["Quests", "/quests"],
  ["Deals", "/deals"],
  ["Journal", "/journal"],
  ["About", "/about"],
];

/**
 * Nav Menu editor (`#page-nav-menu`). Faithful transcription; `NavMenuBridge`
 * loads/saves it by id + the `#nav-links-repeater`. Inputs are uncontrolled so
 * the bridge can populate them; inline handlers call the runtime.
 */
export function NavMenuPage() {
  return (
    <div className="page" id="page-nav-menu" suppressHydrationWarning>
      <div className="edit-layout">
        <div className="edit-main" style={{ gap: "14px" }}>
          {/* BRANDING */}
          <div className="section-card">
            <div className="section-card-header">Branding</div>
            <div className="section-card-body">
              <div className="field-row">
                <div className="field">
                  <label>Nav Logo</label>
                  <div className="img-upload" id="logo-upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        previewBrandAsset(e.currentTarget, "logo-preview", "logo-upload-area")
                      }
                    />
                    <img
                      id="logo-preview"
                      style={{
                        display: "none",
                        maxHeight: "48px",
                        maxWidth: "180px",
                        objectFit: "contain",
                        borderRadius: "4px",
                      }}
                    />
                    <div className="img-upload-icon" id="logo-icon">
                      🖼
                    </div>
                    <div className="img-upload-label" id="logo-label">
                      Upload nav logo
                    </div>
                    <div className="img-upload-hint">
                      SVG, PNG or WEBP · transparent bg recommended · max 2MB
                    </div>
                  </div>
                  <div className="field-hint">Appears in the top-left of the navigation bar</div>
                </div>
                <div className="field">
                  <label>Favicon</label>
                  <div className="img-upload" id="fav-upload-area">
                    <input
                      type="file"
                      accept="image/*,.ico"
                      onChange={(e) =>
                        previewBrandAsset(e.currentTarget, "fav-preview", "fav-upload-area")
                      }
                    />
                    <img
                      id="fav-preview"
                      style={{
                        display: "none",
                        width: "32px",
                        height: "32px",
                        objectFit: "contain",
                        borderRadius: "4px",
                      }}
                    />
                    <div className="img-upload-icon" id="fav-icon">
                      ⬡
                    </div>
                    <div className="img-upload-label" id="fav-label">
                      Upload favicon
                    </div>
                    <div className="img-upload-hint">
                      ICO, PNG or SVG · 32×32 or 64×64px recommended
                    </div>
                  </div>
                  <div className="field-hint">Shown in browser tabs and bookmarks</div>
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Logo Alt Text</label>
                  <input
                    type="text"
                    id="nav-logo-alt"
                    placeholder="OutQuest — Find Your Next Quest"
                  />
                </div>
                <div className="field">
                  <label>Logo Link</label>
                  <input type="url" id="nav-logo-link" placeholder="/" defaultValue="/" />
                </div>
              </div>
            </div>
          </div>

          {/* MAIN NAV LINKS */}
          <div className="section-card">
            <div className="section-card-header">
              Main Navigation Links
              <span style={{ fontSize: "11px", fontWeight: 400, color: "var(--muted)" }}>
                drag to reorder
              </span>
            </div>
            <div className="section-card-body">
              <div className="repeater" id="nav-links-repeater">
                {SAMPLE_LINKS.map(([label, url], i) => (
                  <div className="repeater-item" key={i}>
                    <div className="repeater-item-header">
                      <span className="repeater-drag">⠿</span>
                      <span className="repeater-item-title">Link {i + 1}</span>
                      <button
                        className="repeater-remove"
                        onClick={(e) => removeItem(e.currentTarget)}
                      >
                        ×
                      </button>
                    </div>
                    <div className="field-row">
                      <div className="field">
                        <label>Label</label>
                        <input type="text" defaultValue={label} />
                      </div>
                      <div className="field">
                        <label>URL</label>
                        <input type="text" defaultValue={url} />
                      </div>
                    </div>
                    <div className="field-row">
                      <div className="field">
                        <label>Open in</label>
                        <select>
                          <option value="_self">Same tab</option>
                          <option value="_blank">New tab</option>
                        </select>
                      </div>
                      <div
                        className="field"
                        style={{ justifyContent: "flex-end", paddingTop: "16px" }}
                      >
                        <div className="toggle-wrap">
                          <label className="toggle">
                            <input type="checkbox" />
                            <span className="toggle-slider"></span>
                          </label>
                          <span className="toggle-label">Has dropdown</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="add-repeater-btn" onClick={() => addNavLink()}>
                ＋ Add Link
              </button>
            </div>
          </div>

          {/* CTA BUTTON */}
          <div className="section-card">
            <div className="section-card-header">
              Nav CTA Button{" "}
              <span style={{ fontSize: "11px", fontWeight: 400, color: "var(--muted)" }}>
                optional right-side button
              </span>
            </div>
            <div className="section-card-body">
              <div className="field-row">
                <div className="field">
                  <label>Button Label</label>
                  <input type="text" id="nav-cta-label" placeholder="e.g. Start a Quest" />
                </div>
                <div className="field">
                  <label>Button URL</label>
                  <input type="text" id="nav-cta-url" placeholder="/quests" />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Button Style</label>
                  <select id="nav-cta-style">
                    <option value="primary">Primary (filled)</option>
                    <option value="ghost">Ghost (outlined)</option>
                  </select>
                </div>
                <div className="field" style={{ justifyContent: "flex-end", paddingTop: "16px" }}>
                  <div className="toggle-wrap">
                    <label className="toggle">
                      <input type="checkbox" id="nav-cta-show" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="toggle-label">Show CTA button</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DISPLAY OPTIONS */}
          <div className="section-card">
            <div className="section-card-header">Display Options</div>
            <div className="section-card-body">
              <div className="toggle-wrap">
                <label className="toggle">
                  <input type="checkbox" id="nav-disp-sticky" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
                <span className="toggle-label">Sticky nav (stays fixed on scroll)</span>
              </div>
              <div className="toggle-wrap">
                <label className="toggle">
                  <input type="checkbox" id="nav-disp-allpages" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
                <span className="toggle-label">Show nav on all pages</span>
              </div>
              <div className="toggle-wrap">
                <label className="toggle">
                  <input type="checkbox" id="nav-disp-transparent" />
                  <span className="toggle-slider"></span>
                </label>
                <span className="toggle-label">Transparent on hero sections</span>
              </div>
            </div>
          </div>
        </div>
        <div className="edit-sidebar">
          <div className="section-card">
            <div className="section-card-header">Save Changes</div>
            <div className="section-card-body">
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                Save Nav Menu
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
            <div className="section-card-header">Nav Style</div>
            <div className="section-card-body">
              <div className="field">
                <label>Background Colour</label>
                <input
                  type="color"
                  id="nav-style-bg"
                  defaultValue="#ffffff"
                  style={{ height: "36px", padding: "3px 6px", cursor: "pointer" }}
                />
              </div>
              <div className="field">
                <label>Text Colour</label>
                <input
                  type="color"
                  id="nav-style-text"
                  defaultValue="#1a1814"
                  style={{ height: "36px", padding: "3px 6px", cursor: "pointer" }}
                />
              </div>
              <div className="field">
                <label>Border / Divider</label>
                <div className="toggle-wrap" style={{ marginTop: "3px" }}>
                  <label className="toggle">
                    <input type="checkbox" id="nav-style-border" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Show bottom border</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
