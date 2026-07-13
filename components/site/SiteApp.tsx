import { statSync } from "node:fs";
import { join } from "node:path";
import FrontBoot from "@/app/(site)/FrontBoot";
import { PageActivator } from "@/components/site/PageActivator";
import { Overlays } from "@/components/site/overlays/Overlays";
import { QuizModal } from "@/components/site/overlays/QuizModal";
import { Nav } from "@/components/site/chrome/Nav";
import { MobileMenu } from "@/components/site/chrome/MobileMenu";
import { SiteEnd } from "@/components/site/chrome/SiteEnd";
import { CategoryPage } from "@/components/site/pages/CategoryPage";
import { HomePage } from "@/components/site/pages/HomePage";
import { QuestsPage } from "@/components/site/pages/QuestsPage";
import { PartnerPage } from "@/components/site/pages/PartnerPage";
import { ListingPage } from "@/components/site/pages/ListingPage";
import { DealDynamicPage, DealHubbaPage } from "@/components/site/pages/DealPages";
import { AboutPage } from "@/components/site/pages/AboutPage";
import { ContactPage } from "@/components/site/pages/ContactPage";
import { FaqPage } from "@/components/site/pages/FaqPage";
import { altCategoryPages } from "@/lib/site/data/altCategoryPages";
import { altCategoryFilterGroups, buildCategoryFilterGroups } from "@/lib/site/data/categoryFilters";
import { buildQuestFilterGroups } from "@/lib/site/data/quests";
import { getSiteSettings } from "@/lib/siteSettings";
import { getPublishedQuests, getActiveCategoryTerms, getActiveFilterTerms } from "@/lib/quests";
import { getPublishedDeals } from "@/lib/deals";
import { questToCard, questToSlim, dealToProgram } from "@/lib/site/questMapping";

/** Cache-busting token for the front runtime: the file's mtime (recomputed per
 *  request in dev, baked at build for static pages). */
function frontJsVersion(): string {
  try {
    return String(Math.floor(statSync(join(process.cwd(), "public", "front.js")).mtimeMs));
  } catch {
    return "";
  }
}

/**
 * The front single-page app: every page lives in the DOM at once and the runtime
 * (`public/front.js`) toggles which is `.active`. Served at `/` (home) and from
 * the `/[page]` catch-all, which passes `initialPage` so a direct URL like
 * `/faq` opens that section on load (via `<FrontBoot>`), keeping the clean URL.
 */
export async function SiteApp({ initialPage }: { initialPage?: string }) {
  const [dbQuests, dbDeals, settings, categoryTerms, filterTerms] = await Promise.all([
    getPublishedQuests(),
    getPublishedDeals(),
    getSiteSettings(),
    getActiveCategoryTerms(),
    getActiveFilterTerms(),
  ]);
  // Filter sidebars whose Effort/Delivery/Budget/Duration groups are generated
  // from the live taxonomy, so admin term edits reflect in the front filters.
  const questFilters = buildQuestFilterGroups(filterTerms);
  const catFilters = buildCategoryFilterGroups(filterTerms);
  const questCards = dbQuests.map(questToCard);
  // Homepage "Featured Quests" section: the quests an admin flagged `featured`
  // in the Quest editor (already limited to publicly-visible quests by the read),
  // in display order.
  const featuredQuestCards = dbQuests.filter((q) => q.featured).map(questToCard);

  // Quiz results: each published quest with its Category (activity/type), Budget
  // and Duration term slugs so the front quiz can filter to the top matches by the
  // visitor's answers. Injected as JSON for front.js; `slug` drives Save to My Quests.
  const quizQuests = dbQuests.map((q) => {
    // First taxonomy term name of a kind — the fallback the quest detail page uses
    // so a field is never blank when the admin set the chip but not the free-text.
    const termName = (kind: string) => q.terms.find((t) => t.kind === kind)?.name ?? "";
    return {
      slug: q.slug,
      title: q.title,
      icon: q.card_icon || "🌍",
      meta: q.tagline || [q.duration, q.location_label].filter(Boolean).join(" · "),
      categories: q.terms.filter((t) => t.kind === "category").map((t) => t.slug),
      budgets: q.terms.filter((t) => t.kind === "budget").map((t) => t.slug),
      durations: q.terms.filter((t) => t.kind === "duration").map((t) => t.slug),
      // Fields for the quiz "Compare all 3" modal — the real quest's own data. Each
      // falls back to the matching taxonomy term name (as the detail-page stats do)
      // so most fields aren't left as "—" when only the chips are set.
      cost: q.budget_label || q.monthly_budget || termName("budget") || "—",
      time: q.timeline_label || q.duration || termName("duration") || "—",
      effort: q.difficulty_label || q.level || termName("difficulty") || "—",
      location: q.location_label || termName("country") || "—",
      bestTime: q.best_time || "—",
    };
  });

  // One category page per active Category taxonomy term (adding a term in the
  // admin makes its page appear here). Hero copy comes from the CMS overrides,
  // defaulting to the term name; the grid is the published quests tagged with it.
  const categoryPages = categoryTerms.map((term) => {
    const hero = settings.pages.categories[term.slug] ?? { label: "", title: "", sub: "" };
    return {
      id: term.slug,
      current: hero.label || term.name,
      label: hero.label || term.name,
      title: hero.title || term.name,
      sub: hero.sub,
      quests: dbQuests
        .filter((q) => q.terms.some((t) => t.kind === "category" && t.slug === term.slug))
        .map(questToSlim),
    };
  });
  // Homepage "Popular Programs": only deals an admin flagged `featured` ("Feature
  // on the homepage"), in display-order, up to 6. The featured toggle is the sole
  // control (matching the deal editor's own description).
  const PUBLIC_VIS = ["published", "featured", "coming_soon"];
  const programs = dbDeals
    .filter((d) => d.featured && PUBLIC_VIS.includes(d.visibility))
    .slice(0, 6)
    .map(dealToProgram);

  return (
    <>
      <h2 className="sr-only">{settings.general.siteName}</h2>

      <Overlays />
      <Nav nav={settings.nav} />
      <MobileMenu nav={settings.nav} />

      {/* Admin-editable Compare Paths cards → front.js `sqComparePaths`. */}
      <script
        id="compare-paths-data"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(settings.homepage.comparePaths?.cards ?? []).replace(/</g, "\\u003c"),
        }}
      />

      <HomePage programs={programs} featuredQuests={featuredQuestCards} homepage={settings.homepage} />
      <QuestsPage quests={questCards} hero={settings.pages.quests} filterGroups={questFilters} />

      {/* Goal-style category pages (alt filter sidebar — static sample data) */}
      {altCategoryPages.map((data) => (
        <CategoryPage data={data} filterGroups={altCategoryFilterGroups} key={data.id} />
      ))}

      {/* Directory-style category pages (DB-driven; taxonomy-backed filters) */}
      {categoryPages.map((data) => (
        <CategoryPage data={data} filterGroups={catFilters} key={data.id} />
      ))}

      <PartnerPage partner={settings.pages.partner} />
      <ListingPage />
      <DealDynamicPage />
      <DealHubbaPage />
      <AboutPage about={settings.pages.about} />
      <ContactPage contact={settings.pages.contact} />
      <FaqPage faq={settings.pages.faq} />

      <SiteEnd footer={settings.footer} />

      {/* Quiz gating flags + results count → front.js engine. */}
      <script
        id="quiz-data"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            enabled: settings.quiz.settings.status === "published",
            showOnHomepage: settings.quiz.settings.showOnHomepage,
            showOnQuests: settings.quiz.settings.showOnQuests,
            resultsDisplay: settings.quiz.settings.resultsDisplay,
            progression: settings.quiz.settings.progression,
          }).replace(/</g, "\\u003c"),
        }}
      />
      {/* Quests + their Category (activity/type) + Budget term slugs →
          front.js quiz result filtering. */}
      <script
        id="quiz-quests-data"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(quizQuests).replace(/</g, "\\u003c"),
        }}
      />
      <QuizModal quiz={settings.quiz} />

      {/* Pre-paint page activation. Every section lives in the DOM at once and
          the home page is the one server-rendered as `.active`. Without this,
          a refresh of e.g. /faq would show home first and only switch once
          front.js loads (`afterInteractive`) — a visible flash back to home.
          This synchronous inline script runs during HTML parse, before paint,
          and activates the right section immediately, so the refresh stays put.
          front.js's later `showPage()` then runs as normal (scroll/GA). */}
      <script
        id="initial-page-activate"
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var p=${JSON.stringify(
            initialPage ?? null
          )}||new URLSearchParams(location.search).get('p');if(!p||p==='home')return;var t=document.getElementById('page-'+p);if(!t)return;var h=document.getElementById('page-home');if(h)h.classList.remove('active');t.classList.add('active');}catch(e){}})();`,
        }}
      />

      <FrontBoot initialPage={initialPage} version={frontJsVersion()} />
      {/* Re-assert the active section after an App Router Back/Forward re-render. */}
      <PageActivator initialPage={initialPage} />
    </>
  );
}
