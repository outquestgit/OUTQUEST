"use client";

import { Button } from "./Button";

/**
 * The home page's repeated "section title + orange action button" header row
 * (Explore by Destination / Explore by Goals / The Journal). Markup and inline
 * styles match the original inline blocks exactly; `marginBottom` is a prop only
 * because the Journal header used `0` while the reels used `32px`. When `onAction`
 * is omitted the button renders with no handler, as the Journal header did.
 */
export function SectionHeader({
  title,
  actionLabel,
  onAction,
  marginBottom = "32px",
}: {
  title: string;
  actionLabel: string;
  onAction?: () => void;
  marginBottom?: string | number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom,
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      <h2 className="serif-h home-section-title">{title}</h2>
      <Button style={{ fontSize: "13px", padding: "9px 18px" }} onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}
