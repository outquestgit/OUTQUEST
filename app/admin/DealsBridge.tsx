"use client";

import { useEffect } from "react";
import type { BookingFormField, LeadFormField } from "@/lib/deals";

/** Serializable deal data the bridge uses to populate the editor on Edit. */
export type EditDeal = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  short_desc: string | null;
  partner_name: string | null;
  card_icon: string | null;
  card_color: string | null;
  what_is: string | null;
  who_for: string | null;
  why_useful: string | null;
  requirements: string[];
  checklist: string[];
  cta_label: string | null;
  action_type: string | null;
  book_url: string | null;
  affiliate_url: string | null;
  lead_form_fields: LeadFormField[];
  pay_type: string | null;
  total_price: number | null;
  deposit_amount: number | null;
  refund_policy: string | null;
  booking_fields: BookingFormField[];
  price_from: number | null;
  billing_unit: string | null;
  offer_label: string | null;
  offer_price: string | null;
  outcome_text: string | null;
  cta_heading: string | null;
  cta_subtext: string | null;
  cta_button_label: string | null;
  verified: boolean;
  featured: boolean;
  seo_title: string | null;
  meta_description: string | null;
  visibility: string;
  display_order: number;
  featured_image_path: string | null;
  card_image_path: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  noindex: boolean;
  image_alt: string | null;
  questSlugs: string[];
};

export type DealQuestOpt = {
  id: string;
  slug: string;
  title: string;
  countrySlug: string;
  countryLabel: string;
  categorySlug: string;
  categoryLabel: string;
};

export type DealQuestTaxonomy = {
  countries: { slug: string; name: string }[];
  categories: { slug: string; name: string }[];
};

const SHORT_DESC_PH = "2–3 sentences summarising this deal…";
const PARTNER_PH = "e.g. Surf Bali Co.";
const esc = (s: string) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Makes the reference admin's Deal editor create + update deals (no UI change).
 * Mirrors QuestEditorBridge: reads/writes the existing fields by id / placeholder
 * / label, drives the requirements + "what you get" repeaters, and overrides the
 * connected-quests selector globals (admin.js renders them from a hardcoded list)
 * to use live DB quests instead.
 */
export default function DealsBridge({
  deals,
  quests,
  taxonomies,
}: {
  deals: EditDeal[];
  quests: DealQuestOpt[];
  taxonomies: DealQuestTaxonomy;
}) {
  useEffect(() => {
    const root = document.getElementById("page-deals-edit");
    const list = document.getElementById("page-deals-list");
    if (!root) return;

    let currentEditId: string | null = null;
    const dealById = new Map(deals.map((d) => [d.id, d]));
    const slugToId = new Map(quests.map((q) => [q.slug, q.id]));

    // ── basic readers/writers ────────────────────────────────────────────
    const val = (id: string) => {
      const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
      return el ? el.value.trim() : "";
    };
    const setVal = (id: string, v: string) => {
      const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
      if (el) el.value = v;
    };
    const isChecked = (id: string) => !!(document.getElementById(id) as HTMLInputElement | null)?.checked;
    const setChecked = (id: string, v: boolean) => {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (el) el.checked = v;
    };
    const phInput = (ph: string) => root.querySelector<HTMLInputElement>(`input[placeholder="${ph}"]`);
    const phTextarea = (ph: string) => root.querySelector<HTMLTextAreaElement>(`textarea[placeholder="${ph}"]`);
    const readPh = (ph: string) => (phInput(ph) ?? phTextarea(ph))?.value.trim() ?? "";
    const setPh = (ph: string, v: string) => {
      const el = phInput(ph) ?? phTextarea(ph);
      if (el) el.value = v;
    };

    // RTE (contenteditable) fields, found by their field label.
    const rteArea = (label: string): HTMLElement | null => {
      for (const field of Array.from(root.querySelectorAll(".field"))) {
        if (field.querySelector("label")?.textContent?.trim() === label) {
          const a = field.querySelector<HTMLElement>(".rte-area");
          if (a) return a;
        }
      }
      return null;
    };
    const readRte = (label: string) => {
      const a = rteArea(label);
      if (!a) return "";
      if ((a.textContent ?? "").trim() === "" && !a.querySelector("img")) return "";
      return a.innerHTML.trim();
    };
    const setRte = (label: string, html: string) => {
      const a = rteArea(label);
      if (a) a.innerHTML = html ?? "";
    };

    // Repeaters (single-input rows): requirements + what-you-get.
    const readRepeater = (repId: string): string[] => {
      const rep = document.getElementById(repId);
      if (!rep) return [];
      return (Array.from(rep.querySelectorAll(":scope > .repeater-item")) as HTMLElement[])
        .map((item) => item.querySelector<HTMLInputElement>("input, textarea")?.value.trim() ?? "")
        .filter(Boolean);
    };
    const fillRepeater = (repId: string, rows: string[]) => {
      const rep = document.getElementById(repId);
      if (!rep) return;
      const items = Array.from(rep.querySelectorAll(":scope > .repeater-item")) as HTMLElement[];
      const template = items[0];
      if (!template) return;
      const make = (idx: number, v: string) => {
        const clone = template.cloneNode(true) as HTMLElement;
        const titleEl = clone.querySelector(".repeater-item-title");
        if (titleEl) titleEl.textContent = (titleEl.textContent ?? "").replace(/\d+/, String(idx + 1));
        const cell = clone.querySelector<HTMLInputElement>("input, textarea");
        if (cell) cell.value = v;
        return clone;
      };
      items.forEach((it) => it.remove());
      if (rows.length === 0) rep.appendChild(make(0, ""));
      else rows.forEach((r, i) => rep.appendChild(make(i, r)));
    };

    // Status toggle (button[0]=Draft, button[1]=Published).
    const setStatusToggle = (published: boolean) => {
      const sw = document.getElementById("d-status");
      if (!sw) return;
      Array.from(sw.querySelectorAll("button")).forEach((b, i) => {
        b.className = i === 0 ? (published ? "" : "active-draft") : published ? "active-published" : "";
      });
    };
    // Category (hidden #d-category-value). Selection is driven by the `.selected`
    // class (matching admin.js `setDealCategory`, the click handler) + CSS — not
    // inline styles, which left a stale highlight when switching. We also reset
    // every row/check to its default inline colour, so any leftover inline
    // highlight from an earlier build (e.g. a row stuck orange while unchecked)
    // is cleared; the `.selected` CSS (!important) repaints the chosen one.
    const setCategory = (cat: string | null) => {
      const hidden = document.getElementById("d-category-value") as HTMLInputElement | null;
      if (hidden) hidden.value = cat ?? "";
      const labels = Array.from(root.querySelectorAll<HTMLElement>("#d-category-group [data-cat]"));
      labels.forEach((l) => {
        l.classList.toggle("selected", !!cat && l.dataset.cat === cat);
        l.style.background = "var(--surface2)";
        const chk = l.querySelector<HTMLElement>(".deal-cat-check");
        if (chk) {
          chk.style.background = "var(--surface)";
          chk.style.borderColor = "var(--border)";
        }
      });
    };
    const setActionType = (v: string | null) => {
      const type = v ?? "direct";
      const hidden = document.getElementById("d-action-type") as HTMLInputElement | null;
      if (hidden) hidden.value = type;
      root.querySelectorAll<HTMLElement>("#d-action-type-cards .book-type-card").forEach((c) => {
        c.classList.toggle("selected", c.dataset.val === type);
      });
      // Show the matching action panel (admin.js's switchActionType toggles them).
      if (typeof w.switchActionType === "function") (w.switchActionType as (t: string) => void)(type);
      else
        ["direct", "affiliate", "leadform", "booking"].forEach((t) => {
          const el = document.getElementById(`cta-panel-${t}`);
          if (el) el.style.display = t === type ? "" : "none";
        });
    };
    // Booking payment type (deposit | full) toggle.
    const setPayType = (v: string | null) => {
      const type = v === "full" ? "full" : "deposit";
      const hidden = document.getElementById("d-pay-type") as HTMLInputElement | null;
      if (hidden) hidden.value = type;
      if (typeof w.switchBookingPayType === "function")
        (w.switchBookingPayType as (t: string) => void)(type);
    };

    // ── lead-capture form builder (#lcf-repeater, rows added by admin.js) ──
    const readLeadFields = (): LeadFormField[] => {
      const rep = document.getElementById("lcf-repeater");
      if (!rep) return [];
      return (Array.from(rep.querySelectorAll(":scope > .lcf-field-item")) as HTMLElement[])
        .map((item) => {
          const rows = item.querySelectorAll(".field-row");
          const label =
            rows[0]?.querySelector<HTMLInputElement>('input[type="text"]')?.value.trim() ?? "";
          const type = (item.querySelector<HTMLSelectElement>(".lcf-type-select")?.value ??
            "short_text") as LeadFormField["type"];
          const placeholder =
            rows[1]?.querySelector<HTMLInputElement>('input[type="text"]')?.value.trim() ?? "";
          const required = !!rows[1]?.querySelector<HTMLInputElement>('input[type="checkbox"]')
            ?.checked;
          const field: LeadFormField = { label, type, required };
          if (placeholder) field.placeholder = placeholder;
          if (type === "dropdown" || type === "radio" || type === "checkbox") {
            field.options = (
              Array.from(
                item.querySelectorAll<HTMLInputElement>('.lcf-options-list input[type="text"]')
              )
            )
              .map((i) => i.value.trim())
              .filter(Boolean);
          }
          return field;
        })
        .filter((f) => f.label);
    };

    const fillLeadFields = (fields: LeadFormField[]) => {
      const rep = document.getElementById("lcf-repeater");
      if (!rep) return;
      rep.innerHTML = "";
      const addField = w.addLCFField as (() => void) | undefined;
      const addOption = w.addLCFOption as ((btn: HTMLElement) => void) | undefined;
      if (typeof addField !== "function") return;
      (fields ?? []).forEach((f) => {
        addField();
        const item = rep.lastElementChild as HTMLElement | null;
        if (!item) return;
        const rows = item.querySelectorAll(".field-row");
        const labelInput = rows[0]?.querySelector<HTMLInputElement>('input[type="text"]');
        const typeSel = item.querySelector<HTMLSelectElement>(".lcf-type-select");
        const placeholderInput = rows[1]?.querySelector<HTMLInputElement>('input[type="text"]');
        const requiredCb = rows[1]?.querySelector<HTMLInputElement>('input[type="checkbox"]');
        if (labelInput) labelInput.value = f.label ?? "";
        if (placeholderInput) placeholderInput.value = f.placeholder ?? "";
        if (requiredCb) requiredCb.checked = f.required !== false;
        if (typeSel) {
          typeSel.value = f.type ?? "short_text";
          typeSel.dispatchEvent(new Event("change")); // reveals/hides the options block
        }
        if (Array.isArray(f.options) && f.options.length && typeof addOption === "function") {
          const block = item.querySelector<HTMLElement>(".lcf-options-block");
          const list = block?.querySelector<HTMLElement>(".lcf-options-list");
          const optBtn = block?.querySelector<HTMLElement>("button");
          if (list && optBtn) {
            list.innerHTML = ""; // drop the blank option auto-added on type change
            f.options.forEach((o) => {
              addOption(optBtn);
              const input = list.lastElementChild?.querySelector<HTMLInputElement>("input");
              if (input) input.value = o;
            });
          }
        }
      });
    };

    // ── booking Step-1 form builder (#bkf-repeater, rows added by admin.js) ──
    const readBookingFields = (): BookingFormField[] => {
      const rep = document.getElementById("bkf-repeater");
      if (!rep) return [];
      return (Array.from(rep.querySelectorAll(":scope > .bkf-field-item")) as HTMLElement[])
        .map((item) => {
          const rows = item.querySelectorAll(".field-row");
          const label =
            rows[0]?.querySelector<HTMLInputElement>('input[type="text"]')?.value.trim() ?? "";
          const type = (item.querySelector<HTMLSelectElement>(".bkf-type-select")?.value ??
            "short_text") as BookingFormField["type"];
          const placeholder =
            rows[1]?.querySelector<HTMLInputElement>('input[type="text"]')?.value.trim() ?? "";
          const required = !!rows[1]?.querySelector<HTMLInputElement>('input[type="checkbox"]')
            ?.checked;
          const field: BookingFormField = { label, type, required };
          if (placeholder) field.placeholder = placeholder;
          if (type === "dropdown" || type === "radio") {
            field.options = Array.from(
              item.querySelectorAll<HTMLInputElement>('.bkf-options-list input[type="text"]')
            )
              .map((i) => i.value.trim())
              .filter(Boolean);
          }
          return field;
        })
        .filter((f) => f.label);
    };

    const fillBookingFields = (fields: BookingFormField[]) => {
      const rep = document.getElementById("bkf-repeater");
      if (!rep) return;
      rep.innerHTML = "";
      const addField = w.addBKFField as (() => void) | undefined;
      const addOption = w.addBKFOption as ((btn: HTMLElement) => void) | undefined;
      if (typeof addField !== "function") return;
      (fields ?? []).forEach((f) => {
        addField();
        const item = rep.lastElementChild as HTMLElement | null;
        if (!item) return;
        const rows = item.querySelectorAll(".field-row");
        const labelInput = rows[0]?.querySelector<HTMLInputElement>('input[type="text"]');
        const typeSel = item.querySelector<HTMLSelectElement>(".bkf-type-select");
        const placeholderInput = rows[1]?.querySelector<HTMLInputElement>('input[type="text"]');
        const requiredCb = rows[1]?.querySelector<HTMLInputElement>('input[type="checkbox"]');
        if (labelInput) labelInput.value = f.label ?? "";
        if (placeholderInput) placeholderInput.value = f.placeholder ?? "";
        if (requiredCb) requiredCb.checked = f.required !== false;
        if (typeSel) {
          typeSel.value = f.type ?? "short_text";
          typeSel.dispatchEvent(new Event("change")); // reveals/hides the options block
        }
        if (Array.isArray(f.options) && f.options.length && typeof addOption === "function") {
          const block = item.querySelector<HTMLElement>(".bkf-options-block");
          const list = block?.querySelector<HTMLElement>(".bkf-options-list");
          const optBtn = block?.querySelector<HTMLElement>("button");
          if (list && optBtn) {
            list.innerHTML = ""; // drop the blank option auto-added on type change
            f.options.forEach((o) => {
              addOption(optBtn);
              const input = list.lastElementChild?.querySelector<HTMLInputElement>("input");
              if (input) input.value = o;
            });
          }
        }
      });
    };

    // ── images (upload before save; preview saved ones on edit) ──────────
    const fileByLabel = (text: string): HTMLInputElement | null => {
      for (const field of Array.from(root.querySelectorAll(".field"))) {
        if ((field.querySelector("label")?.textContent?.trim() ?? "").startsWith(text)) {
          const f = field.querySelector<HTMLInputElement>('input[type="file"]');
          if (f) return f;
        }
      }
      return null;
    };
    // Card thumbnail file input, found by its field label. (The editor wires its
    // live preview via React's onChange, which renders no `onchange` attribute,
    // so an attribute selector would never match.)
    const cardThumbInput = () => fileByLabel("Card Thumbnail");
    const previewImg = (input: HTMLInputElement | null, url: string | null) => {
      const box = input?.closest<HTMLElement>(".img-upload");
      if (!box) return;
      const label = box.querySelector<HTMLElement>(".img-upload-label");
      if (label && !label.dataset.orig) label.dataset.orig = label.textContent ?? "";
      if (url) {
        box.style.backgroundImage = `url(${url})`;
        box.style.backgroundSize = "cover";
        box.style.backgroundPosition = "center";
        box.style.minHeight = "120px";
        if (label) label.textContent = "Image set — click to replace";
      } else {
        box.style.backgroundImage = "";
        if (label) label.textContent = label.dataset.orig ?? label.textContent ?? "";
      }
    };
    const uploadFile = async (file: File): Promise<string | null> => {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/admin/quests/upload", { method: "POST", body: fd });
        const data = (await res.json().catch(() => ({}))) as { url?: string };
        return res.ok ? data.url ?? null : null;
      } catch {
        return null;
      }
    };

    const setSelectOptions = (id: string, options: { value: string; label: string }[], allLabel: string) => {
      const sel = document.getElementById(id) as HTMLSelectElement | null;
      if (!sel) return;
      const current = sel.value;
      sel.innerHTML = [
        `<option value="">${esc(allLabel)}</option>`,
        ...options.map((opt) => `<option value="${esc(opt.value)}">${esc(opt.label)}</option>`),
      ].join("");
      if (current) sel.value = current;
    };

    const regenQuestFilters = () => {
      setSelectOptions(
        "dq-filter-location",
        taxonomies.countries.map((t) => ({ value: t.slug, label: t.name })),
        "All Countries"
      );
      setSelectOptions(
        "dq-filter-type",
        taxonomies.categories.map((t) => ({ value: t.slug, label: t.name })),
        "All Categories"
      );
    };

    // ── connected-quests selector (override admin.js hardcoded version) ───
    const selected = new Set<string>();
    type W = Window & Record<string, unknown>;
    const w = window as unknown as W;
    const filtered = () => {
      const loc = (document.getElementById("dq-filter-location") as HTMLSelectElement | null)?.value || "";
      const typ = (document.getElementById("dq-filter-type") as HTMLSelectElement | null)?.value || "";
      return quests.filter((q) => (!loc || q.countrySlug === loc) && (!typ || q.categorySlug === typ));
    };
    // Toggle / remove via direct listeners (below) — independent of admin.js's
    // window globals, which it re-renders on every nav('deals-edit').
    const toggleQuest = (qid: string) => {
      if (!qid || !quests.some((q) => q.id === qid)) return;
      if (selected.has(qid)) selected.delete(qid);
      else selected.add(qid);
      renderAllQuests();
    };
    const removeChip = (id: string) => {
      selected.delete(id);
      renderAllQuests();
    };
    const renderSelector = () => {
      const group = document.getElementById("d-quests-group");
      const emptyEl = document.getElementById("dq-empty");
      if (!group) return;
      const fq = filtered();
      if (fq.length === 0) {
        group.style.display = "none";
        if (emptyEl) emptyEl.style.display = "block";
        return;
      }
      group.style.display = "";
      if (emptyEl) emptyEl.style.display = "none";
      group.innerHTML = fq
        .map((q, i) => {
          const isLast = i === fq.length - 1;
          const sel = selected.has(q.id);
          // No text ✓ inside .quest-checkbox: the tick is supplied by CSS
          // (#d-quests-group label.selected .quest-checkbox::after). Rendering it
          // here too produced a doubled checkmark.
          return `<label data-quest="${q.id}" style="display:flex;align-items:center;gap:10px;padding:9px 14px;cursor:pointer;${isLast ? "" : "border-bottom:1px solid var(--border);"}background:${sel ? "#fef2ee" : "var(--surface2)"};transition:background .12s" class="${sel ? "selected" : ""}"><span style="width:16px;height:16px;border-radius:4px;border:2px solid ${sel ? "var(--accent)" : "var(--border)"};background:${sel ? "var(--accent)" : "var(--surface)"};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:10px;color:#fff" class="quest-checkbox"></span><span style="flex:1;min-width:0"><span style="font-size:13px;color:var(--text);display:block">${esc(q.title)}</span><span style="font-size:11px;color:var(--muted)">${esc(q.countryLabel || "—")} · ${esc(q.categoryLabel || "—")}</span></span></label>`;
        })
        .join("");
      // Click handling is delegated once to #d-quests-group (see wiring below),
      // so re-renders never stack listeners or double-fire.
    };
    const renderChips = () => {
      const c = document.getElementById("d-quests-chips");
      if (!c) return;
      c.innerHTML = [...selected]
        .map((id) => {
          const q = quests.find((x) => x.id === id);
          if (!q) return "";
          return `<span style="display:inline-flex;align-items:center;gap:5px;background:#fef2ee;border:1.5px solid rgba(232,68,10,.3);color:var(--accent);border-radius:20px;font-size:12px;font-weight:600;padding:3px 10px 3px 11px">${esc(q.title)}<button data-remove="${id}" style="background:none;border:none;cursor:pointer;color:var(--accent);font-size:15px;line-height:1;padding:0 0 0 2px;opacity:.7">×</button></span>`;
        })
        .join("");
      // Chip removal is delegated once to #d-quests-chips (see wiring below).
    };
    const updateSummary = () => {
      const s = document.getElementById("d-quests-selected");
      if (!s) return;
      const n = selected.size;
      if (n === 0) {
        s.textContent = "No quests selected — this deal won't appear on any Quest page.";
        s.style.color = "var(--muted)";
      } else {
        s.innerHTML = `<strong style="color:var(--accent)">${n} quest${n === 1 ? "" : "s"} selected</strong>`;
        s.style.color = "var(--muted2)";
      }
    };
    const renderAllQuests = () => {
      renderSelector();
      renderChips();
      updateSummary();
    };
    const installSelectorOverrides = () => {
      regenQuestFilters();
      w.renderQuestSelector = renderSelector;
      w.filterQuestSelector = renderAllQuests;
      // Clicks are handled by delegation on the containers (see wiring); make
      // admin.js's inline onclick handlers no-ops so they can't double-toggle
      // if its hardcoded rows ever flash in before our render replaces them.
      w.toggleQuestLink = () => {};
      w.removeQuestChip = () => {};
      w.selectAllFilteredQuests = () => {
        filtered().forEach((q) => selected.add(q.id));
        renderAllQuests();
      };
      w.renderQuestChips = renderChips;
      w.updateQuestsSummary = updateSummary;
    };

    // ── populate / clear ─────────────────────────────────────────────────
    const populate = (d: EditDeal) => {
      setVal("d-title", d.title);
      setVal("d-slug", d.slug);
      setCategory(d.category);
      setPh(SHORT_DESC_PH, d.short_desc ?? "");
      setPh(PARTNER_PH, d.partner_name ?? "");
      setVal("d-card-icon", d.card_icon ?? "");
      setVal("d-card-color", d.card_color ?? "");
      setRte("What this is", d.what_is ?? "");
      setRte("Who it's for", d.who_for ?? "");
      setRte("Why this is useful", d.why_useful ?? "");
      fillRepeater("req-repeater", d.requirements ?? []);
      fillRepeater("incl-repeater", d.checklist ?? []);
      setVal("d-btn-text", d.cta_label ?? "Book Now");
      setActionType(d.action_type);
      fillLeadFields(d.lead_form_fields ?? []);
      // Booking action type
      setPayType(d.pay_type ?? "deposit");
      setVal("d-total-price", d.total_price != null ? String(d.total_price) : "");
      setVal("d-deposit-amount", d.deposit_amount != null ? String(d.deposit_amount) : "");
      setVal("d-refund-policy", d.refund_policy ?? "");
      if (d.action_type === "booking") setVal("d-bk-billing-unit", d.billing_unit ?? "per_program");
      fillBookingFields(d.booking_fields ?? []);
      if (typeof w.updateBookingPreview === "function")
        (w.updateBookingPreview as () => void)();
      setVal("d-book-url", d.book_url ?? "");
      setVal("d-affiliate-url", d.affiliate_url ?? "");
      setVal("d-price-from", d.price_from != null ? String(d.price_from) : "");
      setVal("d-billing-unit", d.billing_unit ?? "per_month");
      setVal("d-offer-label", d.offer_label ?? "");
      setVal("d-offer-price", d.offer_price ?? "");
      setVal("d-outcome-text", d.outcome_text ?? "");
      setChecked("d-verified", d.verified);
      setChecked("d-featured", d.featured);
      setVal("d-cta-heading", d.cta_heading ?? "");
      setVal("d-cta-subtext", d.cta_subtext ?? "");
      setVal("d-cta-btn-text", d.cta_button_label ?? "");
      setVal("d-seo-title", d.seo_title ?? "");
      setVal("d-meta-desc", d.meta_description ?? "");
      setVal("d-canonical", d.canonical_url ?? "");
      setChecked("d-index-toggle", !d.noindex);
      setVal("d-image-alt", d.image_alt ?? "");
      setVal("d-display-order", String(d.display_order ?? 1));
      setStatusToggle(["published", "featured", "coming_soon"].includes(d.visibility));
      previewImg(fileByLabel("Featured Image"), d.featured_image_path);
      previewImg(cardThumbInput(), d.card_image_path);
      previewImg(fileByLabel("OG Image"), d.og_image_url);
      selected.clear();
      (d.questSlugs ?? []).forEach((s) => {
        const id = slugToId.get(s);
        if (id) selected.add(id);
      });
      renderAllQuests();
    };
    const clearEditor = () => {
      ["d-title", "d-slug", "d-card-icon", "d-card-color", "d-book-url", "d-affiliate-url",
        "d-price-from", "d-offer-label", "d-offer-price", "d-outcome-text", "d-cta-heading", "d-cta-subtext", "d-cta-btn-text", "d-seo-title", "d-meta-desc", "d-canonical", "d-image-alt",
      ].forEach((id) => setVal(id, ""));
      setVal("d-btn-text", "Book Now");
      setVal("d-display-order", "1");
      setCategory(null);
      setActionType("direct");
      fillLeadFields([]);
      setPayType("deposit");
      setVal("d-total-price", "");
      setVal("d-deposit-amount", "");
      setVal("d-refund-policy", "");
      setVal("d-bk-billing-unit", "per_program");
      fillBookingFields([]);
      if (typeof w.updateBookingPreview === "function") (w.updateBookingPreview as () => void)();
      setPh(SHORT_DESC_PH, "");
      setPh(PARTNER_PH, "");
      setRte("What this is", "");
      setRte("Who it's for", "");
      setRte("Why this is useful", "");
      fillRepeater("req-repeater", []);
      fillRepeater("incl-repeater", []);
      setChecked("d-verified", false);
      setChecked("d-featured", false);
      setStatusToggle(false);
      previewImg(fileByLabel("Featured Image"), null);
      previewImg(cardThumbInput(), null);
      previewImg(fileByLabel("OG Image"), null);
      selected.clear();
      renderAllQuests();
    };

    // ── save ─────────────────────────────────────────────────────────────
    const save = async (status: "published" | "draft", btn: HTMLButtonElement) => {
      const title = val("d-title");
      if (!title) {
        window.alert("Please enter a deal title.");
        return;
      }
      const orig = btn.textContent;
      btn.setAttribute("disabled", "true");
      btn.textContent = "Saving…";

      let featured_image_path = "";
      let card_image_path = "";
      let og_image_url = "";
      let uploadFailed = false;
      const tryUpload = async (file: File) => {
        const url = await uploadFile(file);
        if (!url) uploadFailed = true;
        return url ?? "";
      };
      const fFile = fileByLabel("Featured Image")?.files?.[0];
      const cFile = cardThumbInput()?.files?.[0];
      const oFile = fileByLabel("OG Image")?.files?.[0];
      if (fFile) featured_image_path = await tryUpload(fFile);
      if (cFile) card_image_path = await tryUpload(cFile);
      if (oFile) og_image_url = await tryUpload(oFile);
      if (uploadFailed) {
        window.alert("Image upload failed — make sure you're signed in and the 'quests' bucket exists. Deal NOT saved.");
        btn.removeAttribute("disabled");
        btn.textContent = orig;
        return;
      }

      const payload: Record<string, unknown> = {
        title,
        slug: val("d-slug"),
        status,
        category: (document.getElementById("d-category-value") as HTMLInputElement | null)?.value ?? "",
        short_desc: readPh(SHORT_DESC_PH),
        partner_name: readPh(PARTNER_PH),
        card_icon: val("d-card-icon"),
        card_color: val("d-card-color"),
        what_is: readRte("What this is"),
        who_for: readRte("Who it's for"),
        why_useful: readRte("Why this is useful"),
        requirements: readRepeater("req-repeater"),
        checklist: readRepeater("incl-repeater"),
        cta_label: val("d-btn-text"),
        action_type: (document.getElementById("d-action-type") as HTMLInputElement | null)?.value ?? "direct",
        book_url: val("d-book-url"),
        affiliate_url: val("d-affiliate-url"),
        lead_form_fields: readLeadFields(),
        pay_type: (document.getElementById("d-pay-type") as HTMLInputElement | null)?.value ?? "deposit",
        total_price: val("d-total-price"),
        deposit_amount: val("d-deposit-amount"),
        refund_policy: val("d-refund-policy"),
        booking_fields: readBookingFields(),
        price_from: val("d-price-from"),
        billing_unit:
          ((document.getElementById("d-action-type") as HTMLInputElement | null)?.value === "booking"
            ? val("d-bk-billing-unit")
            : val("d-billing-unit")),
        offer_label: val("d-offer-label"),
        offer_price: val("d-offer-price"),
        outcome_text: val("d-outcome-text"),
        cta_heading: val("d-cta-heading"),
        cta_subtext: val("d-cta-subtext"),
        cta_button_label: val("d-cta-btn-text"),
        verified: isChecked("d-verified"),
        featured: isChecked("d-featured"),
        seo_title: val("d-seo-title"),
        meta_description: val("d-meta-desc"),
        canonical_url: val("d-canonical") || null,
        noindex: !isChecked("d-index-toggle"),
        image_alt: val("d-image-alt") || null,
        display_order: val("d-display-order"),
        questIds: [...selected],
      };
      if (featured_image_path) payload.featured_image_path = featured_image_path;
      if (card_image_path) payload.card_image_path = card_image_path;
      if (og_image_url) payload.og_image_url = og_image_url;

      const url = currentEditId ? `/api/admin/deals/${currentEditId}` : "/api/admin/deals";
      const method = currentEditId ? "PUT" : "POST";
      try {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          window.alert(data.error || "Could not save the deal.");
          btn.removeAttribute("disabled");
          btn.textContent = orig;
          return;
        }
        window.location.href = "/admin?p=deals-list";
      } catch {
        window.alert("Network error — please try again.");
        btn.removeAttribute("disabled");
        btn.textContent = orig;
      }
    };

    // ── wire buttons ─────────────────────────────────────────────────────
    const cleanups: (() => void)[] = [];
    const on = (el: Element, ev: string, h: (e: Event) => void) => {
      el.addEventListener(ev, h);
      cleanups.push(() => el.removeEventListener(ev, h));
    };

    // Connected-quests interactions are delegated to the (persistent) container
    // elements and attached exactly once — so re-renders (ours + admin.js's on
    // every nav('deals-edit')) can never stack handlers or fire a toggle twice.
    const groupEl = document.getElementById("d-quests-group");
    if (groupEl)
      on(groupEl, "click", (e) => {
        const row = (e.target as HTMLElement).closest<HTMLElement>("[data-quest]");
        if (row && groupEl.contains(row)) toggleQuest(row.dataset.quest ?? "");
      });
    const chipsEl = document.getElementById("d-quests-chips");
    if (chipsEl)
      on(chipsEl, "click", (e) => {
        const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-remove]");
        if (btn && chipsEl.contains(btn)) removeChip(btn.dataset.remove ?? "");
      });

    root.querySelectorAll("button").forEach((b) => {
      const txt = (b.textContent ?? "").trim();
      const status = txt === "Save & Publish" ? "published" : txt === "Save Draft" ? "draft" : null;
      if (!status) return;
      on(b, "click", (e) => {
        e.preventDefault();
        void save(status, b as HTMLButtonElement);
      });
    });

    list?.querySelectorAll<HTMLButtonElement>("button[data-deal-id]").forEach((b) => {
      const id = b.getAttribute("data-deal-id");
      on(b, "click", () => {
        currentEditId = id;
        const d = id ? dealById.get(id) : undefined;
        if (d) populate(d);
      });
    });

    list?.querySelectorAll<HTMLButtonElement>("button[data-deal-del]").forEach((b) => {
      const id = b.getAttribute("data-deal-del");
      on(b, "click", async (e) => {
        e.preventDefault();
        if (!id || !window.confirm("Delete this deal? This can't be undone.")) return;
        b.setAttribute("disabled", "true");
        try {
          const res = await fetch(`/api/admin/deals/${id}`, { method: "DELETE" });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            window.alert(data.error || "Could not delete the deal.");
            b.removeAttribute("disabled");
            return;
          }
          window.location.href = "/admin?p=deals-list";
        } catch {
          window.alert("Network error — please try again.");
          b.removeAttribute("disabled");
        }
      });
    });

    list?.querySelectorAll("button").forEach((b) => {
      if ((b.textContent ?? "").includes("New Deal")) {
        on(b, "click", () => {
          currentEditId = null;
          clearEditor();
        });
      }
    });

    // Show an instant preview the moment an image is picked, so it's clear the
    // selection registered before saving. (Card thumbnail previews via the
    // editor's own extPreviewCardImg onChange.)
    const wirePreview = (input: HTMLInputElement | null) => {
      if (!input) return;
      on(input, "change", () => {
        const f = input.files?.[0];
        previewImg(input, f ? URL.createObjectURL(f) : null);
      });
    };
    wirePreview(fileByLabel("Featured Image"));
    wirePreview(fileByLabel("OG Image"));

    // Override the hardcoded connected-quests selector once admin.js has loaded
    // (it declares the globals; assigning before would be clobbered).
    let tries = 0;
    const poll = window.setInterval(() => {
      tries += 1;
      if (typeof w.renderQuestSelector === "function" || tries > 40) {
        window.clearInterval(poll);
        installSelectorOverrides();
        renderAllQuests();
      }
    }, 100);
    cleanups.push(() => window.clearInterval(poll));

    return () => cleanups.forEach((fn) => fn());
  }, [deals, quests]);

  return null;
}