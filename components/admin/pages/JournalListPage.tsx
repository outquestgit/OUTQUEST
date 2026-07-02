"use client";

import { useMemo, useState } from "react";
import { nav } from "@/lib/admin/runtime";
import { PUBLIC_VIS } from "@/lib/admin/listFormat";
import { StatusPill } from "../ui/StatusPill";
import type { JournalPost } from "@/lib/journal";

type StatusFilter = "all" | "published" | "draft";

/**
 * Journal list (`#page-journal-list`). Toolbar + table head are the reference
 * markup; rows are live DB posts (previously `journalRows`). The Edit button
 * keeps its `data-journal-id` (JournalBridge loads the post) + inline `nav`.
 */
export function JournalListPage({ posts, now, active = false }: { posts: JournalPost[]; now: number; active?: boolean }) {
  // A post is "scheduled" when it's set to publish (visibility public) but its
  // future `scheduled_at` hasn't arrived yet — the public site holds it back
  // until then (see lib/journal `getPublishedJournalPosts`). `now` is passed from
  // the server so SSR and hydration agree on the comparison.
  const isScheduled = (p: JournalPost) =>
    !!p.scheduled_at && PUBLIC_VIS.has(p.visibility) && new Date(p.scheduled_at).getTime() > now;
  // Show the schedule as the wall-clock time in the zone it was set in (`tz`,
  // minutes east of UTC), so it reads the same as the author entered — not
  // re-cast into whoever's viewing the list. Falls back to the viewer's zone.
  const fmtSchedule = (iso: string, tz: number | null) => {
    const ms = new Date(iso).getTime();
    if (tz == null) {
      return new Date(ms).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    const time = new Date(ms + tz * 60000).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
    const ah = Math.floor(Math.abs(tz) / 60);
    const am = Math.abs(tz) % 60;
    const tzLabel = `UTC${tz >= 0 ? "+" : "-"}${ah}${am ? ":" + String(am).padStart(2, "0") : ""}`;
    return `${time} ${tzLabel}`;
  };

  // Search + status filtering hide non-matching rows via `display:none` (not
  // unmounting) so JournalBridge's `data-journal-del` bindings survive changes.
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const haystacks = useMemo(
    () => new Map(posts.map((p) => [p.id, [p.title, p.category ?? ""].join(" ").toLowerCase()])),
    [posts]
  );
  const matches = (p: JournalPost) => {
    const isPub = PUBLIC_VIS.has(p.visibility);
    if (status === "published" && !isPub) return false;
    if (status === "draft" && isPub) return false;
    const term = query.trim().toLowerCase();
    if (term && !(haystacks.get(p.id) ?? "").includes(term)) return false;
    return true;
  };
  const visibleCount = posts.filter(matches).length;
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
    <div className={active ? "page active" : "page"} id="page-journal-list" suppressHydrationWarning>
      <div className="table-wrap">
        <div className="table-toolbar">
          <input
            className="search-box"
            type="text"
            placeholder="Search posts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {chip("all", "All")}
          {chip("published", "Published")}
          {chip("draft", "Draft")}
          <div style={{ marginLeft: "auto" }}>
            <button className="btn btn-primary" onClick={() => nav("journal-edit")}>
              ＋ New Post
            </button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Published</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ color: "var(--muted)", padding: "20px" }}>
                  No posts yet.
                </td>
              </tr>
            ) : (
              <>
              {visibleCount === 0 && (
                <tr>
                  <td colSpan={5} style={{ color: "var(--muted)", padding: "20px" }}>
                    No posts match your search or filter.
                  </td>
                </tr>
              )}
              {posts.map((p) => (
                <tr key={p.id} style={matches(p) ? undefined : { display: "none" }}>
                  <td>
                    <strong>{p.title}</strong>
                  </td>
                  <td>{p.category ?? "—"}</td>
                  <td>
                    {isScheduled(p) ? (
                      <StatusPill cls="pill-scheduled">Scheduled</StatusPill>
                    ) : (
                      <StatusPill cls={PUBLIC_VIS.has(p.visibility) ? "pill-published" : "pill-draft"}>
                        {PUBLIC_VIS.has(p.visibility) ? "Published" : "Draft"}
                      </StatusPill>
                    )}
                  </td>
                  <td style={{ color: "var(--muted)" }}>
                    {isScheduled(p)
                      ? `🕓 ${fmtSchedule(p.scheduled_at!, p.scheduled_tz)}`
                      : p.published_at
                      ? new Date(p.published_at).toLocaleDateString()
                      : p.date_label || "—"}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        data-journal-id={p.id}
                        onClick={() => nav("journal-edit")}
                      >
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" data-journal-del={p.id}>
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
