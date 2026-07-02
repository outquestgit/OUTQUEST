"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Page } from "../Page";
import { Breadcrumb } from "../cards/Breadcrumb";
import { SlimQCard } from "../cards/SlimQCard";
import { Pagination } from "../cards/Pagination";
import { categoryFilterGroups, type CatFilterGroup } from "@/lib/site/data/categoryFilters";
import type { CategoryPageData } from "@/lib/site/data/categoryPages";
import { useGridFilters } from "@/components/site/state/useGridFilters";
import { normalizeSlimData } from "@/lib/site/categoryNormalize";

/**
 * Shared layout for the category pages: breadcrumb, header, filter sidebar and
 * the quest grid. Two filter-sidebar variants exist (passed in). Filtering is
 * single-select per dimension (ported from front.js toggleCatFilter), with the
 * results count, empty state and pagination as React state.
 */
export function CategoryPage({
  data,
  filterGroups = categoryFilterGroups,
  active = false,
}: {
  data: CategoryPageData;
  filterGroups?: CatFilterGroup[];
  active?: boolean;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  // The grid's count starts at the (sometimes hard-coded) initial value and only
  // switches to the live computed total once the user touches a filter — exactly
  // as the runtime did (it didn't run applyCatFilters until an interaction).
  const [touched, setTouched] = useState(false);

  // Fill in any missing filter dimensions per card, so the sidebar matches.
  const items = useMemo(
    () =>
      data.quests.map((q) => ({
        q,
        data: normalizeSlimData(q.data, q.title, q.meta, q.badge, data.id),
      })),
    [data.quests, data.id]
  );
  const getDim = useCallback((it: { data: Record<string, string> }, dim: string) => it.data[dim], []);
  const { toggle, clear, isActive, visible, pageItems, page, setPage, totalPages, hasFilters } =
    useGridFilters(items, getDim, { singleSelectPerDim: true });

  const onToggle = (filter: string, value: string) => {
    setTouched(true);
    toggle(filter, value);
  };
  const onClear = () => {
    setTouched(true);
    clear();
  };
  const go = (n: number) => {
    if (n < 1 || n > totalPages) return;
    setPage(n);
    const grid = gridRef.current;
    if (grid) {
      const rect = grid.getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + rect.top - 80, behavior: "smooth" });
    }
  };

  const total = data.quests.length;
  const count = !touched
    ? `Showing all ${data.count ?? total} quests`
    : hasFilters
      ? `Showing ${visible.length} of ${total} quests`
      : `Showing all ${total} quests`;

  return (
    <Page id={data.id} active={active}>
      <Breadcrumb
        trail={[
          { label: "Home", page: "home" },
          { label: "Quests", page: "quests" },
        ]}
        current={data.current}
      />
      <div className="cat-page-header">
        <div className="label">{data.label}</div>
        <h1 className="serif-h" style={{ marginBottom: "14px" }}>
          {data.title}
        </h1>
        <p className="sub" style={{ maxWidth: "620px" }}>
          {data.sub}
        </p>
      </div>
      <div className="cat-quests-layout">
        <aside className="cat-qf-sidebar">
          <div className="qf-header">
            <span className="qf-title">Filters</span>
            <button className="qf-clear" onClick={onClear}>
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
                    data-catpage={data.id}
                    data-filter={pill.filter}
                    data-value={pill.value}
                    onClick={() => onToggle(pill.filter, pill.value)}
                    key={`${pill.filter}-${pill.value}`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>
        <div className="cat-qf-main">
          <div className="qf-results-bar">
            <span className="qf-count" id={`${data.id}-count`}>
              {count}
            </span>
          </div>
          <div className="slim-qcard-grid" id={`${data.id}-grid`} ref={gridRef}>
            {pageItems.map((it, i) => (
              <SlimQCard quest={it.q} key={i} />
            ))}
          </div>
          <Pagination current={page} total={totalPages} onGo={go} />
          <div className="qf-empty" id={`${data.id}-empty`} style={{ display: visible.length === 0 ? "block" : "none" }}>
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
                onClick={onClear}
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
