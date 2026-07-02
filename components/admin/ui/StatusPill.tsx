/**
 * Status pill used across the admin list tables. `cls` is the reference's
 * variant class (`pill-published`, `pill-draft`, `pill-new`, …) so the markup
 * stays identical to the original `<span class="status-pill …">`.
 */
export function StatusPill({ cls, children }: { cls: string; children: React.ReactNode }) {
  return <span className={`status-pill ${cls}`}>{children}</span>;
}
