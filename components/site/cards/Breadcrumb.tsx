"use client";

import { Fragment } from "react";
import { showPage } from "@/lib/site/runtime";

/**
 * `.bc-nav` breadcrumb: a trail of clickable crumbs (each routing via
 * `showPage`) followed by the non-clickable current page, separated by `›`.
 */
export function Breadcrumb({
  trail,
  current,
}: {
  trail: { label: string; page: string }[];
  current: string;
}) {
  return (
    <nav className="bc-nav">
      {trail.map((crumb) => (
        <Fragment key={crumb.page}>
          <span onClick={() => showPage(crumb.page)}>{crumb.label}</span>
          <span className="bc-sep">›</span>
        </Fragment>
      ))}
      <span className="bc-current">{current}</span>
    </nav>
  );
}
