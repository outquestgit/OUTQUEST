"use client";

import { useState } from "react";
import type { AboutConfig } from "@/lib/siteSettings";
import { PcmsSectionCard } from "./shared";
import { Inp, ImageField, RowCard, AddBtn, RemoveBtn, upd, rm } from "./fields";
import { PageSeoData } from "@/lib/types";
import { SeoPanel } from "./SeoPanel";

/**
 * Pages-CMS → About. Every section's copy and card collections are editable;
 * layout-only fields (polaroid colours, world-map positions, locator dots) are
 * preserved in state and round-trip on save but aren't shown here. One save()
 * persists the whole About config to `site_settings.pages.about`.
 */
export function AboutEditorPage({
  about,
  fullPageSeo
}: {
  about: AboutConfig;
  fullPageSeo: Record<string, PageSeoData>
}) {
  const [cfg, setCfg] = useState<AboutConfig>(about);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [seoData, setSeoData] = useState<PageSeoData>(
    fullPageSeo?.['about'] || {}
  );

  const patch = <K extends keyof AboutConfig>(k: K, p: Partial<AboutConfig[K]>) =>
    setCfg((c) => ({ ...c, [k]: { ...c[k], ...p } }));

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pages: { about: cfg },
          // Merge the updated 'about' SEO data into the rest of the page_seo object
          page_seo: {
            ...fullPageSeo,
            about: seoData
          }
        }),
      });
      if (res.ok) {
        setSaved(true);
        window.setTimeout(() => setSaved(false), 1800);
      } else {
        const d = await res.json().catch(() => ({}));
        window.alert(d.error || "Could not save the About page.");
      }
    } catch {
      window.alert("Network error — please try again.");
    }
    setSaving(false);
  };
  const lbl = (f: string) => (saving ? "Saving…" : saved ? "Saved ✓" : f);

  const { hero, whatWeDo, paths, map, howItWorks, why, cta } = cfg;

  return (
    <div className="page" id="page-pcms-about" suppressHydrationWarning>
      <div className="pcms-page-header">
        <div>
          <div className="pcms-page-title">About</div>
          <div className="pcms-page-meta">
            Frontend path: <strong>/about</strong> · 8 sections
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
        {/* HERO */}
        <PcmsSectionCard icon="🌄" name="Hero" order={1}>
          <Inp label="Headline (use line breaks for multiple lines)" value={hero.h1} onChange={(v) => patch("hero", { h1: v })} area />
          <div style={{ marginTop: "6px" }}>
            <Inp label="Sub-headline" value={hero.sub} onChange={(v) => patch("hero", { sub: v })} area />
          </div>
          <div style={{ marginTop: "6px" }}>
            <Inp label="CTA Button Label" value={hero.ctaLabel} onChange={(v) => patch("hero", { ctaLabel: v })} />
          </div>
          <div className="pcms-section-divider" style={{ marginTop: "10px" }}>
            Mosaic polaroids (role + 2-line title)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {hero.polaroids.map((p, i) => (
              <RowCard key={p.cls}>
                <div className="pcms-field-grid">
                  <Inp label="Role" value={p.role} onChange={(v) => patch("hero", { polaroids: upd(hero.polaroids, i, { role: v }) })} />
                  <Inp label="Title line 1" value={p.title[0]} onChange={(v) => patch("hero", { polaroids: upd(hero.polaroids, i, { title: [v, p.title[1]] }) })} />
                  <Inp label="Title line 2" value={p.title[1]} onChange={(v) => patch("hero", { polaroids: upd(hero.polaroids, i, { title: [p.title[0], v] }) })} />
                </div>
              </RowCard>
            ))}
          </div>
        </PcmsSectionCard>

        {/* WHAT WE DO */}
        <PcmsSectionCard icon="📝" name="What We Do" order={2}>
          <div className="pcms-field-grid">
            <Inp label="Eyebrow Label" value={whatWeDo.label} onChange={(v) => patch("whatWeDo", { label: v })} />
            <Inp label="Heading (line breaks allowed)" value={whatWeDo.heading} onChange={(v) => patch("whatWeDo", { heading: v })} area />
          </div>
          <div className="pcms-section-divider" style={{ marginTop: "10px" }}>
            Paragraphs
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
            {whatWeDo.paragraphs.map((para, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                <Inp label={`Paragraph ${i + 1}`} value={para} onChange={(v) => patch("whatWeDo", { paragraphs: whatWeDo.paragraphs.map((x, j) => (j === i ? v : x)) })} area flex={1} />
                <RemoveBtn onClick={() => patch("whatWeDo", { paragraphs: rm(whatWeDo.paragraphs, i) })} />
              </div>
            ))}
          </div>
          <AddBtn label="Add Paragraph" onClick={() => patch("whatWeDo", { paragraphs: [...whatWeDo.paragraphs, ""] })} />
          <div className="pcms-section-divider">Decorative polaroids (image / emoji + caption)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {whatWeDo.polaroids.map((p, i) => (
              <RowCard key={p.cls}>
                <div className="pcms-field-grid">
                  <Inp label="Emoji" value={p.emoji} onChange={(v) => patch("whatWeDo", { polaroids: upd(whatWeDo.polaroids, i, { emoji: v }) })} flex="0 0 90px" />
                  <Inp label="Caption" value={p.caption} onChange={(v) => patch("whatWeDo", { polaroids: upd(whatWeDo.polaroids, i, { caption: v }) })} />
                </div>
                <div className="pcms-field-grid" style={{ marginTop: "6px" }}>
                  <ImageField
                    label="Image (optional — replaces the emoji)"
                    value={p.image ?? ""}
                    onChange={(v) => patch("whatWeDo", { polaroids: upd(whatWeDo.polaroids, i, { image: v }) })}
                  />
                </div>
              </RowCard>
            ))}
          </div>
        </PcmsSectionCard>

        {/* PICK YOUR PATH */}
        <PcmsSectionCard icon="🧭" name="Pick Your Path" order={3}>
          <div className="pcms-field-grid">
            <Inp label="Heading" value={paths.heading} onChange={(v) => patch("paths", { heading: v })} />
            <Inp label="Subtitle" value={paths.subtitle} onChange={(v) => patch("paths", { subtitle: v })} />
          </div>
          <div className="pcms-section-divider" style={{ marginTop: "10px" }}>
            Path cards
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
            {paths.cards.map((c, i) => (
              <RowCard key={i}>
                <div className="pcms-field-grid">
                  <Inp label="Emoji" value={c.emoji} onChange={(v) => patch("paths", { cards: upd(paths.cards, i, { emoji: v }) })} flex="0 0 80px" />
                  <Inp label="Tag" value={c.tag} onChange={(v) => patch("paths", { cards: upd(paths.cards, i, { tag: v }) })} />
                  <Inp label="Title" value={c.title} onChange={(v) => patch("paths", { cards: upd(paths.cards, i, { title: v }) })} />
                </div>
                <div className="pcms-field-grid" style={{ marginTop: "6px", alignItems: "flex-end" }}>
                  <Inp label="Description" value={c.desc} onChange={(v) => patch("paths", { cards: upd(paths.cards, i, { desc: v }) })} />
                  <Inp label="Link (page id)" value={c.page} onChange={(v) => patch("paths", { cards: upd(paths.cards, i, { page: v }) })} flex="0 0 140px" />
                  <RemoveBtn onClick={() => patch("paths", { cards: rm(paths.cards, i) })} />
                </div>
              </RowCard>
            ))}
          </div>
          <AddBtn label="Add Path Card" onClick={() => patch("paths", { cards: [...paths.cards, { page: "", emoji: "", tag: "", title: "", desc: "" }] })} />
        </PcmsSectionCard>

        {/* WORLD MAP */}
        <PcmsSectionCard icon="🗺️" name="Real People, Real Moves (Map)" order={4}>
          <Inp label="Heading" value={map.heading} onChange={(v) => patch("map", { heading: v })} />
          <div className="field-hint" style={{ margin: "8px 0" }}>
            Card positions and colours on the map are fixed by design; edit the text below.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {map.cards.map((c, i) => (
              <RowCard key={i}>
                <div className="pcms-field-grid">
                  <Inp label="Emoji" value={c.emoji} onChange={(v) => patch("map", { cards: upd(map.cards, i, { emoji: v }) })} flex="0 0 80px" />
                  <Inp label="Name" value={c.name} onChange={(v) => patch("map", { cards: upd(map.cards, i, { name: v }) })} />
                  <Inp label="Role" value={c.role} onChange={(v) => patch("map", { cards: upd(map.cards, i, { role: v }) })} />
                </div>
                <div style={{ marginTop: "6px" }}>
                  <Inp label="Description" value={c.desc} onChange={(v) => patch("map", { cards: upd(map.cards, i, { desc: v }) })} area />
                </div>
                <div style={{ marginTop: "6px" }}>
                  <Inp label="Tag" value={c.tag} onChange={(v) => patch("map", { cards: upd(map.cards, i, { tag: v }) })} />
                </div>
              </RowCard>
            ))}
          </div>
        </PcmsSectionCard>

        {/* HOW IT WORKS */}
        <PcmsSectionCard icon="⚙️" name="How It Works" order={5}>
          <Inp label="Heading" value={howItWorks.heading} onChange={(v) => patch("howItWorks", { heading: v })} />
          <div className="pcms-section-divider" style={{ marginTop: "10px" }}>
            Steps
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
            {howItWorks.steps.map((s, i) => (
              <RowCard key={i}>
                <div className="pcms-field-grid" style={{ alignItems: "flex-end" }}>
                  <Inp label="Icon" value={s.icon} onChange={(v) => patch("howItWorks", { steps: upd(howItWorks.steps, i, { icon: v }) })} flex="0 0 80px" />
                  <Inp label="Title" value={s.title} onChange={(v) => patch("howItWorks", { steps: upd(howItWorks.steps, i, { title: v }) })} />
                  <RemoveBtn onClick={() => patch("howItWorks", { steps: rm(howItWorks.steps, i) })} />
                </div>
                <div style={{ marginTop: "6px" }}>
                  <Inp label="Description" value={s.desc} onChange={(v) => patch("howItWorks", { steps: upd(howItWorks.steps, i, { desc: v }) })} area />
                </div>
              </RowCard>
            ))}
          </div>
          <AddBtn label="Add Step" onClick={() => patch("howItWorks", { steps: [...howItWorks.steps, { icon: "", title: "", desc: "" }] })} />
        </PcmsSectionCard>

        {/* WHY USE US */}
        <PcmsSectionCard icon="✦" name="Why Use Us" order={6}>
          <div className="pcms-field-grid">
            <Inp label="Eyebrow Label" value={why.label} onChange={(v) => patch("why", { label: v })} />
            <Inp label="Heading" value={why.heading} onChange={(v) => patch("why", { heading: v })} />
          </div>
          <div className="pcms-section-divider" style={{ marginTop: "10px" }}>
            Items
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
            {why.items.map((it, i) => (
              <RowCard key={i}>
                <div className="pcms-field-grid" style={{ alignItems: "flex-end" }}>
                  <Inp label="Badge" value={it.badge} onChange={(v) => patch("why", { items: upd(why.items, i, { badge: v }) })} flex="0 0 80px" />
                  <Inp label="Title" value={it.title} onChange={(v) => patch("why", { items: upd(why.items, i, { title: v }) })} />
                  <RemoveBtn onClick={() => patch("why", { items: rm(why.items, i) })} />
                </div>
                <div style={{ marginTop: "6px" }}>
                  <Inp label="Description" value={it.desc} onChange={(v) => patch("why", { items: upd(why.items, i, { desc: v }) })} area />
                </div>
              </RowCard>
            ))}
          </div>
          <AddBtn label="Add Item" onClick={() => patch("why", { items: [...why.items, { badge: "", title: "", desc: "" }] })} />
        </PcmsSectionCard>

        {/* SEO */}
        <SeoPanel
          data={seoData}
          pagePath="/about"
          order={8}
          onChange={(patch) => setSeoData((prev) => ({ ...prev, ...patch }))}
        />

        {/* SOFT CTA */}
        <PcmsSectionCard icon="🎯" name="Soft CTA" order={7}>
          <div className="pcms-field-grid">
            <Inp label="Heading" value={cta.heading} onChange={(v) => patch("cta", { heading: v })} />
            <Inp label="CTA Button Label" value={cta.ctaLabel} onChange={(v) => patch("cta", { ctaLabel: v })} />
          </div>
          <div style={{ marginTop: "6px" }}>
            <Inp label="Subtitle" value={cta.subtitle} onChange={(v) => patch("cta", { subtitle: v })} area />
          </div>
          <div style={{ marginTop: "6px" }}>
            <Inp label="Footnote" value={cta.footnote} onChange={(v) => patch("cta", { footnote: v })} />
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