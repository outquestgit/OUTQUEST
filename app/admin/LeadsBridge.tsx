"use client";

import { useEffect } from "react";
import type { LeadRow, LeadType } from "@/lib/leads";

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  closed: "Closed",
};
const STATUS_PILL: Record<string, string> = {
  new: "pill-new",
  contacted: "pill-contacted",
  qualified: "pill-contacted",
  closed: "pill-closed",
};

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const esc = (s: string) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const csvCell = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;

const TABS: { type: LeadType; label: string }[] = [
  { type: "deal", label: "Leads" },
  { type: "contact", label: "Contact Us" },
  { type: "partner", label: "Partnership" },
];

// Per-tab column layout for the client-rendered (contact + partner) tables.
const COLS: Record<"contact" | "partner", { head: string[]; cell: (l: LeadRow) => string[] }> = {
  contact: {
    head: ["Name", "Email", "Subject", "Status", "Date"],
    cell: (l) => [
      `<strong>${esc(l.name)}</strong>`,
      `<span style="color:var(--muted)">${esc(l.email ?? "—")}</span>`,
      esc(l.subject || "—"),
    ],
  },
  partner: {
    head: ["Name", "Company", "Email", "Status", "Date"],
    cell: (l) => [
      `<strong>${esc(l.name)}</strong>`,
      esc(l.company || "—"),
      `<span style="color:var(--muted)">${esc(l.email ?? "—")}</span>`,
    ],
  },
};

const pill = (l: LeadRow) =>
  `<span class="status-pill ${STATUS_PILL[l.status] ?? "pill-new"}">${STATUS_LABEL[l.status] ?? "New"}</span>`;
const actions = (l: LeadRow) =>
  `<div class="row-actions"><button class="btn btn-ghost btn-sm" data-lead-view="${l.id}">View</button>` +
  `<button class="btn btn-danger btn-sm" data-lead-del="${l.id}">Del</button></div>`;

/** Build a client-rendered Contact/Partnership table-wrap (matches the design). */
function buildTableWrap(type: "contact" | "partner", leads: LeadRow[]): string {
  const cfg = COLS[type];
  const placeholder = type === "contact" ? "Search contact messages…" : "Search partner applications…";
  const head = `<tr>${cfg.head.map((h) => `<th>${h}</th>`).join("")}<th></th></tr>`;
  const body =
    leads.length === 0
      ? `<tr><td colspan="${cfg.head.length + 1}" style="color:var(--muted);padding:20px">No ${
          type === "contact" ? "messages" : "applications"
        } yet.</td></tr>`
      : leads
          .map((l) => {
            const cells = [...cfg.cell(l), pill(l), `<span style="color:var(--muted)">${esc(fmtDate(l.created_at))}</span>`];
            return `<tr data-lead-id="${l.id}">${cells.map((c) => `<td>${c}</td>`).join("")}<td>${actions(l)}</td></tr>`;
          })
          .join("");
  return (
    `<div class="table-wrap"><div class="table-toolbar">` +
    `<input class="search-box" type="text" placeholder="${placeholder}"/>` +
    `<span class="filter-chip active">All</span><span class="filter-chip">New</span>` +
    `<span class="filter-chip">Contacted</span><span class="filter-chip">Closed</span>` +
    `<div style="margin-left:auto;display:flex;gap:8px"><button class="btn btn-ghost">Export CSV</button></div>` +
    `</div><table><thead>${head}</thead><tbody>${body}</tbody></table></div>`
  );
}

/**
 * Drives the admin Leads dashboard: splits leads into Leads / Contact Us /
 * Partnership tabs (the latter two rendered here), opens the reference lead
 * modal with real data, updates status, deletes, and powers each tab's search
 * box, status filter chips, and Export CSV — without changing the design.
 */
export default function LeadsBridge({ leads }: { leads: LeadRow[] }) {
  useEffect(() => {
    const page = document.getElementById("page-leads");
    const modal = document.getElementById("lead-modal");
    if (!page || page.dataset.leadsWired === "1") return;
    page.dataset.leadsWired = "1";

    type W = typeof window & Record<string, unknown>;
    const w = window as W;
    const byId = new Map(leads.map((l) => [l.id, l]));
    const byType = (t: LeadType) => leads.filter((l) => (l.lead_type ?? "deal") === t);
    let openId: string | null = null;

    const cleanups: (() => void)[] = [];
    const on = (el: Element, ev: string, h: (e: Event) => void) => {
      el.addEventListener(ev, h);
      cleanups.push(() => el.removeEventListener(ev, h));
    };

    // ── Restructure into tabbed views ───────────────────────────────────────
    // Wrap the existing (server-rendered) deal table in a view container…
    const dealWrap = page.querySelector(".table-wrap");
    const views: Record<LeadType, HTMLElement> = {} as Record<LeadType, HTMLElement>;
    if (dealWrap) {
      const dealView = document.createElement("div");
      dealView.className = "lead-view";
      dealView.dataset.leadview = "deal";
      page.insertBefore(dealView, dealWrap);
      dealView.appendChild(dealWrap);
      views.deal = dealView;
    }
    // …and add Contact + Partner views.
    (["contact", "partner"] as const).forEach((type) => {
      const view = document.createElement("div");
      view.className = "lead-view";
      view.dataset.leadview = type;
      view.style.display = "none";
      view.innerHTML = buildTableWrap(type, byType(type));
      page.appendChild(view);
      views[type] = view;
    });

    // Tab bar (prepended).
    const tabBar = document.createElement("div");
    tabBar.className = "lead-tabs";
    tabBar.innerHTML = TABS.map(
      (t, i) =>
        `<button class="lead-tab${i === 0 ? " active" : ""}" data-leadtab="${t.type}">${t.label}` +
        `<span class="lead-tab-count">${byType(t.type).length}</span></button>`
    ).join("");
    page.insertBefore(tabBar, page.firstChild);

    tabBar.querySelectorAll<HTMLButtonElement>(".lead-tab").forEach((tab) => {
      on(tab, "click", () => {
        const type = tab.dataset.leadtab as LeadType;
        tabBar.querySelectorAll(".lead-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        (Object.keys(views) as LeadType[]).forEach((k) => {
          views[k].style.display = k === type ? "" : "none";
        });
      });
    });

    // ── View → open the reference modal with this lead's real data ──────────
    const openLead = (id: string) => {
      const l = byId.get(id);
      if (!l || typeof w.openLead !== "function") return;
      openId = id;
      (w.openLead as (...a: unknown[]) => void)(
        l.name,
        l.email ?? "—",
        l.source_quest || "—",
        l.source_deal || "—",
        STATUS_LABEL[l.status] ?? "New",
        fmtDate(l.created_at),
        l.answers ?? []
      );
      const sel = modal?.querySelector<HTMLSelectElement>("select");
      if (sel) sel.value = STATUS_LABEL[l.status] ?? "New";
    };

    // View + Delete are wired across the whole page (covers all three tables).
    const wireRowButtons = () => {
      page.querySelectorAll<HTMLButtonElement>("button[data-lead-view]").forEach((b) => {
        const id = b.getAttribute("data-lead-view");
        if (id) on(b, "click", () => openLead(id));
      });
      page.querySelectorAll<HTMLButtonElement>("button[data-lead-del]").forEach((b) => {
        const id = b.getAttribute("data-lead-del");
        on(b, "click", async (e) => {
          e.preventDefault();
          if (!id || !window.confirm("Delete this lead? This can't be undone.")) return;
          b.setAttribute("disabled", "true");
          try {
            const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
            if (!res.ok) {
              const out = await res.json().catch(() => ({}));
              window.alert(out.error || "Could not delete.");
              b.removeAttribute("disabled");
              return;
            }
            window.location.href = "/admin?p=leads";
          } catch {
            window.alert("Network error — please try again.");
            b.removeAttribute("disabled");
          }
        });
      });
    };
    wireRowButtons();

    // ── Update Status (shared modal) ───────────────────────────────────────
    const modalSelect = modal?.querySelector<HTMLSelectElement>("select") ?? null;
    const updateBtn = modal
      ? Array.from(modal.querySelectorAll("button")).find(
          (b) => (b.textContent ?? "").trim() === "Update Status"
        ) ?? null
      : null;
    if (updateBtn && modalSelect) {
      on(updateBtn, "click", async () => {
        if (!openId) return;
        const status = (modalSelect.value || "New").toLowerCase();
        updateBtn.setAttribute("disabled", "true");
        try {
          const res = await fetch(`/api/admin/leads/${openId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
          });
          if (!res.ok) {
            const out = await res.json().catch(() => ({}));
            window.alert(out.error || "Could not update status.");
            updateBtn.removeAttribute("disabled");
            return;
          }
          window.location.href = "/admin?p=leads";
        } catch {
          window.alert("Network error — please try again.");
          updateBtn.removeAttribute("disabled");
        }
      });
    }

    // ── Per-view search + status filter chips + Export CSV ──────────────────
    const wireToolbar = (view: HTMLElement, rows: LeadRow[], type: LeadType) => {
      const search = view.querySelector<HTMLInputElement>(".search-box");
      const chips = Array.from(view.querySelectorAll<HTMLElement>(".filter-chip"));
      let activeStatus = "all";
      const apply = () => {
        const q = (search?.value ?? "").trim().toLowerCase();
        view.querySelectorAll<HTMLTableRowElement>("tbody tr[data-lead-id]").forEach((tr) => {
          const l = byId.get(tr.getAttribute("data-lead-id") ?? "");
          if (!l) return;
          const matchStatus = activeStatus === "all" || l.status === activeStatus;
          const hay =
            `${l.name} ${l.email ?? ""} ${l.subject ?? ""} ${l.company ?? ""} ${l.source_deal ?? ""} ${l.source_quest ?? ""}`.toLowerCase();
          tr.style.display = matchStatus && (!q || hay.includes(q)) ? "" : "none";
        });
      };
      if (search) on(search, "input", apply);
      chips.forEach((chip) => {
        on(chip, "click", () => {
          chips.forEach((c) => c.classList.remove("active"));
          chip.classList.add("active");
          const txt = (chip.textContent ?? "").trim().toLowerCase();
          activeStatus = txt === "all" ? "all" : txt;
          apply();
        });
      });

      const exportBtn = Array.from(view.querySelectorAll("button")).find((b) =>
        (b.textContent ?? "").includes("Export CSV")
      );
      if (exportBtn) {
        on(exportBtn, "click", () => {
          const base =
            type === "contact"
              ? ["Name", "Email", "Subject"]
              : type === "partner"
                ? ["Name", "Company", "Email"]
                : ["Name", "Email", "Source Quest", "Source Deal"];
          const header = [...base, "Status", "Date", "Details"];
          const data = rows.map((l) => {
            const lead =
              type === "contact"
                ? [l.name, l.email ?? "", l.subject ?? ""]
                : type === "partner"
                  ? [l.name, l.company ?? "", l.email ?? ""]
                  : [l.name, l.email ?? "", l.source_quest ?? "", l.source_deal ?? ""];
            return [
              ...lead,
              STATUS_LABEL[l.status] ?? l.status,
              fmtDate(l.created_at),
              (l.answers ?? []).map(([q, a]) => `${q}: ${a}`).join(" | "),
            ];
          });
          const csv = [header, ...data].map((r) => r.map(csvCell).join(",")).join("\r\n");
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${type}-leads-${new Date().toISOString().slice(0, 10)}.csv`;
          a.click();
          URL.revokeObjectURL(url);
        });
      }
    };

    (Object.keys(views) as LeadType[]).forEach((type) => wireToolbar(views[type], byType(type), type));

    return () => {
      cleanups.forEach((fn) => fn());
      // Fully reverse the DOM restructuring (so a Strict-Mode remount re-runs cleanly).
      if (views.deal && dealWrap) {
        page.insertBefore(dealWrap, views.deal);
        views.deal.remove();
      }
      views.contact?.remove();
      views.partner?.remove();
      tabBar.remove();
      delete page.dataset.leadsWired;
    };
  }, [leads]);

  return null;
}
