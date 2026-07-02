"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { Page } from "../Page";
import { Breadcrumb } from "../cards/Breadcrumb";
import { QCard, type Quest, type FrontFilters } from "../cards/QCard";
import { Pagination } from "../cards/Pagination";
import { questFilterGroups, type QuestFilterGroup } from "@/lib/site/data/quests";
import { DEFAULT_QUESTS_PAGE, type QuestsPageConfig } from "@/lib/site/data/pages";
import { useGridFilters } from "@/components/site/state/useGridFilters";
import { QUEST_FILTER_EVENT, type QuestFilterDetail } from "@/lib/site/questFilterBus";

/** The All Quests browse page: editable hero + filter sidebar + DB-driven grid.
 *  Filtering, the results count, active-filter chips and pagination are React
 *  state (ported from front.js toggleFilter / applyFilters / pagination).
 *  `filterGroups` defaults to the static set, but the server passes a version
 *  whose taxonomy-backed groups are generated from the live active terms. */
export function QuestsPage({
  quests,
  hero = DEFAULT_QUESTS_PAGE,
  filterGroups = questFilterGroups,
}: {
  quests: Quest[];
  hero?: QuestsPageConfig;
  filterGroups?: QuestFilterGroup[];
}) {
  // Pill labels keyed by `filter:value`, for the active-filter chips.
  const pillLabels = useMemo(() => {
    const m: Record<string, string> = {};
    for (const g of filterGroups) for (const p of g.pills) m[`${p.filter}:${p.value}`] = p.label;
    return m;
  }, [filterGroups]);
  const gridRef = useRef<HTMLDivElement>(null);
  const getDim = useCallback(
    (q: Quest, dim: string) => (q.filters as Record<keyof FrontFilters, string | undefined>)?.[dim as keyof FrontFilters],
    []
  );
  const { toggle, clear, isActive, active, visible, pageItems, page, setPage, totalPages, hasFilters } =
    useGridFilters(quests, getDim, { perPage: 20 });

  // Preset-filter shortcuts (hero goal pills, destination/goal reels) dispatch
  // an event; apply it as a single active filter (ports filterByOutcome/Destination).
  useEffect(() => {
    const onPreset = (e: Event) => {
      const detail = (e as CustomEvent<QuestFilterDetail>).detail;
      if (!detail) return;
      clear();
      toggle(detail.filter, detail.value);
    };
    window.addEventListener(QUEST_FILTER_EVENT, onPreset);
    return () => window.removeEventListener(QUEST_FILTER_EVENT, onPreset);
  }, [clear, toggle]);

  const go = (n: number) => {
    if (n < 1 || n > totalPages) return;
    setPage(n);
    const grid = gridRef.current;
    if (grid) {
      const rect = grid.getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + rect.top - 80, behavior: "smooth" });
    }
  };

  const count = hasFilters
    ? `${visible.length} quest${visible.length !== 1 ? "s" : ""} found`
    : `Showing all ${quests.length} quests`;

  return (
    <Page id="quests">
      <Breadcrumb trail={[{ label: "Home", page: "home" }]} current="All Quests" />

      <div
        style={{
          background: "var(--bg2)",
          borderBottom: "1px solid var(--border)",
          padding: "56px 5% 48px",
          textAlign: "center",
        }}
      >
        <div className="label">{hero.label}</div>
        <h1 className="serif-h" style={{ marginBottom: "12px" }}>
          {hero.heading}
        </h1>
        <p className="sub" style={{ maxWidth: "520px", margin: "0 auto" }}>
          {hero.subtitle}
        </p>
      </div>

      <div className="quests-layout">
        <aside className="qf-sidebar" id="qf-sidebar">
          <div className="qf-header">
            <span className="qf-title">Filters</span>
            <button className="qf-clear" id="qf-clear-btn" onClick={() => clear()}>
              Clear all
            </button>
          </div>

          {filterGroups.map((group) => (
            <div className="qf-group" key={group.label}>
              <div className="qf-group-label">{group.label}</div>
              <div className={group.grid ? "qf-pills qf-pills-grid" : "qf-pills"}>
                {group.pills.map((pill) => (
                  <button
                    className={isActive(pill.filter, pill.value) ? "qf-pill active" : "qf-pill"}
                    data-filter={pill.filter}
                    data-value={pill.value}
                    onClick={() => toggle(pill.filter, pill.value)}
                    key={`${pill.filter}-${pill.value}`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <div className="qf-main">
          <div className="qf-active-row" id="qf-active-row" style={{ display: hasFilters ? "block" : "none" }}>
            <div className="qf-active-chips" id="qf-active-chips">
              {Object.entries(active).flatMap(([dim, vals]) =>
                Array.from(vals).map((val) => (
                  <button className="qf-chip" key={`${dim}:${val}`} onClick={() => toggle(dim, val)}>
                    {pillLabels[`${dim}:${val}`] || val} <span className="qf-chip-x">✕</span>
                  </button>
                ))
              )}
            </div>
          </div>
          <div className="qf-results-bar">
            <span className="qf-count" id="qf-count">
              {count}
            </span>
          </div>

          <div className="pq-grid" id="quests-grid" ref={gridRef}>
            {pageItems.map((quest) => (
              <QCard quest={quest} key={quest.listing} />
            ))}
          </div>

          <Pagination current={page} total={totalPages} onGo={go} />

          <div className="qf-empty" id="qf-empty" style={{ display: visible.length === 0 ? "block" : "none" }}>
            <span style={{ fontSize: "44px", display: "block", marginBottom: "16px" }}>🗺️</span>
            <h3
              style={{
                fontFamily: "var(--serif)",
                fontSize: "20px",
                fontWeight: 400,
                marginBottom: "8px",
              }}
            >
              No quests match those filters
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text2)" }}>
              Try removing a filter or two — or{" "}
              <button
                onClick={() => clear()}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--orange)",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "14px",
                  padding: 0,
                }}
              >
                clear all
              </button>{" "}
              to see everything.
            </p>
          </div>
        </div>
      </div>
    </Page>
  );
}
