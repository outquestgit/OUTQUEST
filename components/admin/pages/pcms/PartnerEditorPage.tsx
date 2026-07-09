"use client";

import { useState } from "react";
import type { PartnerConfig } from "@/lib/siteSettings";
import { PcmsSectionCard } from "./shared";
import { Inp, RowCard, AddBtn, RemoveBtn, upd, rm, updStr } from "./fields";
import { PageSeoData } from "@/lib/types";
import { SeoPanel } from "./SeoPanel";

/** Editable list of single strings (pills / offering options). */
function StringList({ items, onChange, addLabel, placeholder }: { items: string[]; onChange: (l: string[]) => void; addLabel: string; placeholder?: string }) {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "8px" }}>
        {items.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
            <Inp label={`#${i + 1}`} value={s} onChange={(v) => onChange(updStr(items, i, v))} placeholder={placeholder} flex={1} />
            <RemoveBtn onClick={() => onChange(rm(items, i))} />
          </div>
        ))}
      </div>
      <AddBtn label={addLabel} onClick={() => onChange([...items, ""])} />
    </>
  );
}

/**
 * Pages-CMS → Partner. All section copy + the partner-category cards, why cards,
 * FAQ, and the application-form labels/options/success message are editable.
 * Decorative illustrations and the form's submit wiring stay in the component.
 * One save() persists to `site_settings.pages.partner`.
 */
export function PartnerEditorPage({
  partner,
  fullPageSeo,
}: {
  partner: PartnerConfig;
  fullPageSeo: Record<string, PageSeoData>;
}) {
  const [cfg, setCfg] = useState<PartnerConfig>(partner);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [seoData, setSeoData] = useState<PageSeoData>(fullPageSeo?.["partner"] || {});

  const patch = <K extends keyof PartnerConfig>(k: K, p: Partial<PartnerConfig[K]>) =>
    setCfg((c) => ({ ...c, [k]: { ...c[k], ...p } }));

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pages: { partner: cfg },
          page_seo: { ...fullPageSeo, partner: seoData },
        }),
      });
      if (res.ok) {
        setSaved(true);
        window.setTimeout(() => setSaved(false), 1800);
      } else {
        const d = await res.json().catch(() => ({}));
        window.alert(d.error || "Could not save the Partner page.");
      }
    } catch {
      window.alert("Network error — please try again.");
    }
    setSaving(false);
  };
  const lbl = (f: string) => (saving ? "Saving…" : saved ? "Saved ✓" : f);

  const { hero, whatWeDo, partnerWith, why, faq, form } = cfg;

  return (
    <div className="page" id="page-pcms-partners" suppressHydrationWarning>
      <div className="pcms-page-header">
        <div>
          <div className="pcms-page-title">Partners</div>
          <div className="pcms-page-meta">
            Frontend path: <strong>/partner</strong> · 7 sections
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
          <Inp label="Headline" value={hero.headline} onChange={(v) => patch("hero", { headline: v })} area />
          <div style={{ marginTop: "6px" }}>
            <Inp label="Sub-headline" value={hero.sub} onChange={(v) => patch("hero", { sub: v })} area />
          </div>
          <div style={{ marginTop: "6px" }}>
            <Inp label="CTA Button Label" value={hero.ctaLabel} onChange={(v) => patch("hero", { ctaLabel: v })} />
          </div>
        </PcmsSectionCard>

        {/* WHAT WE DO */}
        <PcmsSectionCard icon="📝" name="What We Do" order={2}>
          <div className="pcms-field-grid">
            <Inp label="Eyebrow Label" value={whatWeDo.label} onChange={(v) => patch("whatWeDo", { label: v })} />
            <Inp label="Heading (line breaks allowed)" value={whatWeDo.heading} onChange={(v) => patch("whatWeDo", { heading: v })} area />
          </div>
          <div style={{ marginTop: "6px" }}>
            <Inp label="Subtext" value={whatWeDo.sub} onChange={(v) => patch("whatWeDo", { sub: v })} area />
          </div>
          <div className="pcms-section-divider" style={{ marginTop: "10px" }}>
            Pills
          </div>
          <StringList items={whatWeDo.pills} onChange={(pills) => patch("whatWeDo", { pills })} addLabel="Add Pill" placeholder="🗺️ Roadmap" />
        </PcmsSectionCard>

        {/* WHO WE PARTNER WITH */}
        <PcmsSectionCard icon="🤝" name="Who We Partner With" order={3}>
          <Inp label="Heading" value={partnerWith.heading} onChange={(v) => patch("partnerWith", { heading: v })} />
          <div className="pcms-section-divider" style={{ marginTop: "10px" }}>
            Category cards
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
            {partnerWith.cards.map((c, i) => (
              <RowCard key={i}>
                <div className="pcms-field-grid">
                  <Inp label="Icon" value={c.icon} onChange={(v) => patch("partnerWith", { cards: upd(partnerWith.cards, i, { icon: v }) })} flex="0 0 80px" />
                  <Inp label="Title" value={c.title} onChange={(v) => patch("partnerWith", { cards: upd(partnerWith.cards, i, { title: v }) })} />
                </div>
                <div style={{ marginTop: "6px" }}>
                  <Inp label="Body" value={c.body} onChange={(v) => patch("partnerWith", { cards: upd(partnerWith.cards, i, { body: v }) })} area />
                </div>
                <div className="pcms-field-grid" style={{ marginTop: "6px", alignItems: "flex-end" }}>
                  <div className="field" style={{ margin: 0, flex: "0 0 110px" }}>
                    <label>Background</label>
                    <input type="color" value={c.bg || "#FFD400"} onChange={(e) => patch("partnerWith", { cards: upd(partnerWith.cards, i, { bg: e.target.value }) })} style={{ height: "34px", padding: "3px 6px", cursor: "pointer", width: "100%" }} />
                  </div>
                  <div className="field" style={{ margin: 0, flex: "0 0 110px" }}>
                    <label>Text colour</label>
                    <input type="color" value={c.color || "#161412"} onChange={(e) => patch("partnerWith", { cards: upd(partnerWith.cards, i, { color: e.target.value }) })} style={{ height: "34px", padding: "3px 6px", cursor: "pointer", width: "100%" }} />
                  </div>
                  <div style={{ flex: 1 }}></div>
                  <RemoveBtn onClick={() => patch("partnerWith", { cards: rm(partnerWith.cards, i) })} />
                </div>
              </RowCard>
            ))}
          </div>
          <AddBtn label="Add Category" onClick={() => patch("partnerWith", { cards: [...partnerWith.cards, { bg: "#FFD400", color: "#161412", icon: "", title: "", body: "" }] })} />
        </PcmsSectionCard>

        {/* WHY PARTNER */}
        <PcmsSectionCard icon="✦" name="Why Partner" order={4}>
          <Inp label="Heading" value={why.heading} onChange={(v) => patch("why", { heading: v })} />
          <div className="field-hint" style={{ marginTop: "6px" }}>
            Cards are numbered automatically in order.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
            {why.cards.map((c, i) => (
              <RowCard key={i}>
                <div className="pcms-field-grid" style={{ alignItems: "flex-end" }}>
                  <Inp label="Emoji" value={c.emoji} onChange={(v) => patch("why", { cards: upd(why.cards, i, { emoji: v }) })} flex="0 0 80px" />
                  <Inp label="Title" value={c.title} onChange={(v) => patch("why", { cards: upd(why.cards, i, { title: v }) })} />
                  <RemoveBtn onClick={() => patch("why", { cards: rm(why.cards, i) })} />
                </div>
                <div style={{ marginTop: "6px" }}>
                  <Inp label="Body" value={c.body} onChange={(v) => patch("why", { cards: upd(why.cards, i, { body: v }) })} area />
                </div>
              </RowCard>
            ))}
          </div>
          <AddBtn label="Add Card" onClick={() => patch("why", { cards: [...why.cards, { emoji: "", title: "", body: "" }] })} />
        </PcmsSectionCard>

        {/* FAQ */}
        <PcmsSectionCard icon="💬" name="FAQ" order={5}>
          <div className="pcms-field-grid">
            <Inp label="Emoji" value={faq.emoji} onChange={(v) => patch("faq", { emoji: v })} flex="0 0 80px" />
            <Inp label="Eyebrow Label" value={faq.label} onChange={(v) => patch("faq", { label: v })} />
            <Inp label="Heading" value={faq.heading} onChange={(v) => patch("faq", { heading: v })} />
          </div>
          <div className="pcms-section-divider" style={{ marginTop: "10px" }}>
            Questions
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
            {faq.items.map((it, i) => (
              <RowCard key={i}>
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                  <Inp label="Question" value={it.q} onChange={(v) => patch("faq", { items: upd(faq.items, i, { q: v }) })} flex={1} />
                  <RemoveBtn onClick={() => patch("faq", { items: rm(faq.items, i) })} />
                </div>
                <div style={{ marginTop: "6px" }}>
                  <Inp label="Answer" value={it.a} onChange={(v) => patch("faq", { items: upd(faq.items, i, { a: v }) })} area />
                </div>
              </RowCard>
            ))}
          </div>
          <AddBtn label="Add Question" onClick={() => patch("faq", { items: [...faq.items, { q: "", a: "" }] })} />
        </PcmsSectionCard>

        {/* APPLICATION FORM */}
        <PcmsSectionCard icon="📋" name="Application Form" order={6}>
          <div className="pcms-field-grid">
            <Inp label="Emoji" value={form.emoji} onChange={(v) => patch("form", { emoji: v })} flex="0 0 80px" />
            <Inp label="Eyebrow Label" value={form.label} onChange={(v) => patch("form", { label: v })} />
            <Inp label="Heading" value={form.heading} onChange={(v) => patch("form", { heading: v })} />
          </div>
          <div style={{ marginTop: "6px" }}>
            <Inp label="Subtext" value={form.sub} onChange={(v) => patch("form", { sub: v })} area />
          </div>
          <div className="pcms-section-divider" style={{ marginTop: "10px" }}>
            Field labels
          </div>
          <div className="pcms-field-grid">
            <Inp label="Name field" value={form.nameLabel} onChange={(v) => patch("form", { nameLabel: v })} />
            <Inp label="Company field" value={form.companyLabel} onChange={(v) => patch("form", { companyLabel: v })} />
          </div>
          <div className="pcms-field-grid" style={{ marginTop: "6px" }}>
            <Inp label="Website field" value={form.websiteLabel} onChange={(v) => patch("form", { websiteLabel: v })} />
            <Inp label="Offering field" value={form.offeringLabel} onChange={(v) => patch("form", { offeringLabel: v })} />
          </div>
          <div className="pcms-field-grid" style={{ marginTop: "6px" }}>
            <Inp label="Description field" value={form.descLabel} onChange={(v) => patch("form", { descLabel: v })} />
            <Inp label="Email field" value={form.emailLabel} onChange={(v) => patch("form", { emailLabel: v })} />
          </div>
          <div className="pcms-section-divider" style={{ marginTop: "10px" }}>
            Offering options
          </div>
          <StringList items={form.offerings} onChange={(offerings) => patch("form", { offerings })} addLabel="Add Option" placeholder="🌐 Other" />
          <div className="pcms-field-grid">
            <Inp label="Submit Button Label" value={form.submitLabel} onChange={(v) => patch("form", { submitLabel: v })} />
            <Inp label="Success Heading" value={form.successHeading} onChange={(v) => patch("form", { successHeading: v })} />
          </div>
          <div style={{ marginTop: "6px" }}>
            <Inp label="Success Body" value={form.successBody} onChange={(v) => patch("form", { successBody: v })} area />
          </div>
        </PcmsSectionCard>

        {/* SEO */}
        <SeoPanel
          data={seoData}
          pagePath="/partner"
          order={7}
          onChange={(patch) => setSeoData((prev) => ({ ...prev, ...patch }))}
        />
      </div>

      <div className="pcms-page-save-bar">
        <button className="btn btn-primary" style={{ justifyContent: "center" }} onClick={save} disabled={saving}>
          {lbl("Save All Sections")}
        </button>
      </div>
    </div>
  );
}