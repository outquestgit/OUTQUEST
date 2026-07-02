"use client";

import { useEffect } from "react";

export type TaxTerm = {
  id: string;
  kind: string;
  slug: string;
  name: string;
  active: boolean;
  sort_order: number;
};

type TaxDef = { key: string; kind: string; label: string; prefix: string | null; hint?: string };

const HINT_COUNTRY =
  "Each country automatically becomes a page at <code>/locations/[slug]</code> that lists every quest tagged with it. No manual page needed.";
const HINT_OUTCOME =
  "Each outcome goal automatically becomes a page at <code>/outcomes/[slug]</code> that lists every quest tagged with it. No manual page needed.";

// tax page key (admin-body container ids use these) ↔ DB kind.
const TAXES: TaxDef[] = [
  { key: "tax-category", kind: "category", label: "Category", prefix: null },
  { key: "tax-country", kind: "country", label: "Country", prefix: "/locations/", hint: HINT_COUNTRY },
  { key: "tax-budget", kind: "budget", label: "Budget", prefix: null },
  { key: "tax-duration", kind: "duration", label: "Duration", prefix: null },
  { key: "tax-difficulty", kind: "difficulty", label: "Effort", prefix: null },
  { key: "tax-delivery", kind: "delivery", label: "Delivery Mode", prefix: null },
  { key: "tax-life-direction", kind: "life_direction", label: "Life Direction", prefix: null },
  { key: "tax-outcome-goal", kind: "outcome_goal", label: "Outcome Goal", prefix: "/outcomes/", hint: HINT_OUTCOME },
  { key: "tax-journal-cat", kind: "journal_category", label: "Journal Category", prefix: null },
];

const escHtml = (s: string) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const slugifyClient = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/**
 * Makes the reference admin's Taxonomies section work against the database —
 * WITHOUT changing the design. After admin.js has filled each `#{key}-inner`
 * from its static `TAX_DATA`, this re-renders those tables from the DB using
 * byte-identical markup (term ids passed via `this`/data-attrs, not inlined),
 * and overrides the global `openTaxEdit` / `saveTaxRow` / `deleteTaxRow`
 * functions to persist + re-render. `closeTaxEdit` / `autoTaxSlug` /
 * `filterTaxRows` (pure DOM helpers) are left to admin.js.
 */
export default function TaxonomyBridge({ taxonomy }: { taxonomy: Record<string, TaxTerm[]> }) {
  useEffect(() => {
    type W = typeof window & Record<string, unknown>;
    const w = window as W;

    // Local, mutable working copy keyed by kind.
    const data: Record<string, TaxTerm[]> = {};
    TAXES.forEach((d) => {
      data[d.kind] = (taxonomy[d.kind] ?? []).slice().sort((a, b) => a.sort_order - b.sort_order);
    });
    const currentEdit: Record<string, string | null> = {};

    // Tell other admin sections (e.g. the Quest editor's term chips + Country/
    // Category selects, the Quiz Builder's answer-filter dropdowns) that the
    // taxonomy changed, so added / renamed / removed terms show up immediately —
    // no full page reload. Carries the live flat term list (`{ id, kind, slug,
    // name }`); `slug` is used by the Quiz Builder filter values, while the chip
    // sections read only `{ id, kind, name }` (extra fields are ignored).
    const broadcastTaxonomy = () => {
      const flat: { id: string; kind: string; slug: string; name: string }[] = [];
      TAXES.forEach((d) =>
        (data[d.kind] ?? []).forEach((t) => flat.push({ id: t.id, kind: d.kind, slug: t.slug, name: t.name }))
      );
      window.dispatchEvent(new CustomEvent("admin:taxonomy-changed", { detail: flat }));
    };

    const renderTable = (def: TaxDef): string => {
      const list = data[def.kind] ?? [];
      const dyn = def.prefix;
      const dynBanner = dyn
        ? `<div style="margin-bottom:0;padding:10px 16px;background:rgba(74,108,247,.06);border-bottom:1px solid rgba(74,108,247,.15);display:flex;align-items:flex-start;gap:9px;font-size:12px;color:var(--muted2);line-height:1.5"><span style="font-size:15px;flex-shrink:0">🔗</span><span>💡 <strong style="color:var(--accent3)">Dynamic landing pages</strong> — ${def.hint} Tag quests correctly and the pages populate automatically.</span></div>`
        : "";
      const slugCol = dyn ? `<th>Slug</th><th>Landing Page URL</th>` : `<th>Slug</th>`;
      const rows = list
        .map((t) => {
          const slugCell = dyn
            ? `<td style="color:var(--muted);font-size:12.5px">${escHtml(t.slug)}</td><td><a href="#" style="color:var(--accent3);font-size:12px;text-decoration:none;display:inline-flex;align-items:center;gap:4px" title="Preview">${dyn}${escHtml(t.slug)}<span style="font-size:10px;opacity:.6">↗</span></a></td>`
            : `<td style="color:var(--muted);font-size:12.5px">${escHtml(t.slug)}</td>`;
          const status = t.active
            ? '<span class="status-pill pill-published">Active</span>'
            : '<span class="status-pill pill-draft">Inactive</span>';
          return `<tr class="drag-row" draggable="true" data-id="${t.id}"><td><span class="tax-drag-handle" title="Drag to reorder">⠿</span></td><td><strong>${escHtml(t.name)}</strong></td>${slugCell}<td>${status}</td><td><div class="row-actions"><button class="btn btn-ghost btn-sm" data-id="${t.id}" data-name="${escHtml(t.name)}" data-slug="${escHtml(t.slug)}" onclick="openTaxEdit('${def.key}',this)">Edit</button><button class="btn btn-danger btn-sm" data-id="${t.id}" onclick="deleteTaxRow(this)">Del</button></div></td></tr>`;
        })
        .join("");
      const p0 = list[0];
      return (
        `<div class="table-wrap">${dynBanner}<div class="table-toolbar"><input class="search-box" type="text" placeholder="Search ${def.label.toLowerCase()}…" oninput="filterTaxRows(this)"/><div style="margin-left:auto"><button class="btn btn-primary" onclick="openTaxEdit('${def.key}')">＋ Add New</button></div></div><table><thead><tr><th style="width:30px"></th><th>Name</th>${slugCol}<th>Status</th><th></th></tr></thead><tbody id="tax-tbody-${def.key}">${rows}</tbody></table></div>` +
        `\n  <div id="tax-edit-modal-${def.key}" style="display:none;margin-top:14px">` +
        `<div class="section-card"><div class="section-card-header" id="tax-edit-modal-${def.key}-hdr">Add ${def.label}</div>` +
        `<div class="section-card-body"><div class="field-row">` +
        `<div class="field"><label>Name</label><input type="text" id="tax-edit-name-${def.key}" placeholder="e.g. ${p0 ? escHtml(p0.name) : "Name"}" oninput="autoTaxSlug('${def.key}')"/></div>` +
        `<div class="field"><label>Slug</label><div class="slug-wrap"><span class="slug-prefix">${dyn ?? "/"}</span><input type="text" id="tax-edit-slug-${def.key}" placeholder="${p0 ? escHtml(p0.slug) : "slug"}"/></div>${dyn ? `<div class="field-hint" style="margin-top:4px">Page will be live at <strong>${dyn}</strong>[slug]</div>` : ""}</div>` +
        `</div><div style="display:flex;gap:8px;margin-top:4px">` +
        `<button class="btn btn-primary btn-sm" onclick="saveTaxRow('${def.key}')">Save</button>` +
        `<button class="btn btn-ghost btn-sm" onclick="closeTaxEdit('${def.key}')">Cancel</button>` +
        `</div></div></div></div>`
      );
    };

    const rerender = (def: TaxDef) => {
      const el = document.getElementById(`${def.key}-inner`);
      if (el) {
        el.innerHTML = renderTable(def);
        wireDrag(def);
      }
    };
    const defByKey = (key: string) => TAXES.find((t) => t.key === key);

    // ── drag-to-reorder for the term rows ──────────────────────────────────
    // Native HTML5 drag on each `.drag-row`. On drop we read the new row order
    // straight from the DOM, sync `data[kind]`, and persist via the reorder API.
    const persistOrder = async (def: TaxDef, ids: string[]) => {
      // Reflect new order locally (so a later rerender keeps it).
      const list = data[def.kind] ?? [];
      const byId = new Map(list.map((t) => [t.id, t]));
      const reordered = ids.map((id) => byId.get(id)).filter(Boolean) as TaxTerm[];
      reordered.forEach((t, i) => (t.sort_order = i + 1));
      data[def.kind] = reordered;
      broadcastTaxonomy();
      try {
        const res = await fetch("/api/admin/taxonomy/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind: def.kind, ids }),
        });
        if (!res.ok) {
          const out = await res.json().catch(() => ({}));
          window.alert(out.error || "Could not save the new order.");
          return;
        }
        if (typeof w.showToast === "function") (w.showToast as (m: string) => void)("Order saved.");
      } catch {
        window.alert("Network error — order not saved.");
      }
    };

    const wireDrag = (def: TaxDef) => {
      const tbody = document.getElementById(`tax-tbody-${def.key}`);
      if (!tbody) return;
      let dragEl: HTMLElement | null = null;

      const rowAfter = (y: number): HTMLElement | null => {
        const rows = Array.from(
          tbody.querySelectorAll<HTMLElement>(".drag-row:not(.tax-dragging)")
        );
        for (const r of rows) {
          const box = r.getBoundingClientRect();
          if (y < box.top + box.height / 2) return r;
        }
        return null;
      };

      tbody.addEventListener("dragstart", (e) => {
        const row = (e.target as HTMLElement).closest<HTMLElement>(".drag-row");
        if (!row) return;
        dragEl = row;
        row.classList.add("tax-dragging");
        if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
      });

      tbody.addEventListener("dragover", (e) => {
        if (!dragEl) return;
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
        const after = rowAfter(e.clientY);
        if (after == null) tbody.appendChild(dragEl);
        else tbody.insertBefore(dragEl, after);
      });

      tbody.addEventListener("drop", (e) => e.preventDefault());

      tbody.addEventListener("dragend", () => {
        if (!dragEl) return;
        dragEl.classList.remove("tax-dragging");
        dragEl = null;
        const ids = Array.from(
          tbody.querySelectorAll<HTMLElement>(".drag-row")
        ).map((r) => r.dataset.id ?? "");
        void persistOrder(def, ids);
      });
    };

    // ── overridden globals (called from the reference markup's onclick) ──
    // Defined as locals and assigned to window only AFTER admin.js has loaded
    // (in run()), otherwise admin.js's own function declarations clobber them.
    const openTaxEditFn = (key: string, btn?: HTMLElement) => {
      const def = defByKey(key);
      const id = btn?.dataset.id ?? "";
      const name = btn?.dataset.name ?? "";
      const slug = btn?.dataset.slug ?? "";
      currentEdit[key] = id || null;
      const m = document.getElementById(`tax-edit-modal-${key}`);
      if (!m) return;
      const hdr = document.getElementById(`tax-edit-modal-${key}-hdr`);
      const nEl = document.getElementById(`tax-edit-name-${key}`) as HTMLInputElement | null;
      const sEl = document.getElementById(`tax-edit-slug-${key}`) as HTMLInputElement | null;
      if (hdr) hdr.textContent = (id ? "Edit " : "Add ") + (def?.label ?? "");
      if (nEl) nEl.value = name;
      if (sEl) {
        sEl.value = slug;
        sEl.dataset.edited = slug ? "1" : "";
      }
      m.style.display = "block";
      m.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    const saveTaxRowFn = async (key: string) => {
      const def = defByKey(key);
      if (!def) return;
      const nEl = document.getElementById(`tax-edit-name-${key}`) as HTMLInputElement | null;
      const sEl = document.getElementById(`tax-edit-slug-${key}`) as HTMLInputElement | null;
      const name = (nEl?.value ?? "").trim();
      let slug = (sEl?.value ?? "").trim();
      if (!name) {
        window.alert("Name is required.");
        return;
      }
      if (!slug) slug = slugifyClient(name);
      const id = currentEdit[key];
      try {
        const res = await fetch(id ? `/api/admin/taxonomy/${id}` : "/api/admin/taxonomy", {
          method: id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind: def.kind, name, slug }),
        });
        const out = await res.json().catch(() => ({}));
        if (!res.ok) {
          window.alert(out.error || "Could not save.");
          return;
        }
        const list = (data[def.kind] ??= []);
        if (id) {
          const t = list.find((x) => x.id === id);
          if (t) {
            t.name = name;
            t.slug = slug;
          }
        } else if (out.term) {
          list.push(out.term as TaxTerm);
        }
        rerender(def);
        broadcastTaxonomy();
        if (typeof w.showToast === "function") (w.showToast as (m: string) => void)(`"${name}" saved.`);
      } catch {
        window.alert("Network error — please try again.");
      }
    };

    const deleteTaxRowFn = async (btn: HTMLElement) => {
      const id = btn?.dataset.id;
      const inner = btn.closest<HTMLElement>("[id$='-inner']");
      const def = inner ? defByKey(inner.id.replace(/-inner$/, "")) : undefined;
      if (!id || !def) return;
      const nm = btn.closest("tr")?.querySelector("td strong")?.textContent ?? "this item";
      if (!window.confirm(`Delete "${nm}"? Any quests tagged with it will lose this tag.`)) return;
      try {
        const res = await fetch(`/api/admin/taxonomy/${id}`, { method: "DELETE" });
        const out = await res.json().catch(() => ({}));
        if (!res.ok) {
          window.alert(out.error || "Could not delete.");
          return;
        }
        data[def.kind] = (data[def.kind] ?? []).filter((x) => x.id !== id);
        rerender(def);
        broadcastTaxonomy();
        if (typeof w.showToast === "function") (w.showToast as (m: string) => void)("Term deleted.");
      } catch {
        window.alert("Network error — please try again.");
      }
    };

    // ── run once, after admin.js has done its initial TAX_DATA fill ──
    let done = false;
    const ready = () => {
      const el = document.getElementById("tax-category-inner");
      return !!el && el.childElementCount > 0 && typeof w.closeTaxEdit === "function";
    };
    const run = () => {
      if (done) return;
      done = true;
      // Apply overrides now — admin.js has finished loading, so its function
      // declarations won't clobber these.
      w.openTaxEdit = openTaxEditFn;
      w.saveTaxRow = saveTaxRowFn;
      w.deleteTaxRow = deleteTaxRowFn;
      TAXES.forEach(rerender);
    };
    if (ready()) run();
    const iv = window.setInterval(() => {
      if (ready()) {
        window.clearInterval(iv);
        run();
      }
    }, 50);
    const to = window.setTimeout(() => window.clearInterval(iv), 8000);

    return () => {
      window.clearInterval(iv);
      window.clearTimeout(to);
    };
  }, [taxonomy]);

  return null;
}
