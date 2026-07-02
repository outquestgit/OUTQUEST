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
 *
 * A card matches when, for every active dimension, its value is in that
 * dimension's selected set (a card missing the dimension is hidden — same as the
 * runtime). Changing a filter resets to page 1.
 */
export type ActiveFilters = Record<string, Set<string>>;

const PER_PAGE = 24;

export function useGridFilters<T>(
  items: T[],
  getDim: (item: T, dim: string) => string | undefined,
  options?: { singleSelectPerDim?: boolean; perPage?: number }
) {
  const singleSelect = options?.singleSelectPerDim ?? false;
  const perPage = options?.perPage ?? PER_PAGE;

  const [active, setActive] = useState<ActiveFilters>({});
  const [page, setPage] = useState(1);

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
    [singleSelect]
  );

  const clear = useCallback(() => {
    setActive({});
    setPage(1);
  }, []);

  const isActive = useCallback((dim: string, value: string) => !!active[dim]?.has(value), [active]);

  const visible = useMemo(
    () =>
      items.filter((it) =>
        Object.entries(active).every(([dim, vals]) => {
          if (vals.size === 0) return true;
          const cv = getDim(it, dim);
          return !!cv && vals.has(cv);
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
