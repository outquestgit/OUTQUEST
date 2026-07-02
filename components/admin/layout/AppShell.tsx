"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { insertLink, closeLinkModal } from "@/lib/admin/runtime";

/**
 * The admin chrome: `#app > (#sidebar, #main > (#header, #content))` plus the
 * global Insert-Link modal that lived at `#app` level in the reference. Page
 * sections are passed as `children` into `#content`, in source order. DOM is
 * byte-identical to `_reference/admin-body.html` so `admin.js` + the bridges
 * keep finding every element.
 */
export function AppShell({
  newLeads = 0,
  activePage = "dashboard",
  children,
}: {
  newLeads?: number;
  activePage?: string;
  children: React.ReactNode;
}) {
  return (
    <div id="app">
      <Sidebar newLeads={newLeads} activePage={activePage} />
      <div id="main">
        <Header />
        <div id="content">{children}</div>
      </div>

      <div
        className="link-modal-overlay"
        id="link-modal-overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeLinkModal();
        }}
      >
        <div className="link-modal">
          <div className="link-modal-title">Insert Link</div>
          <div className="field">
            <label>Link Text</label>
            <input type="text" id="link-text-input" placeholder="Text to display…" />
          </div>
          <div className="field">
            <label>URL</label>
            <input type="url" id="link-url-input" placeholder="https://…" />
          </div>
          <div className="toggle-wrap">
            <label className="toggle">
              <input type="checkbox" id="link-new-tab" />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">Open in new tab</span>
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
            <button className="btn btn-primary" onClick={() => insertLink()}>
              Insert Link
            </button>
            <button className="btn btn-ghost" onClick={() => closeLinkModal()}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
