"use client";

/**
 * Quest-grid pagination control, ported from front.js `buildPaginationHTML`.
 * Same markup (`.pagination` / `.pg-btn` / `.pg-ellipsis`) and the same
 * truncation rule (ellipsis when >7 pages and the page is far from current).
 */
export function Pagination({
  current,
  total,
  onGo,
}: {
  current: number;
  total: number;
  onGo: (n: number) => void;
}) {
  if (total <= 1) return null;

  const items: (number | "…")[] = [];
  for (let i = 1; i <= total; i++) {
    if (total > 7 && i > 2 && i < total - 1 && Math.abs(i - current) > 1) {
      if (i === 3 || i === total - 2) items.push("…");
      continue;
    }
    items.push(i);
  }

  return (
    <div className="pagination">
      <button className="pg-btn" onClick={() => onGo(current - 1)} disabled={current === 1}>
        ←
      </button>
      {items.map((n, idx) =>
        n === "…" ? (
          <span className="pg-ellipsis" key={`e${idx}`}>
            …
          </span>
        ) : (
          <button
            className={n === current ? "pg-btn active" : "pg-btn"}
            key={n}
            onClick={() => onGo(n)}
          >
            {n}
          </button>
        )
      )}
      <button className="pg-btn" onClick={() => onGo(current + 1)} disabled={current === total}>
        →
      </button>
    </div>
  );
}
