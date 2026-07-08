import fs from "node:fs";
import path from "node:path";
import AdminBoot from "./AdminBoot";
import { AdminSessionKeeper } from "./AdminSessionKeeper";
import { AdminFlash } from "./AdminFlash";
import QuestEditorBridge, { type EditQuest } from "./QuestEditorBridge";
import TaxonomyBridge, { type TaxTerm } from "./TaxonomyBridge";
import DealsBridge, { type EditDeal, type DealQuestOpt } from "./DealsBridge";
import { requireAdmin } from "@/lib/auth";
import {
  adminListQuests,
  adminListTaxonomy,
  type QuestWithTerms,
  type TaxonomyKind,
} from "@/lib/quests";
import { adminListDeals, type DealWithQuests } from "@/lib/deals";
import { adminListJournalPosts, type JournalPost } from "@/lib/journal";
import { adminListLeads, type LeadRow } from "@/lib/leads";
import {
  adminGetSiteSettings,
  DEFAULT_FOOTER,
  DEFAULT_NAV,
  DEFAULT_HOMEPAGE,
  DEFAULT_QUESTS_PAGE,
  DEFAULT_JOURNAL_PAGE,
  DEFAULT_ABOUT,
  DEFAULT_PARTNER,
  DEFAULT_FAQ,
  DEFAULT_PRIVACY,
  DEFAULT_TERMS,
  DEFAULT_CONTACT,
  DEFAULT_QUIZ,
  DEFAULT_SEO_DEFAULTS,
  DEFAULT_SITE_CONFIG,
  getSiteSettings,
} from "@/lib/siteSettings";
import { getAdminConfig, DEFAULT_ADMIN_CONFIG } from "@/lib/adminConfig";
import JournalBridge from "./JournalBridge";
import LeadsBridge from "./LeadsBridge";
import NavMenuBridge from "./NavMenuBridge";
import FooterBridge from "./FooterBridge";
import { AdminApp } from "@/components/admin/AdminApp";
import { RawHtml } from "@/components/admin/RawHtml";
import { DashboardPage, type DashStats, type DashItem } from "@/components/admin/pages/DashboardPage";
import { QuestsListPage } from "@/components/admin/pages/QuestsListPage";
import { DealsListPage } from "@/components/admin/pages/DealsListPage";
import { JournalListPage } from "@/components/admin/pages/JournalListPage";
import { TaxonomyShell } from "@/components/admin/pages/TaxonomyShell";
import { LeadsPage } from "@/components/admin/pages/LeadsPage";
import { SettingsPage } from "@/components/admin/pages/SettingsPage";
import {
  AuthLoginPage,
  AuthForgotPage,
  AuthResetPage,
} from "@/components/admin/pages/AuthPages";
import { NavMenuPage } from "@/components/admin/pages/NavMenuPage";
import { FooterPage } from "@/components/admin/pages/FooterPage";
import { QuizBuilderPage } from "@/components/admin/pages/QuizBuilderPage";
import { LegalContentEditor } from "@/components/admin/pages/pcms/LegalContentEditor";
import { ContactEditorPage } from "@/components/admin/pages/pcms/ContactEditorPage";
import { CategoryPagesEditor } from "@/components/admin/pages/pcms/CategoryPagesEditor";
import { FaqEditorPage } from "@/components/admin/pages/pcms/FaqEditorPage";
import { JournalEditPage } from "@/components/admin/pages/JournalEditPage";
import { QuestEditPage } from "@/components/admin/pages/QuestEditPage";
import { DealsEditPage } from "@/components/admin/pages/DealsEditPage";
import { carveSection } from "@/lib/admin/carve";
import { HomepagePage } from "@/components/admin/pages/pcms/HomepagePage";
import { PageHeroEditor } from "@/components/admin/pages/pcms/PageHeroEditor";
import { AboutEditorPage } from "@/components/admin/pages/pcms/AboutEditorPage";
import { PartnerEditorPage } from "@/components/admin/pages/pcms/PartnerEditorPage";
import { Fragment, type ReactNode } from "react";

// Auth-gated + always dynamic (reads the session cookie + live quest data).
export const dynamic = "force-dynamic";

// The exact <body> markup of ADMIN REFERENCE.htm — the admin design is rendered
// verbatim. The ONLY change is the Quests list table body, whose hardcoded rows
// are swapped for live database rows below; the rest of the UI is untouched.
function getAdminBody(): string {
  return fs.readFileSync(
    path.join(process.cwd(), "_reference", "admin-body.html"),
    "utf8"
  );
}

/** Cache-busting token for the admin runtime: /admin.js mtime. */
function adminJsVersion(): string {
  try {
    return String(Math.floor(fs.statSync(path.join(process.cwd(), "public", "admin.js")).mtimeMs));
  } catch {
    return "";
  }
}

/**
 * Inner HTML of `#content` (the page sections) from the reference body. The
 * chrome (`#sidebar`, `#header`, the link modal) is now rendered by `<AppShell>`
 * as components, so only the sections remain to be passed through as markup
 * while they are migrated into `components/admin/pages/*`.
 */
function extractContent(body: string): string {
  const openTag = '<div id="content">';
  const start = body.indexOf(openTag);
  if (start === -1) return body;
  const from = start + openTag.length;
  const end = body.indexOf("</div><!-- /content -->", from);
  return end === -1 ? body.slice(from) : body.slice(from, end);
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const PUBLIC_VIS = new Set(["published", "featured", "coming_soon"]);

function termsOf(q: QuestWithTerms, kind: TaxonomyKind): string {
  const names = q.terms.filter((t) => t.kind === kind).map((t) => t.name);
  return names.length ? esc(names.join(", ")) : "—";
}

/** Build the Quests list `<tbody>` rows, matching the reference markup exactly. */
function questRows(quests: QuestWithTerms[]): string {
  if (quests.length === 0) {
    return `<tr><td colspan="9" style="color:var(--muted);padding:20px">No quests yet.</td></tr>`;
  }
  return quests
    .map((q) => {
      const pill = PUBLIC_VIS.has(q.visibility) ? "pill-published" : "pill-draft";
      const updated = new Date(q.updated_at).toLocaleDateString();
      return (
        `<tr><td><strong>${esc(q.title)}</strong></td>` +
        `<td>${termsOf(q, "category")}</td>` +
        `<td>${termsOf(q, "country")}</td>` +
        `<td>${termsOf(q, "life_direction")}</td>` +
        `<td>${termsOf(q, "outcome_goal")}</td>` +
        `<td>${termsOf(q, "difficulty")}</td>` +
        `<td><span class="status-pill ${pill}">${esc(q.visibility)}</span></td>` +
        `<td style="color:var(--muted)">${updated}</td>` +
        `<td><div class="row-actions">` +
        `<button class="btn btn-ghost btn-sm" data-quest-id="${q.id}" onclick="nav('quests-edit')">Edit</button>` +
        `<button class="btn btn-danger btn-sm" data-quest-del="${q.id}">Del</button></div></td></tr>`
      );
    })
    .join("");
}

/** Replace a page's hardcoded `<tbody>` rows with live DB rows (design untouched). */
function injectRows(html: string, sectionId: string, rows: string): string {
  const sectionIdx = html.indexOf(`id="${sectionId}"`);
  if (sectionIdx === -1) return html;
  const tbodyStart = html.indexOf("<tbody>", sectionIdx);
  const tbodyEnd = html.indexOf("</tbody>", tbodyStart);
  if (tbodyStart === -1 || tbodyEnd === -1) return html;
  return html.slice(0, tbodyStart + "<tbody>".length) + rows + html.slice(tbodyEnd);
}

/**
 * Replace the hardcoded `.ext-rel-row` items inside an `.ext-rel-wrap` picker
 * (Similar Quests / Related Deals) with live DB rows — design untouched. The
 * rows live between the wrap's opening tag and the trailing `.ext-rel-chips`.
 */
function injectRelRows(html: string, listId: string, rows: string): string {
  const idIdx = html.indexOf(`id="${listId}"`);
  if (idIdx === -1) return html;
  const open = html.indexOf(">", idIdx);
  const chipsIdx = html.indexOf(`<div class="ext-rel-chips"`, open);
  if (open === -1 || chipsIdx === -1) return html;
  const wrapClose = html.lastIndexOf("</div>", chipsIdx);
  if (wrapClose === -1 || wrapClose <= open) return html;
  return html.slice(0, open + 1) + rows + html.slice(wrapClose);
}

const QUEST_ICON_FALLBACK = "🌍";

/** Build the "Similar Quests" picker rows in the quest editor (live quests). */
function relQuestRows(quests: QuestWithTerms[]): string {
  return quests
    .map((q) => {
      const icon = esc(q.card_icon || QUEST_ICON_FALLBACK);
      const meta =
        [termsOf(q, "category"), termsOf(q, "country")].filter((m) => m !== "—").join(" · ") || "—";
      // Note: this list keeps the reference's `d-rel-quests-*` ids even though it
      // sits in the quest editor (a copy-paste artifact in the source markup).
      return (
        `<div class="ext-rel-row" data-rel-quest="${esc(q.slug)}" onclick="extToggleRel(this,'d-rel-quests-chips')">` +
        `<input type="checkbox"/><span class="ext-rel-icon">${icon}</span>` +
        `<div class="ext-rel-info"><div class="ext-rel-name">${esc(q.title)}</div>` +
        `<div class="ext-rel-meta">${meta}</div></div></div>`
      );
    })
    .join("");
}

const DEAL_CAT_LABEL: Record<string, string> = {
  programs: "Programs",
  setup: "Get Set Up",
  tools: "Tools & Essentials",
};
const DEAL_ACTION_LABEL: Record<string, string> = {
  direct: "Book",
  affiliate: "Affiliate",
  leadform: "Lead Gen",
};

/** Build the Deals list `<tbody>` rows (matching the reference markup). */
function dealRows(deals: DealWithQuests[]): string {
  if (deals.length === 0) {
    return `<tr><td colspan="6" style="color:var(--muted);padding:20px">No deals yet.</td></tr>`;
  }
  return deals
    .map((d) => {
      const pill = PUBLIC_VIS.has(d.visibility) ? "pill-published" : "pill-draft";
      const statusTxt = PUBLIC_VIS.has(d.visibility) ? "Published" : "Draft";
      return (
        `<tr><td><strong>${esc(d.title)}</strong></td>` +
        `<td><code style="font-size:11px;background:var(--cream-2);padding:2px 6px;border-radius:4px">${esc(d.slug)}</code></td>` +
        `<td>${esc(DEAL_CAT_LABEL[d.category ?? ""] ?? "—")}</td>` +
        `<td><span class="status-pill ${pill}">${statusTxt}</span></td>` +
        `<td>${esc(DEAL_ACTION_LABEL[d.action_type ?? ""] ?? "—")}</td>` +
        `<td><div class="row-actions">` +
        `<button class="btn btn-ghost btn-sm" data-deal-id="${d.id}" onclick="nav('deals-edit')">Edit</button>` +
        `<button class="btn btn-danger btn-sm" data-deal-del="${d.id}">Del</button></div></td></tr>`
      );
    })
    .join("");
}

/** Build the Journal list `<tbody>` rows (matching the reference markup). */
function journalRows(posts: JournalPost[]): string {
  if (posts.length === 0) {
    return `<tr><td colspan="5" style="color:var(--muted);padding:20px">No posts yet.</td></tr>`;
  }
  return posts
    .map((p) => {
      const pub = PUBLIC_VIS.has(p.visibility);
      const pill = pub ? "pill-published" : "pill-draft";
      const statusTxt = pub ? "Published" : "Draft";
      const date = p.published_at
        ? new Date(p.published_at).toLocaleDateString()
        : p.date_label || "—";
      return (
        `<tr><td><strong>${esc(p.title)}</strong></td>` +
        `<td>${esc(p.category ?? "—")}</td>` +
        `<td><span class="status-pill ${pill}">${statusTxt}</span></td>` +
        `<td style="color:var(--muted)">${esc(date)}</td>` +
        `<td><div class="row-actions">` +
        `<button class="btn btn-ghost btn-sm" data-journal-id="${p.id}" onclick="nav('journal-edit')">Edit</button>` +
        `<button class="btn btn-danger btn-sm" data-journal-del="${p.id}">Del</button></div></td></tr>`
      );
    })
    .join("");
}

const LEAD_PILL: Record<string, { cls: string; label: string }> = {
  new: { cls: "pill-new", label: "New" },
  contacted: { cls: "pill-contacted", label: "Contacted" },
  qualified: { cls: "pill-contacted", label: "Qualified" },
  closed: { cls: "pill-closed", label: "Closed" },
};

function leadDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Build the Leads list `<tbody>` rows (matching the reference markup). LeadsBridge
 *  wires the View button + status updates by `data-lead-id`. */
function leadRows(leads: LeadRow[]): string {
  if (leads.length === 0) {
    return `<tr><td colspan="7" style="color:var(--muted);padding:20px">No leads yet.</td></tr>`;
  }
  return leads
    .map((l) => {
      const p = LEAD_PILL[l.status] ?? LEAD_PILL.new;
      return (
        `<tr data-lead-id="${l.id}"><td><strong>${esc(l.name)}</strong></td>` +
        `<td style="color:var(--muted)">${esc(l.email ?? "—")}</td>` +
        `<td>${esc(l.source_quest || "—")}</td>` +
        `<td style="color:var(--muted)">${esc(l.source_deal || "—")}</td>` +
        `<td><span class="status-pill ${p.cls}">${p.label}</span></td>` +
        `<td style="color:var(--muted)">${esc(leadDate(l.created_at))}</td>` +
        `<td><div class="row-actions">` +
        `<button class="btn btn-ghost btn-sm" data-lead-view="${l.id}">View</button>` +
        `<button class="btn btn-danger btn-sm" data-lead-del="${l.id}">Del</button></div></td></tr>`
      );
    })
    .join("");
}

/** Build the live Dashboard Overview data (stat cards + recent panels) from the
 *  admin lists. Kept out of the component render so the time reads are isolated. */
function buildDashboard(
  quests: QuestWithTerms[],
  deals: DealWithQuests[],
  journalPosts: JournalPost[],
  leads: LeadRow[]
): { stats: DashStats; recentLeads: DashItem[]; recentUpdates: DashItem[] } {
  const now = Date.now();
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
  const dayStart = new Date().setHours(0, 0, 0, 0);
  const ms = (iso?: string | null) => (iso ? new Date(iso).getTime() : 0);
  const relTime = (iso?: string | null) => {
    const diff = now - ms(iso);
    if (!iso || diff < 0) return "";
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return d < 30 ? `${d}d ago` : new Date(iso).toLocaleDateString();
  };
  const createdAt = (x: unknown) => (x as { created_at?: string }).created_at;

  const stats: DashStats = {
    quests: quests.length,
    deals: deals.length,
    leads: leads.length,
    questsThisMonth: quests.filter((q) => ms(createdAt(q)) >= monthStart).length,
    dealsThisMonth: deals.filter((d) => ms(createdAt(d)) >= monthStart).length,
    leadsToday: leads.filter((l) => ms(l.created_at) >= dayStart).length,
  };

  const LEAD_SOURCE: Record<string, string> = {
    contact: "via contact form",
    partner: "via partnership form",
    deal: "via deal page",
    booking: "via booking",
  };
  const LEAD_DOTS = ["var(--accent2)", "var(--accent)", "var(--accent3)", "var(--muted)"];
  const recentLeads: DashItem[] = [...leads]
    .sort((a, b) => ms(b.created_at) - ms(a.created_at))
    .slice(0, 4)
    .map((l, i) => ({
      name: [l.name, l.subject || l.source_quest || l.source_deal].filter(Boolean).join(" — "),
      meta: LEAD_SOURCE[l.lead_type] ?? "via form",
      time: relTime(l.created_at),
      color: LEAD_DOTS[i] ?? "var(--muted)",
    }));

  const PUBLIC_STATUS = new Set(["published", "featured", "coming_soon"]);
  const UPD_DOTS = ["var(--accent)", "var(--accent3)", "var(--accent2)", "var(--muted)"];
  const recentUpdates: DashItem[] = [
    ...quests.map((q) => ({ kind: "Quest", title: q.title, visibility: q.visibility, updated_at: q.updated_at })),
    ...deals.map((d) => ({ kind: "Deal", title: d.title, visibility: d.visibility, updated_at: d.updated_at })),
    ...journalPosts.map((p) => ({ kind: "Journal", title: p.title, visibility: p.visibility, updated_at: p.updated_at })),
  ]
    .sort((a, b) => ms(b.updated_at) - ms(a.updated_at))
    .slice(0, 4)
    .map((u, i) => ({
      name: `${u.kind} ${PUBLIC_STATUS.has(u.visibility) ? "published" : "updated"}: "${u.title}"`,
      meta: `status → ${u.visibility}`,
      time: relTime(u.updated_at),
      color: UPD_DOTS[i] ?? "var(--muted)",
    }));

  return { stats, recentLeads, recentUpdates };
}

// Country slug → region label (for the Connected-Quests filter in the deal editor).
const COUNTRY_REGION: Record<string, string> = {
  indonesia: "Asia",
  japan: "Asia",
  nepal: "Asia",
  thailand: "Asia",
  morocco: "Middle East & Africa",
  portugal: "Europe",
};

/** Sections we can render active server-side (so a `?p=` deep-link / post-save
 *  redirect paints that section immediately — no Dashboard flash before admin.js
 *  loads). Others fall back to Dashboard, then admin.js switches on load. */
const SERVER_ACTIVE_PAGES = new Set([
  "dashboard",
  "quests-list",
  "deals-list",
  "journal-list",
  "leads",
]);

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  // Server-side gate: non-admins (or signed-out users) are redirected to login.
  await requireAdmin();
  // Which section to render active on first paint (from `?p=`); unknown → dashboard.
  const requested = (await searchParams)?.p ?? "";
  const activePage = SERVER_ACTIVE_PAGES.has(requested) ? requested : "dashboard";
  const [quests, taxonomy, deals, journalPosts, leads, siteSettings, adminConfig] =
    await Promise.all([
      adminListQuests(),
      adminListTaxonomy(),
      adminListDeals().catch(() => [] as DealWithQuests[]),
      adminListJournalPosts().catch(() => [] as JournalPost[]),
      adminListLeads().catch(() => [] as LeadRow[]),
      adminGetSiteSettings().catch(() => null),
      getAdminConfig().catch(() => DEFAULT_ADMIN_CONFIG),
    ]);
  let html = injectRows(getAdminBody(), "page-quests-list", questRows(quests));
  html = injectRows(html, "page-deals-list", dealRows(deals));
  html = injectRows(html, "page-journal-list", journalRows(journalPosts));
  // Only deal-form leads go in the reference's (server-rendered) Leads table;
  // Contact + Partnership submissions get their own client-rendered tabs.
  html = injectRows(html, "page-leads", leadRows(leads.filter((l) => l.lead_type === "deal")));

  // Live count (all new leads, any type) for the Leads nav badge (Sidebar prop).
  const newLeads = leads.filter((l) => l.status === "new").length;

  // ── Dashboard Overview live data (stat cards + recent panels) ──
  const { stats: dashStats, recentLeads, recentUpdates } = buildDashboard(
    quests,
    deals,
    journalPosts,
    leads
  );

  // Deal editor's "Similar Quests" picker → live DB rows.
  html = injectRelRows(html, "d-rel-quests-list", relQuestRows(quests));

  // Flat taxonomy term list for the editor bridge (chip/select → term id mapping).
  const terms = Object.values(taxonomy)
    .flat()
    .map((t) => ({ id: t.id, kind: t.kind, name: t.name }));

  // Grouped taxonomy for the Taxonomies bridge (DB-driven tables + CRUD).
  const taxForBridge: Record<string, TaxTerm[]> = {};
  for (const [kind, list] of Object.entries(taxonomy)) {
    taxForBridge[kind] = list.map((t) => ({
      id: t.id,
      kind: t.kind,
      slug: t.slug,
      name: t.name,
      active: t.active,
      sort_order: t.sort_order,
    }));
  }

  // Serializable quest data so the editor bridge can populate the form on Edit.
  const editQuests: EditQuest[] = quests.map((q) => ({
    id: q.id,
    title: q.title,
    slug: q.slug,
    tagline: q.tagline,
    level: q.level,
    seo_title: q.seo_title,
    meta_description: q.meta_description,
    canonical_url: q.canonical_url,
    card_icon: q.card_icon,
    card_color: q.card_color,
    card_gradient: q.card_gradient,
    timeline_label: q.timeline_label,
    difficulty_label: q.difficulty_label,
    monthly_budget: q.monthly_budget,
    best_time: q.best_time,
    location_label: q.location_label,
    duration: q.duration,
    featured_image_path: q.featured_image_path,
    card_image_path: q.card_image_path,
    og_image_url: q.og_image_url,
    slides: q.slides ?? [],
    arts: q.arts ?? [],
    content: q.content ?? {},
    visibility: q.visibility,
    featured: q.featured,
    hide_frontend: q.hide_frontend,
    display_order: q.display_order,
    terms: q.terms.map((t) => ({ kind: t.kind, name: t.name })),
  }));

  // Serializable deal data + the quest options for the Connected-Quests picker.
  const editDeals: EditDeal[] = deals.map((d) => ({
    id: d.id,
    title: d.title,
    slug: d.slug,
    category: d.category,
    short_desc: d.short_desc,
    partner_name: d.partner_name,
    card_icon: d.card_icon,
    card_color: d.card_color,
    what_is: d.what_is,
    who_for: d.who_for,
    why_useful: d.why_useful,
    requirements: d.requirements,
    checklist: d.checklist,
    cta_label: d.cta_label,
    action_type: d.action_type,
    book_url: d.book_url,
    affiliate_url: d.affiliate_url,
    lead_form_fields: d.lead_form_fields,
    pay_type: d.pay_type,
    total_price: d.total_price,
    deposit_amount: d.deposit_amount,
    refund_policy: d.refund_policy,
    booking_fields: d.booking_fields,
    price_from: d.price_from,
    billing_unit: d.billing_unit,
    offer_label: d.offer_label,
    offer_price: d.offer_price,
    outcome_text: d.outcome_text,
    cta_heading: d.cta_heading,
    cta_subtext: d.cta_subtext,
    cta_button_label: d.cta_button_label,
    verified: d.verified,
    featured: d.featured,
    seo_title: d.seo_title,
    meta_description: d.meta_description,
    visibility: d.visibility,
    display_order: d.display_order,
    featured_image_path: d.featured_image_path,
    card_image_path: d.card_image_path,
    og_image_url: d.og_image_url,
    questSlugs: d.questSlugs,
  }));

  const dealQuestOptions: DealQuestOpt[] = quests.map((q) => {
    const country = q.terms.find((t) => t.kind === "country");
    return {
      id: q.id,
      slug: q.slug,
      title: q.title,
      location: (country && COUNTRY_REGION[country.slug]) || q.location_label || "",
      type: q.terms.find((t) => t.kind === "category")?.name ?? "",
    };
  });

  // Build `#content` as an ordered list of segments: converted sections render
  // their component in place, everything else passes through as raw markup. The
  // converted ids are listed in document order so carving from `rest` preserves
  // source order. As more sections are converted, add them to this list.
  const segments: ReactNode[] = [];
  let rest = extractContent(html);
  let key = 0;
  const convert = (id: string, node: ReactNode | ((sectionHtml: string) => ReactNode)) => {
    const carved = carveSection(rest, id);
    if (!carved) return;
    const [before, section, after] = carved;
    if (before) segments.push(<RawHtml key={key++} html={before} />);
    const resolved = typeof node === "function" ? node(section) : node;
    segments.push(<Fragment key={key++}>{resolved}</Fragment>);
    rest = after;
  };
  // Carve a section out and discard it (its raw markup is no longer rendered).
  const drop = (id: string) => {
    const carved = carveSection(rest, id);
    if (!carved) return;
    const [before, , after] = carved;
    if (before) segments.push(<RawHtml key={key++} html={before} />);
    rest = after;
  };

  convert(
    "page-dashboard",
    <DashboardPage stats={dashStats} recentLeads={recentLeads} recentUpdates={recentUpdates} active={activePage === "dashboard"} />
  );
  convert("page-quests-list", <QuestsListPage quests={quests} active={activePage === "quests-list"} />);
  convert(
    "page-quests-edit",
    <QuestEditPage quests={quests} />
  );
  convert("page-deals-list", <DealsListPage deals={deals} active={activePage === "deals-list"} />);
  convert("page-deals-edit", <DealsEditPage />);
  // force-dynamic page → request-time clock is intended (for "scheduled" rows).
  // eslint-disable-next-line react-hooks/purity
  convert("page-journal-list", <JournalListPage posts={journalPosts} now={Date.now()} active={activePage === "journal-list"} />);
  convert("page-journal-edit", <JournalEditPage />);
  // Homepage: all 9 front sections are editable forms. The reel cards
  // ("Explore by destination/goals") link to a preset quest filter, so their
  // value must be a real term slug — feed the editor the Country + Outcome Goal
  // terms for a dropdown instead of free text (which never matched).
  const reelTax = {
    destination: (taxonomy.country ?? []).filter((t) => t.active).map((t) => ({ slug: t.slug, name: t.name })),
    category: (taxonomy.category ?? []).filter((t) => t.active).map((t) => ({ slug: t.slug, name: t.name })),
    outcome: (taxonomy.outcome_goal ?? []).filter((t) => t.active).map((t) => ({ slug: t.slug, name: t.name })),
  };
  convert(
    "page-pcms-homepage",
    <HomepagePage homepage={siteSettings?.homepage ?? DEFAULT_HOMEPAGE} reelTax={reelTax} />
  );
  // Quests / Explore: hero only (filters + grid are dynamic).
  convert(
    "page-pcms-quests",
    <PageHeroEditor pageId="page-pcms-quests" title="Quests / Explore" path="/quests" pageKey="quests" hero={siteSettings?.pages.quests ?? DEFAULT_QUESTS_PAGE} />
  );
  // Quest Detail is fully dynamic (rendered from the DB quest), so it isn't an
  // editable CMS page — drop its stale raw markup. (Pages-CMS deals remain raw.)
  drop("page-pcms-quest-detail");
  // Journal: hero only (the featured article + grid are dynamic DB posts).
  convert(
    "page-pcms-journal",
    <PageHeroEditor pageId="page-pcms-journal" title="Journal" path="/journal" pageKey="journal" hero={siteSettings?.pages.journal ?? DEFAULT_JOURNAL_PAGE} />
  );

  // const settings = await getSiteSettings(); // however you currently fetch settings
  const pageSeo = siteSettings?.page_seo ?? {} 
  // About: full multi-section editor.
  convert("page-pcms-about", <AboutEditorPage about={siteSettings?.pages.about ?? DEFAULT_ABOUT}
    fullPageSeo={pageSeo}
  />);
  // Partners: full multi-section editor.
  convert("page-pcms-partners", <PartnerEditorPage partner={siteSettings?.pages.partner ?? DEFAULT_PARTNER} />);
  convert("page-pcms-faq", <FaqEditorPage faq={siteSettings?.pages.faq ?? DEFAULT_FAQ} />);
  convert(
    "page-pcms-privacy",
    <LegalContentEditor pageId="page-pcms-privacy" title="Privacy" path="/privacy" pageKey="privacy" config={siteSettings?.pages.privacy ?? DEFAULT_PRIVACY} />
  );
  convert(
    "page-pcms-terms",
    <LegalContentEditor pageId="page-pcms-terms" title="Terms" path="/terms" pageKey="terms" config={siteSettings?.pages.terms ?? DEFAULT_TERMS} />
  );
  convert("page-pcms-contact", <ContactEditorPage contact={siteSettings?.pages.contact ?? DEFAULT_CONTACT} />);
  // Quiz Builder: seeded from the saved config. Result paths link to any
  // page-generating term (Category / Life Direction); answer options filter the
  // quest results by a Category, Budget, or Duration term.
  const quizTax = [
    ...(taxonomy.category ?? []),
    ...(taxonomy.budget ?? []),
    ...(taxonomy.duration ?? []),
    ...(taxonomy.life_direction ?? []),
  ]
    .filter((t) => t.active)
    .map((t) => ({ kind: t.kind, slug: t.slug, name: t.name }));
  convert("page-quiz-builder", <QuizBuilderPage quiz={siteSettings?.quiz ?? DEFAULT_QUIZ} taxonomy={quizTax} />);
  // Category Pages: generated from the Category taxonomy; editable hero per page.
  convert(
    "page-pcms-cat-pages",
    <CategoryPagesEditor
      terms={(taxonomy.category ?? []).map((t) => ({ slug: t.slug, name: t.name, active: t.active }))}
      categories={siteSettings?.pages.categories ?? {}}
    />
  );
  // The old hand-built per-category editor pages are replaced by the taxonomy-
  // driven Category Pages editor above; drop their stale raw markup.
  drop("page-pcms-cat-work-abroad");
  drop("page-pcms-cat-move-abroad");
  drop("page-pcms-cat-get-certified");
  drop("page-pcms-cat-side-hustle");
  drop("page-pcms-cat-business");
  drop("page-pcms-cat-level-up");
  convert("page-tax-category", <TaxonomyShell kind="category" />);
  convert("page-tax-country", <TaxonomyShell kind="country" />);
  convert("page-tax-budget", <TaxonomyShell kind="budget" />);
  convert("page-tax-duration", <TaxonomyShell kind="duration" />);
  convert("page-tax-difficulty", <TaxonomyShell kind="difficulty" />);
  convert("page-tax-delivery", <TaxonomyShell kind="delivery" />);
  convert("page-tax-life-direction", <TaxonomyShell kind="life-direction" />);
  convert("page-tax-outcome-goal", <TaxonomyShell kind="outcome-goal" />);
  convert("page-tax-journal-cat", <TaxonomyShell kind="journal-cat" />);
  convert("page-leads", <LeadsPage leads={leads.filter((l) => l.lead_type === "deal")} active={activePage === "leads"} />);
  convert(
    "page-settings",
    <SettingsPage
      seo={siteSettings?.seo ?? DEFAULT_SEO_DEFAULTS}
      general={siteSettings?.general ?? DEFAULT_SITE_CONFIG.general}
      globalCopy={siteSettings?.globalCopy ?? DEFAULT_SITE_CONFIG.globalCopy}
      email={{ ...adminConfig.email, smtpPass: "" }}
      hasSmtpPass={!!adminConfig.email.smtpPass}
    />
  );
  convert("page-auth-login", <AuthLoginPage />);
  convert("page-auth-forgot", <AuthForgotPage />);
  convert("page-auth-reset", <AuthResetPage />);
  convert("page-nav-menu", <NavMenuPage />);
  convert("page-footer", <FooterPage />);
  if (rest) segments.push(<RawHtml key={key++} html={rest} />);

  return (
    <>
      <AdminApp newLeads={newLeads} activePage={activePage}>{segments}</AdminApp>
      {/* Pre-paint section activation. Only a handful of sections can be rendered
          active server-side (SERVER_ACTIVE_PAGES); the rest default to Dashboard
          and would flash it on a `?p=` refresh until admin.js loads
          (`AdminBoot` appends it after hydration) and switches. This synchronous
          inline script runs during HTML parse, before paint, and activates the
          requested section immediately, so a refresh stays put. admin.js's own
          boot then re-runs nav() to sync the sidebar/header.

          Emitted as a raw HTML string (not a JSX <script>) so React treats it as
          opaque: no "scripts inside React components are never executed on the
          client" warning, and it still runs during the initial HTML parse — which
          is the only time the pre-paint activation matters (soft-nav is handled by
          admin.js). */}
      <RawHtml
        html={`<script id="admin-initial-page-activate">(function(){try{var p=new URLSearchParams(location.search).get('p');if(!p||!/^[a-z0-9-]+$/i.test(p)||p==='dashboard')return;var t=document.getElementById('page-'+p);if(!t)return;document.querySelectorAll('.page.active').forEach(function(e){e.classList.remove('active');});t.classList.add('active');}catch(e){}})();</script>`}
      />
      <AdminBoot version={adminJsVersion()} />
      {/* Keeps the Supabase session refreshed in the browser so an idle editor's
          token doesn't expire and 401 the next save (pairs with proxy.ts). */}
      <AdminSessionKeeper />
      {/* One-time success banner after redirects (e.g. email-change confirmation). */}
      <AdminFlash />
      {/* Wires the reference editor's Save/Edit buttons to create + update quests
          (no UI change). */}
      <QuestEditorBridge terms={terms} quests={editQuests} />
      {/* Drives the Taxonomies tables + CRUD from the DB (no UI change). */}
      <TaxonomyBridge taxonomy={taxForBridge} />
      {/* Wires the Deals list + editor to create + update deals (no UI change). */}
      <DealsBridge deals={editDeals} quests={dealQuestOptions} />
      {/* Wires the Journal list + editor to create + update posts (no UI change). */}
      <JournalBridge
        posts={journalPosts}
        categories={(taxonomy.journal_category ?? []).filter((t) => t.active).map((t) => t.name)}
      />
      {/* Drives the Leads table (View modal, status updates, search/filter, CSV). */}
      <LeadsBridge leads={leads} />
      {/* Loads + saves the editable site chrome (no UI change). */}
      <NavMenuBridge nav={siteSettings?.nav ?? DEFAULT_NAV} />
      <FooterBridge footer={siteSettings?.footer ?? DEFAULT_FOOTER} />
    </>
  );
}
