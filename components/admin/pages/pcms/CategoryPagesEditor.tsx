"use client";

import { useState } from "react";
import type { CategoryHero } from "@/lib/siteSettings";
import { PcmsSectionCard } from "./shared";
import { Inp } from "./fields";

export interface CatTermInfo {
  slug: string;
  name: string;
  active: boolean;
}

/**
 * Pages-CMS → Category Pages. The pages themselves are generated from the
 * Category taxonomy (one public page per term); this editor sets each one's hero
 * (eyebrow label / H1 / subcopy). The quest grid is the published quests tagged
 * with that category. Adding a Category term creates a new page automatically.
 * Saves the whole map to `site_settings.pages.categories`.
 */
export function CategoryPagesEditor({
  terms,
  categories,
}: {
  terms: CatTermInfo[];
  categories: Record<string, CategoryHero>;
}) {
  const [map, setMap] = useState<Record<string, CategoryHero>>(() => {
    const seed: Record<string, CategoryHero> = {};
    for (const t of terms) {
      const h = categories[t.slug];
      seed[t.slug] = { label: h?.label ?? "", title: h?.title ?? "", sub: h?.sub ?? "" };
    }
    return seed;
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const patch = (slug: string, p: Partial<CategoryHero>) =>
    setMap((m) => ({ ...m, [slug]: { ...m[slug], ...p } }));

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages: { categories: map } }),
      });
      if (res.ok) {
        setSaved(true);
        window.setTimeout(() => setSaved(false), 1800);
      } else {
        const d = await res.json().catch(() => ({}));
        window.alert(d.error || "Could not save the category pages.");
      }
    } catch {
      window.alert("Network error — please try again.");
    }
    setSaving(false);
  };
  const lbl = (f: string) => (saving ? "Saving…" : saved ? "Saved ✓" : f);

  return (
    <div className="page" id="page-pcms-cat-pages" suppressHydrationWarning>
      <div className="pcms-page-header">
        <div>
          <div className="pcms-page-title">Category Pages</div>
          <div className="pcms-page-meta">
            Generated from <strong>Taxonomy → Category</strong> · {terms.length} pages
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
            {lbl("Save Page")}
          </button>
        </div>
      </div>

      <div className="field-hint" style={{ margin: "0 0 16px" }}>
        Each Category taxonomy term has its own public page at <code>/&lt;slug&gt;</code>. Add or
        remove categories under <strong>Taxonomy → Category</strong> to create or remove pages. Only
        the hero is editable here — the quest grid shows published quests tagged with that category.
      </div>

      {terms.length === 0 ? (
        <div className="field-hint">No categories yet. Add one under Taxonomy → Category.</div>
      ) : (
        <div className="pcms-sections-grid">
          {terms.map((t, i) => (
            <PcmsSectionCard key={t.slug} icon="🗂️" name={`${t.name}${t.active ? "" : " (hidden)"}`} order={i + 1}>
              <div className="field-hint" style={{ marginBottom: "8px" }}>
                Path: <strong>/{t.slug}</strong>
              </div>
              <Inp
                label="Eyebrow Label"
                value={map[t.slug]?.label ?? ""}
                placeholder={t.name}
                onChange={(v) => patch(t.slug, { label: v })}
              />
              <div style={{ marginTop: "6px" }}>
                <Inp
                  label="Heading (H1)"
                  value={map[t.slug]?.title ?? ""}
                  placeholder={t.name}
                  onChange={(v) => patch(t.slug, { title: v })}
                />
              </div>
              <div style={{ marginTop: "6px" }}>
                <Inp
                  label="Subcopy"
                  value={map[t.slug]?.sub ?? ""}
                  placeholder="Supporting text shown under the heading"
                  onChange={(v) => patch(t.slug, { sub: v })}
                  area
                />
              </div>
            </PcmsSectionCard>
          ))}
        </div>
      )}

      <div className="pcms-page-save-bar">
        <button className="btn btn-primary" style={{ justifyContent: "center" }} onClick={save} disabled={saving}>
          {lbl("Save All Categories")}
        </button>
      </div>
    </div>
  );
}
