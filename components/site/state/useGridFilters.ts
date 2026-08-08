"use client";

import { useCallback, useMemo, useState } from "react";

/**
 * Quest-grid filtering + pagination, ported from front.js's applyFilters /
 * applyCatFilters / pagination. Generic over the card item type.
 *
 * - `getDim(item, dim)` returns the item's value for a filter dimension.
 * - `singleSelectPerDim` matches the category pages' `toggleCatFilter` (one
 *   value per dimension, clicking the active pill clears it); the default is the
 *   All-Quests page's multi-select `toggleFilter`.
 * - `pageParam`, when given (e.g. "page"), mirrors the current page number into
 *   the URL as `?page=N` via `history.replaceState` (no extra Back-button
 *   entries) and reads it back on first mount. Without this, opening a listing
 *   from page 2 and hitting Back re-mounts this hook fresh and resets to page 1.
 *
 * A card matches when, for every active dimension, at least one of its values
 * (dims are space-joined slugs) is in that dimension's selected set — so a quest
 * tagged with several outcome goals matches any of them. A card missing the
 * dimension is hidden (same as the runtime). Changing a filter resets to page 1.
 */
export type ActiveFilters = Record<string, Set<string>>;

const PER_PAGE = 24;

function readPageFromUrl(param?: string): number {
  if (!param || typeof window === "undefined") return 1;
  const n = Number(new URLSearchParams(window.location.search).get(param));
  return n > 0 ? n : 1;
}

function writePageToUrl(param: string | undefined, page: number) {
  if (!param || typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (page > 1) url.searchParams.set(param, String(page));
  else url.searchParams.delete(param);
  window.history.replaceState(window.history.state, "", url.toString());
}

export function useGridFilters<T>(
  items: T[],
  getDim: (item: T, dim: string) => string | undefined,
  options?: { singleSelectPerDim?: boolean; perPage?: number; pageParam?: string }
) {
  const singleSelect = options?.singleSelectPerDim ?? false;
  const perPage = options?.perPage ?? PER_PAGE;
  const pageParam = options?.pageParam;

  const [active, setActive] = useState<ActiveFilters>({});
  const [page, setPageState] = useState(() => readPageFromUrl(pageParam));

  const setPage = useCallback(
    (n: number) => {
      setPageState(n);
      writePageToUrl(pageParam, n);
    },
    [pageParam]
  );

  const toggle = useCallback(
    (dim: string, value: string) => {
      setActive((prev) => {
        const next: ActiveFilters = {};
        for (const k of Object.keys(prev)) next[k] = new Set(prev[k]);
        const has = next[dim]?.has(value);
        if (singleSelect) {
          if (has) delete next[dim];
          else next[dim] = new Set([value]);
        } else {
          const set = next[dim] ?? new Set<string>();
          if (set.has(value)) {
            set.delete(value);
            if (set.size === 0) delete next[dim];
            else next[dim] = set;
          } else {
            set.add(value);
            next[dim] = set;
          }
        }
        return next;
      });
      setPage(1);
    },
    [singleSelect, setPage]
  );

  const clear = useCallback(() => {
    setActive({});
    setPage(1);
  }, [setPage]);

  const isActive = useCallback((dim: string, value: string) => !!active[dim]?.has(value), [active]);

  const visible = useMemo(
    () =>
      items.filter((it) =>
        Object.entries(active).every(([dim, vals]) => {
          if (vals.size === 0) return true;
          const cv = getDim(it, dim);
          return !!cv && cv.split(/\s+/).some((v) => vals.has(v));
        })
      ),
    [items, active, getDim]
  );

  const totalPages = Math.max(1, Math.ceil(visible.length / perPage));
  const current = Math.min(page, totalPages);
  const pageItems =
    visible.length <= perPage ? visible : visible.slice((current - 1) * perPage, current * perPage);

  return {
    active,
    toggle,
    clear,
    isActive,
    visible,
    pageItems,
    page: current,
    setPage,
    totalPages,
    hasFilters: Object.keys(active).length > 0,
  };
}
