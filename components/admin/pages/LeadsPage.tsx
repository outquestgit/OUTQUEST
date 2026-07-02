"use client";

import { LEAD_PILL, leadDate } from "@/lib/admin/listFormat";
import { StatusPill } from "../ui/StatusPill";
import type { LeadRow } from "@/lib/leads";

/**
 * Leads list (`#page-leads`). Toolbar + table head are the reference markup;
 * rows are live DB leads (previously `leadRows`). `LeadsBridge` wires the View
 * button, status updates, search/filter and CSV by the `data-lead-*` attrs +
 * the `#lead-modal` (which stays as raw markup, a sibling after this section).
 */
export function LeadsPage({ leads, active = false }: { leads: LeadRow[]; active?: boolean }) {
  return (
    <div className={active ? "page active" : "page"} id="page-leads" suppressHydrationWarning>
      <div className="table-wrap">
        <div className="table-toolbar">
          <input className="search-box" type="text" placeholder="Search leads…" />
          <span className="filter-chip active">All</span>
          <span className="filter-chip">New</span>
          <span className="filter-chip">Contacted</span>
          <span className="filter-chip">Closed</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
            <button className="btn btn-ghost">Export CSV</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Source Quest</th>
              <th>Source Deal</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ color: "var(--muted)", padding: "20px" }}>
                  No leads yet.
                </td>
              </tr>
            ) : (
              leads.map((l) => {
                const p = LEAD_PILL[l.status] ?? LEAD_PILL.new;
                return (
                  <tr key={l.id} data-lead-id={l.id}>
                    <td>
                      <strong>{l.name}</strong>
                    </td>
                    <td style={{ color: "var(--muted)" }}>{l.email ?? "—"}</td>
                    <td>{l.source_quest || "—"}</td>
                    <td style={{ color: "var(--muted)" }}>{l.source_deal || "—"}</td>
                    <td>
                      <StatusPill cls={p.cls}>{p.label}</StatusPill>
                    </td>
                    <td style={{ color: "var(--muted)" }}>{leadDate(l.created_at)}</td>
                    <td>
                      <div className="row-actions">
                        <button className="btn btn-ghost btn-sm" data-lead-view={l.id}>
                          View
                        </button>
                        <button className="btn btn-danger btn-sm" data-lead-del={l.id}>
                          Del
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
