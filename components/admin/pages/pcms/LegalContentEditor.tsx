"use client";

import { useState } from "react";
import type { LegalPageConfig } from "@/lib/siteSettings";
import { PcmsSectionCard } from "./shared";
import { RichText } from "./RichText";
import { Inp } from "./fields";
import { PageSeoData } from "@/lib/types";
import { SeoPanel } from "./SeoPanel";

/**
 * Editor for the legal pages (Privacy, Terms) — matches the reference admin's
 * single-box layout: a page header, then ONE rich-text content box for the whole
 * policy (author the numbered sections inline), plus the eyebrow/heading/sub,
 * last-updated, and contact fields. Saves to `site_settings.pages[pageKey]`.
 */
export function LegalContentEditor({
  pageId,
  title,
  path,
  pageKey,
  config,
  fullPageSeo,
}: {
  pageId: string;
  title: string;
  path: string;
  pageKey: "privacy" | "terms";
  config: LegalPageConfig;
  fullPageSeo: Record<string, PageSeoData>;
}) {
  const [cfg, setCfg] = useState<LegalPageConfig>(config);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [seoData, setSeoData] = useState<PageSeoData>(fullPageSeo?.[pageKey] || {});

  const patch = <K extends keyof LegalPageConfig>(k: K, p: Partial<LegalPageConfig[K]>) =>
    setCfg((c) => ({ ...c, [k]: { ...(c[k] as object), ...p } }));
  const set = <K extends keyof LegalPageConfig>(k: K, v: LegalPageConfig[K]) => setCfg((c) => ({ ...c, [k]: v }));

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pages: { [pageKey]: cfg },
          page_seo: { ...fullPageSeo, [pageKey]: seoData },
        }),
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
  const lbl = (f: string) => (saving ? "Saving…" : saved ? "Saved ✓" : f);

  const { hero, contact } = cfg;

  return (
    <div className="page" id={pageId}>
      <div className="pcms-page-header">
        <div>
          <div className="pcms-page-title">{title}</div>
          <div className="pcms-page-meta">
            Frontend path: <strong>{path}</strong>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
            {lbl("Save Page")}
          </button>
        </div>
      </div>

      <div className="pcms-sections-grid">
        {/* Header fields */}
        <PcmsSectionCard icon="🌄" name="Page Header" order={1}>
          <div className="pcms-field-grid">
            <Inp label="Eyebrow Label" value={hero.label} onChange={(v) => patch("hero", { label: v })} />
            <Inp label="Heading" value={hero.heading} onChange={(v) => patch("hero", { heading: v })} />
          </div>
          <div className="pcms-field-grid" style={{ marginTop: "6px" }}>
            <Inp label="Sub-headline" value={hero.sub} onChange={(v) => patch("hero", { sub: v })} />
            <Inp label="Last updated" value={hero.lastUpdated} onChange={(v) => patch("hero", { lastUpdated: v })} />
          </div>
        </PcmsSectionCard>

        {/* Single content box */}
        <PcmsSectionCard icon="📝" name={`${title} Content`} order={2}>
          <div className="field-hint" style={{ marginBottom: "10px" }}>
            Write the full {title} here. Use the toolbar for headings (H2/H3), numbered &amp; bullet
            lists, bold, italics, and links. Number the sections directly in the text (e.g.{" "}
            <strong>1. Introduction</strong>).
          </div>
          <RichText value={cfg.body} onChange={(v) => set("body", v)} minHeight={440} />
        </PcmsSectionCard>

        {/* SEO */}
        <SeoPanel
          data={seoData}
          pagePath={path}
          order={4}
          onChange={(patch) => setSeoData((prev) => ({ ...prev, ...patch }))}
        />

        {/* Contact box */}
        <PcmsSectionCard icon="💬" name="Contact Box" order={3}>
          <Inp label="Heading" value={contact.heading} onChange={(v) => patch("contact", { heading: v })} />
          <div style={{ marginTop: "6px" }}>
            <Inp label="Body" value={contact.body} onChange={(v) => patch("contact", { body: v })} area />
          </div>
          <div style={{ marginTop: "6px" }}>
            <Inp label="Email" value={contact.email} onChange={(v) => patch("contact", { email: v })} />
          </div>
        </PcmsSectionCard>
      </div>

      <div className="pcms-page-save-bar">
        <button className="btn btn-primary" style={{ justifyContent: "center" }} onClick={save} disabled={saving}>
          {lbl("Save Page")}
        </button>
      </div>
    </div>
  );
}