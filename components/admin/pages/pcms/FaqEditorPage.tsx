"use client";

import { useState } from "react";
import type { FaqPageConfig } from "@/lib/siteSettings";
import { PcmsSectionCard } from "./shared";
import { Inp, RowCard, AddBtn, RemoveBtn, upd, rm } from "./fields";

type Cat = FaqPageConfig["categories"][number];

/**
 * Pages-CMS → FAQ. Editable: the hero (eyebrow / title / emphasis / subcopy),
 * the categorised Q&A accordions (add/remove categories and questions), and the
 * "still have a question" box. Saves to `site_settings.pages.faq`.
 */
export function FaqEditorPage({ faq }: { faq: FaqPageConfig }) {
  const [cfg, setCfg] = useState<FaqPageConfig>(faq);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const patch = <K extends keyof FaqPageConfig>(k: K, p: Partial<FaqPageConfig[K]>) =>
    setCfg((c) => ({ ...c, [k]: { ...c[k], ...p } }));
  const setCats = (categories: Cat[]) => setCfg((c) => ({ ...c, categories }));

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages: { faq: cfg } }),
      });
      if (res.ok) {
        setSaved(true);
        window.setTimeout(() => setSaved(false), 1800);
      } else {
        const d = await res.json().catch(() => ({}));
        window.alert(d.error || "Could not save the FAQ page.");
      }
    } catch {
      window.alert("Network error — please try again.");
    }
    setSaving(false);
  };
  const lbl = (f: string) => (saving ? "Saving…" : saved ? "Saved ✓" : f);

  const { hero, categories, stillBox } = cfg;

  return (
    <div className="page" id="page-pcms-faq" suppressHydrationWarning>
      <div className="pcms-page-header">
        <div>
          <div className="pcms-page-title">FAQ</div>
          <div className="pcms-page-meta">
            Frontend path: <strong>/faq</strong> · 3 sections
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
          <div className="pcms-field-grid">
            <Inp label="Eyebrow" value={hero.eyebrow} onChange={(v) => patch("hero", { eyebrow: v })} />
            <Inp label="Title (before emphasis)" value={hero.title} onChange={(v) => patch("hero", { title: v })} />
          </div>
          <div style={{ marginTop: "6px" }}>
            <Inp label="Emphasis (coloured, line breaks allowed)" value={hero.em} onChange={(v) => patch("hero", { em: v })} area />
          </div>
          <div style={{ marginTop: "6px" }}>
            <Inp label="Subcopy" value={hero.sub} onChange={(v) => patch("hero", { sub: v })} area />
          </div>
        </PcmsSectionCard>

        {/* CATEGORIES */}
        <PcmsSectionCard icon="❓" name="FAQ Categories & Questions" order={2}>
          <div className="field-hint" style={{ marginBottom: "10px" }}>
            Each category has an icon, a name, and a list of question/answer pairs.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "10px" }}>
            {categories.map((cat, ci) => (
              <RowCard key={ci}>
                <div className="pcms-field-grid" style={{ alignItems: "flex-end" }}>
                  <Inp label="Icon" value={cat.icon} onChange={(v) => setCats(upd(categories, ci, { icon: v }))} flex="0 0 80px" />
                  <Inp label="Category Name" value={cat.title} onChange={(v) => setCats(upd(categories, ci, { title: v }))} />
                  <RemoveBtn onClick={() => setCats(rm(categories, ci))} />
                </div>
                <div className="pcms-section-divider" style={{ margin: "8px 0 6px" }}>
                  Questions
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {cat.items.map((it, ii) => (
                    <div key={ii} style={{ borderLeft: "2px solid var(--border)", paddingLeft: "8px" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                        <Inp
                          label={`Q${ii + 1}`}
                          value={it.q}
                          onChange={(v) => setCats(upd(categories, ci, { items: upd(cat.items, ii, { q: v }) }))}
                          flex={1}
                        />
                        <RemoveBtn onClick={() => setCats(upd(categories, ci, { items: rm(cat.items, ii) }))} />
                      </div>
                      <div style={{ marginTop: "4px" }}>
                        <Inp
                          label="Answer"
                          value={it.a}
                          onChange={(v) => setCats(upd(categories, ci, { items: upd(cat.items, ii, { a: v }) }))}
                          area
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="add-repeater-btn"
                  style={{ marginTop: "6px" }}
                  onClick={() => setCats(upd(categories, ci, { items: [...cat.items, { q: "", a: "" }] }))}
                >
                  ＋ Add Question
                </button>
              </RowCard>
            ))}
          </div>
          <AddBtn label="Add Category" onClick={() => setCats([...categories, { icon: "", title: "", items: [{ q: "", a: "" }] }])} />
        </PcmsSectionCard>

        {/* STILL BOX */}
        <PcmsSectionCard icon="💬" name="Still Have a Question (CTA)" order={3}>
          <Inp label="Heading" value={stillBox.heading} onChange={(v) => patch("stillBox", { heading: v })} />
          <div style={{ marginTop: "6px" }}>
            <Inp label="Body" value={stillBox.body} onChange={(v) => patch("stillBox", { body: v })} area />
          </div>
          <div style={{ marginTop: "6px" }}>
            <Inp label="Button Label" value={stillBox.buttonLabel} onChange={(v) => patch("stillBox", { buttonLabel: v })} />
          </div>
          <div className="pcms-section-divider" style={{ marginTop: "10px" }}>
            Enquiry modal (opened by the button)
          </div>
          <div className="pcms-field-grid">
            <Inp label="Modal Icon" value={stillBox.modalIcon} onChange={(v) => patch("stillBox", { modalIcon: v })} flex="0 0 90px" />
            <Inp label="Modal Title" value={stillBox.modalTitle} onChange={(v) => patch("stillBox", { modalTitle: v })} />
          </div>
          <div style={{ marginTop: "6px" }}>
            <Inp label="Modal Description" value={stillBox.modalDesc} onChange={(v) => patch("stillBox", { modalDesc: v })} area />
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
