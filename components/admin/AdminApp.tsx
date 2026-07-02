import { AppShell } from "./layout/AppShell";

/**
 * Admin application root. The chrome (sidebar, header, link modal) is rendered
 * from real components; `children` are the ordered `#content` sections.
 *
 * Migration state: sections are being moved out of `_reference/admin-body.html`
 * into `components/admin/pages/*` one at a time. `app/admin/page.tsx` carves
 * each converted section out of the reference markup, renders its component in
 * place, and passes the remaining runs through as `<RawHtml>` (a
 * `display:contents` wrapper) — so the DOM the runtime + bridges see is
 * unchanged regardless of how many sections have been converted.
 */
export function AdminApp({
  newLeads = 0,
  activePage = "dashboard",
  children,
}: {
  newLeads?: number;
  activePage?: string;
  children: React.ReactNode;
}) {
  return (
    <AppShell newLeads={newLeads} activePage={activePage}>
      {children}
    </AppShell>
  );
}
