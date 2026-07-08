"use client";

import { useState } from "react";
import type { ContactConfig } from "@/lib/siteSettings";
import type { ContactLinkType } from "@/lib/site/data/contact";
import { PcmsSectionCard } from "./shared";
import { Inp, RowCard, AddBtn, RemoveBtn, upd, rm } from "./fields";

/**
 * Pages-CMS → Contact. Editable: hero copy, the enquiry cards (icon / title /
 * body / link), and the message form's labels, placeholders, button, and success
 * message. The form's submit wiring stays in the component. Saves to
 * `site_settings.pages.contact`.
 */
export function ContactEditorPage({ contact }: { contact: ContactConfig }) {
  const [cfg, setCfg] = useState<ContactConfig>(contact);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const patch = <K extends keyof ContactConfig>(k: K, p: Partial<ContactConfig[K]>) =>
    setCfg((c) => ({ ...c, [k]: { ...c[k], ...p } }));
  const setCards = (cards: ContactConfig["cards"]) => setCfg((c) => ({ ...c, cards }));

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages: { contact: cfg } }),
      });
      if (res.ok) {
        setSaved(true);
        window.setTimeout(() => setSaved(false), 1800);
      } else {
        const d = await res.json().catch(() => ({}));
        window.alert(d.error || "Could not save the Contact page.");
      }
    } catch {
      window.alert("Network error — please try again.");
    }
    setSaving(false);
  };
  const lbl = (f: string) => (saving ? "Saving…" : saved ? "Saved ✓" : f);

  const { hero, cards, form } = cfg;

  return (
    <div className="page" id="page-pcms-contact" suppressHydrationWarning>
      <div className="pcms-page-header">
        <div>
          <div className="pcms-page-title">Contact</div>
          <div className="pcms-page-meta">
            Frontend path: <strong>/contact</strong> · 3 sections
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
            <Inp label="Eyebrow Label" value={hero.label} onChange={(v) => patch("hero", { label: v })} />
            <Inp label="Heading" value={hero.heading} onChange={(v) => patch("hero", { heading: v })} />
          </div>
          <div style={{ marginTop: "6px" }}>
            <Inp label="Subcopy" value={hero.sub} onChange={(v) => patch("hero", { sub: v })} area />
          </div>
        </PcmsSectionCard>

        {/* ENQUIRY CARDS */}
        <PcmsSectionCard icon="📇" name="Enquiry Cards" order={2}>
          <div className="field-hint" style={{ marginBottom: "10px" }}>
            Link type: <strong>email</strong> opens a mail draft, <strong>page</strong> opens an
            in-site section (e.g. <code>partner</code>), <strong>url</strong> links to any address.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
            {cards.map((c, i) => (
              <RowCard key={i}>
                <div className="pcms-field-grid" style={{ alignItems: "flex-end" }}>
                  <Inp label="Icon" value={c.icon} onChange={(v) => setCards(upd(cards, i, { icon: v }))} flex="0 0 80px" />
                  <Inp label="Title" value={c.title} onChange={(v) => setCards(upd(cards, i, { title: v }))} />
                  <RemoveBtn onClick={() => setCards(rm(cards, i))} />
                </div>
                <div style={{ marginTop: "6px" }}>
                  <Inp label="Body" value={c.body} onChange={(v) => setCards(upd(cards, i, { body: v }))} area />
                </div>
                <div className="pcms-field-grid" style={{ marginTop: "6px" }}>
                  <div className="field" style={{ margin: 0, flex: "0 0 120px" }}>
                    <label>Link Type</label>
                    <select value={c.linkType} onChange={(e) => setCards(upd(cards, i, { linkType: e.target.value as ContactLinkType }))}>
                      <option value="email">email</option>
                      <option value="page">page</option>
                      <option value="url">url</option>
                    </select>
                  </div>
                  <Inp
                    label={c.linkType === "email" ? "Email address" : c.linkType === "page" ? "Page id" : "URL"}
                    value={c.linkValue}
                    onChange={(v) => setCards(upd(cards, i, { linkValue: v }))}
                  />
                  <Inp label="Link Text" value={c.linkLabel} onChange={(v) => setCards(upd(cards, i, { linkLabel: v }))} />
                </div>
              </RowCard>
            ))}
          </div>
          <AddBtn
            label="Add Card"
            onClick={() => setCards([...cards, { icon: "💬", title: "", body: "", linkType: "email", linkValue: "", linkLabel: "" }])}
          />
        </PcmsSectionCard>

        {/* MESSAGE FORM */}
        <PcmsSectionCard icon="✉️" name="Message Form" order={3}>
          <Inp label="Form Heading" value={form.heading} onChange={(v) => patch("form", { heading: v })} />
          <div className="pcms-section-divider" style={{ marginTop: "10px" }}>
            Field labels &amp; placeholders
          </div>
          <div className="pcms-field-grid">
            <Inp label="Name label" value={form.nameLabel} onChange={(v) => patch("form", { nameLabel: v })} />
            <Inp label="Name placeholder" value={form.namePlaceholder} onChange={(v) => patch("form", { namePlaceholder: v })} />
          </div>
          <div className="pcms-field-grid" style={{ marginTop: "6px" }}>
            <Inp label="Email label" value={form.emailLabel} onChange={(v) => patch("form", { emailLabel: v })} />
            <Inp label="Email placeholder" value={form.emailPlaceholder} onChange={(v) => patch("form", { emailPlaceholder: v })} />
          </div>
          <div className="pcms-field-grid" style={{ marginTop: "6px" }}>
            <Inp label="Subject label" value={form.subjectLabel} onChange={(v) => patch("form", { subjectLabel: v })} />
            <Inp label="Subject placeholder" value={form.subjectPlaceholder} onChange={(v) => patch("form", { subjectPlaceholder: v })} />
          </div>
          <div className="pcms-field-grid" style={{ marginTop: "6px" }}>
            <Inp label="Message label" value={form.messageLabel} onChange={(v) => patch("form", { messageLabel: v })} />
            <Inp label="Message placeholder" value={form.messagePlaceholder} onChange={(v) => patch("form", { messagePlaceholder: v })} />
          </div>
          <div className="pcms-section-divider" style={{ marginTop: "10px" }}>
            Button &amp; success message
          </div>
          <div className="pcms-field-grid">
            <Inp label="Submit Button Label" value={form.submitLabel} onChange={(v) => patch("form", { submitLabel: v })} />
            <Inp label="Success Heading" value={form.successHeading} onChange={(v) => patch("form", { successHeading: v })} />
          </div>
          <div style={{ marginTop: "6px" }}>
            <Inp label="Success Body (use {name} for the sender's first name)" value={form.successBody} onChange={(v) => patch("form", { successBody: v })} area />
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
