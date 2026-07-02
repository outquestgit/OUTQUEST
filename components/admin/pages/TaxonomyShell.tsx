/**
 * A taxonomy page (`#page-tax-<kind>`) — an empty shell the `TaxonomyBridge`
 * fills at runtime (it renders the DB-driven table into `#tax-<kind>-inner`).
 * Both ids are preserved exactly so the bridge keeps working.
 */
export function TaxonomyShell({ kind }: { kind: string }) {
  return (
    <div className="page" id={`page-tax-${kind}`} suppressHydrationWarning>
      <div id={`tax-${kind}-inner`}></div>
    </div>
  );
}
