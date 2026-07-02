"use client";

import { nav } from "@/lib/admin/runtime";

export interface DashStats {
  quests: number;
  deals: number;
  leads: number;
  questsThisMonth: number;
  dealsThisMonth: number;
  leadsToday: number;
}
export interface DashItem {
  name: string;
  meta: string;
  time: string;
  color: string;
}

/**
 * Dashboard (`#page-dashboard`). Same markup as the reference; the stat values,
 * Recent Leads, and Recent Updates are now live data passed from the server
 * (computed in `app/admin/page.tsx`). UI is byte-identical to the static version.
 */
export function DashboardPage({
  stats,
  recentLeads,
  recentUpdates,
  active = true,
}: {
  stats: DashStats;
  recentLeads: DashItem[];
  recentUpdates: DashItem[];
  /** Render as the initially-active section (server-set from `?p=`). */
  active?: boolean;
}) {
  const rows = (items: DashItem[], empty: string) =>
    items.length ? (
      items.map((it, i) => (
        <div className="recent-item" key={i}>
          <div className="recent-dot" style={{ background: it.color }}></div>
          <div className="recent-info">
            <div className="recent-name">{it.name}</div>
            <div className="recent-meta">{it.meta}</div>
          </div>
          <span className="recent-time">{it.time}</span>
        </div>
      ))
    ) : (
      <div className="recent-item">
        <div className="recent-info">
          <div className="recent-meta">{empty}</div>
        </div>
      </div>
    );

  return (
    <div className={active ? "page active" : "page"} id="page-dashboard" suppressHydrationWarning>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Quests</div>
          <div className="stat-value" style={{ color: "var(--accent)" }}>
            {stats.quests}
          </div>
          <div className="stat-sub">↑ {stats.questsThisMonth} this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Deals</div>
          <div className="stat-value" style={{ color: "var(--accent2)" }}>
            {stats.deals}
          </div>
          <div className="stat-sub">↑ {stats.dealsThisMonth} this month</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Leads</div>
          <div className="stat-value" style={{ color: "var(--accent)" }}>
            {stats.leads}
          </div>
          <div className="stat-sub">{stats.leadsToday} new today</div>
        </div>
      </div>
      <div className="quick-actions">
        <button className="btn btn-primary" onClick={() => nav("quests-edit")}>
          ＋ New Quest
        </button>
        <button className="btn btn-ghost" onClick={() => nav("deals-edit")}>
          ＋ New Deal
        </button>
        <button className="btn btn-ghost" onClick={() => nav("journal-edit")}>
          ＋ New Journal Post
        </button>
      </div>
      <div className="two-col">
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Recent Leads</span>
            <button className="btn btn-ghost btn-sm" onClick={() => nav("leads")}>
              View All
            </button>
          </div>
          <div style={{ padding: "0 18px" }}>{rows(recentLeads, "No recent leads yet.")}</div>
        </div>
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Recent Updates</span>
          </div>
          <div style={{ padding: "0 18px" }}>{rows(recentUpdates, "No recent updates yet.")}</div>
        </div>
      </div>
    </div>
  );
}
