"use client";

import { toggleTax, togglePagesCms } from "@/lib/admin/runtime";
import { signOut } from "@/app/admin/login/actions";
import { AdminNavLink } from "./AdminNavLink";

/**
 * Admin sidebar — faithful transcription of `_reference/admin-body.html`'s
 * `<aside id="sidebar">`. The navigating items render as real links to
 * `/admin?p=<page>` (via `AdminNavLink`) so they can be opened in a new tab; a
 * plain click still soft-navigates the SPA via the runtime `nav()`. The two
 * submenu toggles stay buttons. Ids/classes/order are unchanged so `admin.js` +
 * the bridges keep finding every element. The Leads badge count is the one
 * dynamic bit (`newLeads`).
 */
export function Sidebar({ newLeads = 0, activePage = "dashboard" }: { newLeads?: number; activePage?: string }) {
  // Highlight the section active on first paint (server-set from `?p=`), so the
  // sidebar matches the content before admin.js loads.
  const cls = (page: string) => (page === activePage ? "nav-item active" : "nav-item");
  return (
    <aside id="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">OQ</div>
        <div className="logo-text">
          Out<span>Quest</span>
        </div>
      </div>
      <nav>
        <div className="nav-section">
          <div className="nav-label">Main</div>
          <AdminNavLink page="dashboard" className={cls("dashboard")}>
            <span className="icon">🏠</span>Dashboard
          </AdminNavLink>
        </div>
        <div className="nav-section">
          <div className="nav-label">Content</div>
          <AdminNavLink page="quests-list" className={cls("quests-list")}>
            <span className="icon">🗺️</span>Quests
          </AdminNavLink>
          <AdminNavLink page="deals-list" className={cls("deals-list")}>
            <span className="icon">🏷️</span>Deals
          </AdminNavLink>
          <AdminNavLink page="journal-list" className={cls("journal-list")}>
            <span className="icon">📝</span>Journal
          </AdminNavLink>
          <button className="nav-item" id="pages-cms-toggle" onClick={() => togglePagesCms()}>
            <span className="icon">🖥️</span>Pages CMS<span className="chevron">▶</span>
          </button>
          <div className="nav-sub collapsed" id="pages-cms-sub">
            <AdminNavLink page="pcms-homepage">Homepage</AdminNavLink>
            <AdminNavLink page="pcms-quests">Quests / Explore</AdminNavLink>
            <AdminNavLink page="pcms-journal">Journal</AdminNavLink>
            <AdminNavLink page="pcms-about">About</AdminNavLink>
            <AdminNavLink page="pcms-partners">Partners</AdminNavLink>
            <AdminNavLink page="pcms-faq">FAQ</AdminNavLink>
            <AdminNavLink page="pcms-privacy">Privacy</AdminNavLink>
            <AdminNavLink page="pcms-terms">Terms</AdminNavLink>
            <AdminNavLink page="pcms-contact">Contact</AdminNavLink>
            <AdminNavLink page="pcms-cat-pages">Category Pages</AdminNavLink>
          </div>
          <AdminNavLink page="quiz-builder">
            <span className="icon">🧩</span>Quiz Builder
          </AdminNavLink>
          <AdminNavLink page="nav-menu">
            <span className="icon">☰</span>Nav Menu
          </AdminNavLink>
          <AdminNavLink page="footer">
            <span className="icon">▬</span>Footer
          </AdminNavLink>
        </div>
        <div className="nav-section">
          <div className="nav-label">Classify</div>
          <button className="nav-item" id="tax-toggle" onClick={() => toggleTax()}>
            <span className="icon">🔖</span>Taxonomies<span className="chevron">▶</span>
          </button>
          <div className="nav-sub collapsed" id="tax-sub">
            <AdminNavLink page="tax-category">Category</AdminNavLink>
            <AdminNavLink page="tax-country">Country</AdminNavLink>
            <AdminNavLink page="tax-budget">Budget</AdminNavLink>
            <AdminNavLink page="tax-duration">Duration</AdminNavLink>
            <AdminNavLink page="tax-difficulty">Effort</AdminNavLink>
            <AdminNavLink page="tax-delivery">Delivery Mode</AdminNavLink>
            <AdminNavLink page="tax-life-direction">Life Direction</AdminNavLink>
            <AdminNavLink page="tax-outcome-goal">Outcome Goal</AdminNavLink>
            <AdminNavLink page="tax-journal-cat">Journal Category</AdminNavLink>
          </div>
        </div>
        <div className="nav-section">
          <div className="nav-label">CRM</div>
          <AdminNavLink page="leads" className={cls("leads")}>
            <span className="icon">👥</span>Leads
            {newLeads > 0 && <span className="badge">{newLeads}</span>}
          </AdminNavLink>
        </div>
        <div className="nav-section">
          <div className="nav-label">System</div>
          <AdminNavLink page="settings">
            <span className="icon">⚙️</span>Settings
          </AdminNavLink>
          <AdminNavLink page="auth-login">
            <span className="icon">🔐</span>Auth Pages
          </AdminNavLink>
        </div>
      </nav>
      <div className="sidebar-footer">
        <div className="admin-chip">
          <div className="avatar">A</div>
          <div className="admin-info">
            <div className="admin-name">Admin User</div>
            <div className="admin-role">Super Admin</div>
          </div>
          {/* Logout: posts to the `signOut` server action, which clears the
              Supabase session cookies and redirects to /admin/login. Works
              without client JS (progressive form submission). */}
          <form action={signOut}>
            <button type="submit" className="admin-logout" title="Log out" aria-label="Log out">
              <span aria-hidden="true">⎋</span>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
