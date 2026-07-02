"use client";

import { useMemo, useState } from "react";
import { nav } from "@/lib/admin/runtime";
import { PUBLIC_VIS, termsOf } from "@/lib/admin/listFormat";
import { StatusPill } from "../ui/StatusPill";
import type { QuestWithTerms } from "@/lib/quests";

type StatusFilter = "all" | "published" | "draft";

/**
 * Quests list (`#page-quests-list`). Toolbar + table head are the reference
 * markup; rows are live DB quests (previously injected as HTML by
 * `app/admin/page.tsx`'s `questRows`). The Edit button keeps its `data-quest-id`
 * (QuestEditorBridge loads the quest from it) plus the inline `nav` call.
 *
 * Search + status filtering hide non-matching rows via `display:none` (rather
 * than unmounting them) so the bridges' delete-button bindings — wired once on
 * mount by `data-quest-del` — keep working as the filter changes.
 */
export function QuestsListPage({ quests, active = false }: { quests: QuestWithTerms[]; active?: boolean }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  // Searchable haystack per quest (title + the visible taxonomy columns).
  const haystacks = useMemo(
    () =>
      new Map(
        quests.map((q) => [
          q.id,
          [q.title, termsOf(q, "category"), termsOf(q, "country"), termsOf(q, "life_direction"), termsOf(q, "outcome_goal"), termsOf(q, "difficulty")]
            .join(" ")
            .toLowerCase(),
        ])
      ),
    [quests]
  );
  const matches = (q: QuestWithTerms) => {
    const isPub = PUBLIC_VIS.has(q.visibility);
    if (status === "published" && !isPub) return false;
    if (status === "draft" && isPub) return false;
    const term = query.trim().toLowerCase();
    if (term && !(haystacks.get(q.id) ?? "").includes(term)) return false;
    return true;
  };
  const visibleCount = quests.filter(matches).length;
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
    <div className={active ? "page active" : "page"} id="page-quests-list" suppressHydrationWarning>
      <div className="table-wrap">
        <div className="table-toolbar">
          <input
            className="search-box"
            type="text"
            placeholder="Search quests…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {chip("all", "All")}
          {chip("published", "Published")}
          {chip("draft", "Draft")}
          <div style={{ marginLeft: "auto" }}>
            <button className="btn btn-primary" onClick={() => nav("quests-edit")}>
              ＋ New Quest
            </button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Country</th>
              <th>Life Direction</th>
              <th>Outcome Goal</th>
              <th>Difficulty</th>
              <th>Status</th>
              <th>Updated</th>
              <th>Action</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {quests.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ color: "var(--muted)", padding: "20px" }}>
                  No quests yet.
                </td>
              </tr>
            ) : (
              <>
              {visibleCount === 0 && (
                <tr>
                  <td colSpan={9} style={{ color: "var(--muted)", padding: "20px" }}>
                    No quests match your search or filter.
                  </td>
                </tr>
              )}
              {quests.map((q) => (
                <tr key={q.id} style={matches(q) ? undefined : { display: "none" }}>
                  <td>
                    <strong>{q.title}</strong>
                  </td>
                  <td>{termsOf(q, "category")}</td>
                  <td>{termsOf(q, "country")}</td>
                  <td>{termsOf(q, "life_direction")}</td>
                  <td>{termsOf(q, "outcome_goal")}</td>
                  <td>{termsOf(q, "difficulty")}</td>
                  <td>
                    <StatusPill cls={PUBLIC_VIS.has(q.visibility) ? "pill-published" : "pill-draft"}>
                      {q.visibility}
                    </StatusPill>
                  </td>
                  <td style={{ color: "var(--muted)" }}>
                    {new Date(q.updated_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        data-quest-id={q.id}
                        onClick={() => nav("quests-edit")}
                      >
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" data-quest-del={q.id}>
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
