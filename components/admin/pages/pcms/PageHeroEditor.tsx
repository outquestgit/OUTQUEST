"use client";

import { useState } from "react";
import type { PageHero } from "@/lib/siteSettings";
import { PcmsSectionCard } from "./shared";

/**
 * Generic single-Hero editor for the simpler Pages-CMS pages (Quests, Journal).
 * Those front pages are mostly dynamic (filters/grids/DB posts); only the hero
 * banner is editable, so this is one Hero section with eyebrow/headline/subcopy.
 * Saves to `site_settings.pages[pageKey]`.
 */
export function PageHeroEditor({
  pageId,
  title,
  path,
  pageKey,
  hero,
}: {
  pageId: string;
  title: string;
  path: string;
  pageKey: "quests" | "journal";
  hero: PageHero;
}) {
  const [label, setLabel] = useState(hero.label);
  const [heading, setHeading] = useState(hero.heading);
  const [subtitle, setSubtitle] = useState(hero.subtitle);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages: { [pageKey]: { label, heading, subtitle } } }),
      });
      if (res.ok) {
        setSaved(true);
        window.setTimeout(() => setSaved(false), 1800);
      } else {
        const d = await res.json().catch(() => ({}));
        window.alert(d.error || `Could not save the ${title} page.`);
      }
    } catch {
      window.alert("Network error — please try again.");
    }
    setSaving(false);
  };
  const lbl = (fallback: string) => (saving ? "Saving…" : saved ? "Saved ✓" : fallback);

  return (
    <div className="page" id={pageId}>
      <div className="pcms-page-header">
        <div>
          <div className="pcms-page-title">{title}</div>
          <div className="pcms-page-meta">
            Frontend path: <strong>{path}</strong> · 1 section
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn btn-ghost btn-sm">👁 Preview</button>
          <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
            {lbl("Save Page")}
          </button>
        </div>
      </div>

      <div className="pcms-sections-grid">
        <PcmsSectionCard icon="🌄" name="Hero Banner" order={1}>
          <div className="field-hint" style={{ marginBottom: "10px" }}>
            The centered banner at the top of the page. The rest of the page is dynamic.
          </div>
          <div className="field">
            <label>Eyebrow Label</label>
            <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>
          <div className="field">
            <label>Headline</label>
            <input type="text" value={heading} onChange={(e) => setHeading(e.target.value)} />
          </div>
          <div className="field">
            <label>Subcopy</label>
            <textarea rows={2} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          </div>
          <div style={{ marginTop: "4px" }}>
            <button className="btn btn-primary" onClick={save} disabled={saving}>
              {lbl("Save Hero")}
            </button>
          </div>
        </PcmsSectionCard>
      </div>

      <div className="pcms-page-save-bar">
        <button className="btn btn-primary" style={{ justifyContent: "center" }} onClick={save} disabled={saving}>
          {lbl("Save All Sections")}
        </button>
      </div>
    </div>
  );
}
