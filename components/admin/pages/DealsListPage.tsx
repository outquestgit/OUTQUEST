"use client";

import { useMemo, useState } from "react";
import { nav } from "@/lib/admin/runtime";
import { PUBLIC_VIS, DEAL_CAT_LABEL, DEAL_ACTION_LABEL } from "@/lib/admin/listFormat";
import { StatusPill } from "../ui/StatusPill";
import type { DealWithQuests } from "@/lib/deals";

type StatusFilter = "all" | "published" | "draft";

/**
 * Deals list (`#page-deals-list`). Toolbar + table head are the reference
 * markup; rows are live DB deals (previously `dealRows`). The Edit button keeps
 * its `data-deal-id` (DealsBridge loads the deal) plus the inline `nav` call.
 *
 * Search + status filtering hide non-matching rows via `display:none` (not
 * unmounting) so DealsBridge's `data-deal-del` bindings survive filter changes.
 */
export function DealsListPage({ deals, active = false }: { deals: DealWithQuests[]; active?: boolean }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const haystacks = useMemo(
    () =>
      new Map(
        deals.map((d) => [
          d.id,
          [d.title, d.slug, DEAL_CAT_LABEL[d.category ?? ""] ?? "", DEAL_ACTION_LABEL[d.action_type ?? ""] ?? ""]
            .join(" ")
            .toLowerCase(),
        ])
      ),
    [deals]
  );
  const matches = (d: DealWithQuests) => {
    const isPub = PUBLIC_VIS.has(d.visibility);
    if (status === "published" && !isPub) return false;
    if (status === "draft" && isPub) return false;
    const term = query.trim().toLowerCase();
    if (term && !(haystacks.get(d.id) ?? "").includes(term)) return false;
    return true;
  };
  const visibleCount = deals.filter(matches).length;
  const chip = (value: StatusFilter, label: string) => (
    <span
      className={status === value ? "filter-chip active" : "filter-chip"}
      onClick={() => setStatus(value)}
      role="button"
    >
      {label}
    </span>
  );

  return (
    <div className={active ? "page active" : "page"} id="page-deals-list" suppressHydrationWarning>
      <div className="table-wrap">
        <div className="table-toolbar">
          <input
            className="search-box"
            type="text"
            placeholder="Search deals…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {chip("all", "All")}
          {chip("published", "Published")}
          {chip("draft", "Draft")}
          <div style={{ marginLeft: "auto" }}>
            <button className="btn btn-primary" onClick={() => nav("deals-edit")}>
              ＋ New Deal
            </button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug / ID</th>
              <th>Category</th>
              <th>Status</th>
              <th>Action Type</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {deals.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ color: "var(--muted)", padding: "20px" }}>
                  No deals yet.
                </td>
              </tr>
            ) : (
              <>
              {visibleCount === 0 && (
                <tr>
                  <td colSpan={6} style={{ color: "var(--muted)", padding: "20px" }}>
                    No deals match your search or filter.
                  </td>
                </tr>
              )}
              {deals.map((d) => (
                <tr key={d.id} style={matches(d) ? undefined : { display: "none" }}>
                  <td>
                    <strong>{d.title}</strong>
                  </td>
                  <td>
                    <code
                      style={{
                        fontSize: "11px",
                        background: "var(--cream-2)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      {d.slug}
                    </code>
                  </td>
                  <td>{DEAL_CAT_LABEL[d.category ?? ""] ?? "—"}</td>
                  <td>
                    <StatusPill cls={PUBLIC_VIS.has(d.visibility) ? "pill-published" : "pill-draft"}>
                      {PUBLIC_VIS.has(d.visibility) ? "Published" : "Draft"}
                    </StatusPill>
                  </td>
                  <td>{DEAL_ACTION_LABEL[d.action_type ?? ""] ?? "—"}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        data-deal-id={d.id}
                        onClick={() => nav("deals-edit")}
                      >
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" data-deal-del={d.id}>
                        Del
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
