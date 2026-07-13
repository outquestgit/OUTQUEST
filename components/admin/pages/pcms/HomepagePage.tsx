"use client";

import { useState } from "react";
import type { HomepageConfig, HeroCard, ReelCard } from "@/lib/siteSettings";
import { PcmsSectionCard } from "./shared";
import { Inp, ImageField, RowCard, AddBtn, RemoveBtn, upd, rm } from "./fields";
import { PageSeoData } from "@/lib/types";
import { SeoPanel } from "./SeoPanel";

const CPS = ["cp1", "cp2", "cp3", "cp4", "cp5", "cp6", "cp7", "cp8", "cp9"];
const ACTION_TYPES = ["destination", "category", "page"] as const;

const Note = ({ children }: { children: React.ReactNode }) => (
  <div className="field-hint" style={{ marginBottom: "10px" }}>
    {children}
  </div>
);

/**
 * Pages-CMS → Homepage. Every section is an editable form, mirroring the live
 * home page, prefilled from saved settings (defaults = current content). Journal
 * and Popular Programs expose only title/subtitle/button — their cards are
 * dynamic (published quests / journal posts). One `save()` persists the whole
 * config; the page's "Save Page" / "Save All Sections" buttons all call it.
 */
/** Term slugs offered as reel-card link targets (Country / Outcome Goal). */
export interface ReelTaxTerm {
  slug: string;
  name: string;
}
export interface ReelTax {
  destination: ReelTaxTerm[];
  category: ReelTaxTerm[];
  outcome: ReelTaxTerm[];
}

export function HomepagePage({
  homepage,
  reelTax = { destination: [], category: [], outcome: [] },
  fullPageSeo = {},
}: {
  homepage: HomepageConfig;
  reelTax?: ReelTax;
  fullPageSeo?: Record<string, PageSeoData>;
}) {
  const [cfg, setCfg] = useState<HomepageConfig>(homepage);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [seoData, setSeoData] = useState<PageSeoData>(fullPageSeo?.["homepage"] || {});

  // Section-scoped immutable updaters.
  const patch = <K extends keyof HomepageConfig>(k: K, p: Partial<HomepageConfig[K]>) =>
    setCfg((c) => ({ ...c, [k]: { ...c[k], ...p } }));

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homepage: cfg,
          page_seo: { ...fullPageSeo, homepage: seoData },
        }),
      });
      if (res.ok) {
        setSaved(true);
        window.setTimeout(() => setSaved(false), 1800);
      } else {
        const d = await res.json().catch(() => ({}));
        window.alert(d.error || "Could not save the homepage.");
      }
    } catch {
      window.alert("Network error — please try again.");
    }
    setSaving(false);
  };
  const saveLabel = (fallback: string) => (saving ? "Saving…" : saved ? "Saved ✓" : fallback);

  const hero = cfg.hero;
  const setHeroCards = (key: "cards1" | "cards2", list: HeroCard[]) => patch("hero", { [key]: list });

  const renderHeroCards = (key: "cards1" | "cards2", title: string) => {
    const cards = hero[key];
    return (
      <>
        <div className="pcms-section-divider">{title}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
          {cards.map((c, i) => (
            <RowCard key={i}>
              <div className="pcms-field-grid" style={{ marginBottom: "6px" }}>
                <div className="field" style={{ margin: 0 }}>
                  <label>Colour</label>
                  <select value={c.cp} onChange={(e) => setHeroCards(key, upd(cards, i, { cp: e.target.value }))} style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "12px" }}>
                    {CPS.map((cp) => (
                      <option key={cp} value={cp}>
                        {cp}
                      </option>
                    ))}
                  </select>
                </div>
                <Inp label="Emoji" value={c.icon} onChange={(v) => setHeroCards(key, upd(cards, i, { icon: v }))} flex="0 0 80px" />
              </div>
              <div className="pcms-field-grid" style={{ marginBottom: "6px" }}>
                <ImageField
                  label="Image (optional — replaces the emoji)"
                  value={c.image ?? ""}
                  onChange={(v) => setHeroCards(key, upd(cards, i, { image: v }))}
                />
              </div>
              <div className="pcms-field-grid">
                <Inp label="Title" value={c.title} onChange={(v) => setHeroCards(key, upd(cards, i, { title: v }))} />
                <Inp label="Description" value={c.desc} onChange={(v) => setHeroCards(key, upd(cards, i, { desc: v }))} />
              </div>
              <div className="pcms-field-grid" style={{ marginTop: "6px", alignItems: "flex-end" }}>
                <Inp label="Link (page id)" value={c.link} onChange={(v) => setHeroCards(key, upd(cards, i, { link: v }))} placeholder="e.g. work-abroad" />
                <RemoveBtn onClick={() => setHeroCards(key, rm(cards, i))} />
              </div>
            </RowCard>
          ))}
        </div>
        <AddBtn label="Add Card" onClick={() => setHeroCards(key, [...cards, { cp: "cp1", icon: "", title: "", desc: "", link: "" }])} />
      </>
    );
  };

  const renderReel = (k: "destination" | "goals", icon: string, name: string) => {
    const sec = cfg[k];
    const setCards = (list: ReelCard[]) => patch(k, { cards: list });
    return (
      <PcmsSectionCard icon={icon} name={name} order={0}>
        <div className="pcms-field-grid">
          <Inp label="Section Title" value={sec.title} onChange={(v) => patch(k, { title: v })} />
          <Inp label="Button Label" value={sec.buttonLabel} onChange={(v) => patch(k, { buttonLabel: v })} />
        </div>
        <div className="pcms-section-divider">Cards</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
          {sec.cards.map((c, i) => (
            <RowCard key={i}>
              <div className="pcms-field-grid" style={{ marginBottom: "6px" }}>
                <Inp label="Emoji" value={c.emoji} onChange={(v) => setCards(upd(sec.cards, i, { emoji: v }))} flex="0 0 80px" />
                <Inp label="Tag" value={c.tag} onChange={(v) => setCards(upd(sec.cards, i, { tag: v }))} />
              </div>
              <div className="pcms-field-grid">
                <Inp label="Title" value={c.title} onChange={(v) => setCards(upd(sec.cards, i, { title: v }))} />
                <Inp label="Count / Subtext" value={c.count} onChange={(v) => setCards(upd(sec.cards, i, { count: v }))} />
              </div>
              {/* Uploaded banner replaces the gradient on the front; the gradient
                  stays as a fallback for cards without an image. */}
              <ImageField label="Banner image (replaces gradient)" value={c.image ?? ""} onChange={(v) => setCards(upd(sec.cards, i, { image: v }))} />
              <Inp label="Fallback gradient (used if no image)" value={c.gradient} onChange={(v) => setCards(upd(sec.cards, i, { gradient: v }))} placeholder="linear-gradient(...)" />
              <div className="pcms-field-grid" style={{ marginTop: "6px", alignItems: "flex-end" }}>
                <div className="field" style={{ margin: 0, flex: "0 0 130px" }}>
                  <label>Action type</label>
                  <select
                    value={c.action.type}
                    onChange={(e) => setCards(upd(sec.cards, i, { action: { type: e.target.value as ReelCard["action"]["type"], value: "" } }))}
                    style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "12px" }}
                  >
                    {ACTION_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                {/* A quest-filter target must be a real term slug so the linked
                    filter matches: destination → Country, category → Category,
                    outcome → Outcome Goal (legacy). A page target is free text. */}
                {c.action.type === "page" ? (
                  <Inp label="Page id" value={c.action.value} onChange={(v) => setCards(upd(sec.cards, i, { action: { ...c.action, value: v } }))} placeholder="e.g. work-abroad" />
                ) : (
                  <div className="field" style={{ margin: 0, flex: 1 }}>
                    <label>
                      {c.action.type === "destination" ? "Destination (Country)" : c.action.type === "category" ? "Goal (Category)" : "Goal (Outcome)"}
                    </label>
                    <select
                      value={c.action.value}
                      onChange={(e) => setCards(upd(sec.cards, i, { action: { ...c.action, value: e.target.value } }))}
                      style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "12px" }}
                    >
                      <option value="">— select —</option>
                      {(c.action.type === "destination" ? reelTax.destination : c.action.type === "category" ? reelTax.category : reelTax.outcome).map((t) => (
                        <option key={t.slug} value={t.slug}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <RemoveBtn onClick={() => setCards(rm(sec.cards, i))} />
              </div>
            </RowCard>
          ))}
        </div>
        <AddBtn label="Add Card" onClick={() => setCards([...sec.cards, { action: { type: "page", value: "" }, gradient: "", emoji: "", tag: "", title: "", count: "" }])} />
      </PcmsSectionCard>
    );
  };

  const why = cfg.why;
  const wus = cfg.whoUsesUs;
  const proof = cfg.socialProof;

  return (
    <div className="page" id="page-pcms-homepage" suppressHydrationWarning>
      <div className="pcms-page-header">
        <div>
          <div className="pcms-page-title">Homepage</div>
          <div className="pcms-page-meta">
            Frontend path: <strong>/</strong> · 9 sections
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn btn-ghost btn-sm">👁 Preview</button>
          <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
            {saveLabel("Save Page")}
          </button>
        </div>
      </div>

      <div className="pcms-sections-grid">
        {/* HERO */}
        <PcmsSectionCard icon="🌄" name="Hero" order={1}>
          <div className="pcms-section-divider">Left column — headline &amp; CTAs</div>
          <div className="pcms-field-grid">
            <Inp label="H1 Main Text" value={hero.h1Main} onChange={(v) => patch("hero", { h1Main: v })} />
            <Inp label="H1 Emphasis (italic word)" value={hero.h1Em} onChange={(v) => patch("hero", { h1Em: v })} />
          </div>
          <Inp label="Tagline / Subheadline" value={hero.tagline} onChange={(v) => patch("hero", { tagline: v })} />
          <div className="pcms-field-grid">
            <Inp label="Primary CTA Label" value={hero.primaryCtaLabel} onChange={(v) => patch("hero", { primaryCtaLabel: v })} />
            <Inp label="Secondary CTA Label" value={hero.secondaryCtaLabel} onChange={(v) => patch("hero", { secondaryCtaLabel: v })} />
          </div>
          <div className="pcms-section-divider" style={{ marginTop: "18px" }}>
            Goal pills
          </div>
          <Note>
            Label + destination page id (optionally <code>page?outcome=value</code>).
          </Note>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
            {hero.pills.map((p, i) => (
              <div key={i} className="pcms-field-grid" style={{ alignItems: "flex-end", background: "var(--surface2)", borderRadius: "8px", padding: "8px 10px", border: "1px solid var(--border)" }}>
                <Inp label="Label" value={p.label} onChange={(v) => patch("hero", { pills: upd(hero.pills, i, { label: v }) })} flex={2} />
                <Inp label="Link (page id)" value={p.link} onChange={(v) => patch("hero", { pills: upd(hero.pills, i, { link: v }) })} flex={2} placeholder="e.g. work-abroad" />
                <RemoveBtn onClick={() => patch("hero", { pills: rm(hero.pills, i) })} />
              </div>
            ))}
          </div>
          <AddBtn label="Add Pill" onClick={() => patch("hero", { pills: [...hero.pills, { label: "", link: "" }] })} />
          <div className="pcms-section-divider" style={{ marginTop: "6px" }}>
            Right panel — scrolling quest cards
          </div>
          {renderHeroCards("cards1", "Column 1 (scrolls up)")}
          {renderHeroCards("cards2", "Column 2 (scrolls down)")}
        </PcmsSectionCard>

        {/* VALUE PROPS / WHY */}
        <PcmsSectionCard icon="💡" name="Value Props — Stop Researching" order={2}>
          <Inp label="Section Heading" value={why.heading} onChange={(v) => patch("why", { heading: v })} />
          <div className="pcms-section-divider" style={{ marginTop: "10px" }}>
            Cards
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
            {why.cells.map((c, i) => (
              <RowCard key={i}>
                <div className="pcms-field-grid" style={{ alignItems: "flex-end" }}>
                  <Inp label="Emoji" value={c.emoji} onChange={(v) => patch("why", { cells: upd(why.cells, i, { emoji: v }) })} flex="0 0 80px" />
                  <Inp label="Heading" value={c.title} onChange={(v) => patch("why", { cells: upd(why.cells, i, { title: v }) })} />
                  <RemoveBtn onClick={() => patch("why", { cells: rm(why.cells, i) })} />
                </div>
                <Inp label="Body" value={c.body} onChange={(v) => patch("why", { cells: upd(why.cells, i, { body: v }) })} area />
              </RowCard>
            ))}
          </div>
          <AddBtn label="Add Card" onClick={() => patch("why", { cells: [...why.cells, { emoji: "", title: "", body: "" }] })} />
        </PcmsSectionCard>

        {/* WHO USES US */}
        <PcmsSectionCard icon="👥" name="Who Uses Us" order={3}>
          <div className="pcms-field-grid">
            <Inp label="Title" value={wus.title} onChange={(v) => patch("whoUsesUs", { title: v })} />
            <Inp label="Subtitle" value={wus.subtitle} onChange={(v) => patch("whoUsesUs", { subtitle: v })} />
          </div>
          <div className="pcms-section-divider" style={{ marginTop: "10px" }}>
            Persona cards
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
            {wus.personas.map((p, i) => (
              <RowCard key={p.key || i}>
                <div className="pcms-field-grid" style={{ marginBottom: "6px" }}>
                  <Inp label="Emoji" value={p.emoji} onChange={(v) => patch("whoUsesUs", { personas: upd(wus.personas, i, { emoji: v }) })} flex="0 0 80px" />
                  <Inp label="Name" value={p.name} onChange={(v) => patch("whoUsesUs", { personas: upd(wus.personas, i, { name: v }) })} />
                  <Inp label="Role" value={p.role} onChange={(v) => patch("whoUsesUs", { personas: upd(wus.personas, i, { role: v }) })} />
                </div>
                <div className="pcms-field-grid" style={{ marginBottom: "6px" }}>
                  <Inp label="Pull label" value={p.pull} onChange={(v) => patch("whoUsesUs", { personas: upd(wus.personas, i, { pull: v }) })} />
                  <Inp label="Quests heading" value={p.questsTitle} onChange={(v) => patch("whoUsesUs", { personas: upd(wus.personas, i, { questsTitle: v }) })} />
                </div>
                <Inp label="Quests (one per line)" value={p.quests.join("\n")} onChange={(v) => patch("whoUsesUs", { personas: upd(wus.personas, i, { quests: v.split("\n") }) })} area />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px" }}>
                  <RemoveBtn onClick={() => patch("whoUsesUs", { personas: rm(wus.personas, i) })} />
                </div>
              </RowCard>
            ))}
          </div>
          <AddBtn
            label="Add Persona"
            onClick={() =>
              patch("whoUsesUs", {
                personas: [
                  ...wus.personas,
                  { cls: `p${(wus.personas.length % 5) + 1}`, key: `persona-${Date.now()}`, emoji: "", name: "", role: "", pull: "Pull to see quests", questsTitle: "", quests: [] },
                ],
              })
            }
          />
        </PcmsSectionCard>

        {/* POPULAR PROGRAMS (cards dynamic) */}
        <PcmsSectionCard icon="🎯" name="Popular Programs" order={4}>
          <Note>Program cards are dynamic (published quests). Only the heading, subtitle and button are editable.</Note>
          <div className="pcms-field-grid">
            <Inp label="Eyebrow Label" value={cfg.popularPrograms.label} onChange={(v) => patch("popularPrograms", { label: v })} />
            <Inp label="Title" value={cfg.popularPrograms.title} onChange={(v) => patch("popularPrograms", { title: v })} />
          </div>
          <Inp label="Subtitle" value={cfg.popularPrograms.subtitle} onChange={(v) => patch("popularPrograms", { subtitle: v })} area />
          <div style={{ marginTop: "8px" }}>
            <Inp label="Button Label" value={cfg.popularPrograms.buttonLabel} onChange={(v) => patch("popularPrograms", { buttonLabel: v })} />
          </div>
        </PcmsSectionCard>

        {/* SOCIAL PROOF */}
        <PcmsSectionCard icon="⭐" name="Social Proof Strip" order={5}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={!!proof.hide}
              onChange={(e) => patch("socialProof", { hide: e.target.checked })}
            />
            Hide this section on the homepage
          </label>
          <div className="pcms-field-grid">
            <Inp label="Title" value={proof.title} onChange={(v) => patch("socialProof", { title: v })} />
            <Inp label="Subtitle" value={proof.subtitle} onChange={(v) => patch("socialProof", { subtitle: v })} />
          </div>
          <div className="pcms-section-divider" style={{ marginTop: "10px" }}>
            Testimonial cards
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
            {proof.cards.map((c, i) => (
              <RowCard key={i}>
                <Inp label="Outcome" value={c.outcome} onChange={(v) => patch("socialProof", { cards: upd(proof.cards, i, { outcome: v }) })} />
                <div style={{ marginTop: "6px" }}>
                  <Inp label="Quote" value={c.quote} onChange={(v) => patch("socialProof", { cards: upd(proof.cards, i, { quote: v }) })} area />
                </div>
                <div className="pcms-field-grid" style={{ marginTop: "6px" }}>
                  <Inp label="Avatar emoji" value={c.avatarEmoji} onChange={(v) => patch("socialProof", { cards: upd(proof.cards, i, { avatarEmoji: v }) })} flex="0 0 90px" />
                  <div className="field" style={{ margin: 0, flex: "0 0 90px" }}>
                    <label>Avatar bg</label>
                    <input type="color" value={c.avatarBg || "#cccccc"} onChange={(e) => patch("socialProof", { cards: upd(proof.cards, i, { avatarBg: e.target.value }) })} style={{ height: "34px", padding: "3px 6px", cursor: "pointer", width: "100%" }} />
                  </div>
                  <Inp label="Name" value={c.name} onChange={(v) => patch("socialProof", { cards: upd(proof.cards, i, { name: v }) })} />
                </div>
                <div className="pcms-field-grid" style={{ marginTop: "6px", alignItems: "flex-end" }}>
                  <Inp label="Detail" value={c.detail} onChange={(v) => patch("socialProof", { cards: upd(proof.cards, i, { detail: v }) })} />
                  <RemoveBtn onClick={() => patch("socialProof", { cards: rm(proof.cards, i) })} />
                </div>
              </RowCard>
            ))}
          </div>
          <AddBtn label="Add Testimonial" onClick={() => patch("socialProof", { cards: [...proof.cards, { outcome: "", quote: "", avatarBg: "#cccccc", avatarEmoji: "", name: "", detail: "" }] })} />
        </PcmsSectionCard>

        {/* WHO USES US handled above; reels: */}
        {renderReel("destination", "🧭", "Explore by Destination")}
        {renderReel("goals", "🎯", "Explore by Goals")}

        {/* JOURNAL (cards dynamic) */}
        <PcmsSectionCard icon="📝" name="Journal Preview" order={9}>
          <Note>Journal cards are dynamic (published posts). Only the title and button are editable.</Note>
          <div className="pcms-field-grid">
            <Inp label="Title" value={cfg.journal.title} onChange={(v) => patch("journal", { title: v })} />
            <Inp label="Button Label" value={cfg.journal.buttonLabel} onChange={(v) => patch("journal", { buttonLabel: v })} />
          </div>
        </PcmsSectionCard>

        {/* SEO */}
        <SeoPanel
          data={seoData}
          pagePath="/"
          order={99}
          onChange={(patch) => setSeoData((prev) => ({ ...prev, ...patch }))}
        />
      </div>

      <div className="pcms-page-save-bar">
        <button className="btn btn-primary" style={{ justifyContent: "center" }} onClick={save} disabled={saving}>
          {saveLabel("Save All Sections")}
        </button>
      </div>
    </div>
  );
}