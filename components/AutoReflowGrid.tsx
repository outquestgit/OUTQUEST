import type { ReactNode } from "react";

/**
 * Auto-reflow grid: fixed-size cards with equal spacing. Hidden items are
 * filtered out server-side (RLS + visibility), so the remaining cards reposition
 * automatically with no blank gaps and without stretching.
 */
export function AutoReflowGrid({
  children,
  empty = "Nothing here yet.",
  isEmpty = false,
}: {
  children: ReactNode;
  empty?: string;
  isEmpty?: boolean;
}) {
  if (isEmpty) {
    return <div className="dir-empty">{empty}</div>;
  }
  return <div className="dir-grid">{children}</div>;
}
