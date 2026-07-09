import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth";
import {
  SITE_SETTINGS_TAG,
  type FooterConfig,
  type NavConfig,
  type NavLinkItem,
  type NavBrand,
  type NavCta,
  type NavDisplay,
  type NavStyle,
  type FooterColumnItem,
  type FooterNewsletter,
  type FooterStyle,
  type HomepageConfig,
  type HomeHero,
  type HeroPill,
  type HeroCard,
  type WhyCell,
  type Persona,
  type ProofCard,
  type ReelCard,
  type ComparePathCard,
  type PagesConfig,
  type PageHero,
} from "@/lib/siteSettings";
import type {
  AboutConfig,
  AboutPolaroid,
  AboutDecoPolaroid,
  AboutPathCard,
  AboutWhoCard,
  AboutMapCard,
  AboutLocDot,
  AboutHiwStep,
  AboutWhyItem,
} from "@/lib/site/data/about";
import type {
  PartnerConfig,
  PartnerCategory,
  PartnerWhyCard,
  PartnerFaq,
} from "@/lib/site/data/partner";
import type { FaqPageConfig, FaqCategory } from "@/lib/site/data/faq";
import type { LegalPageConfig } from "@/lib/site/data/legal";
import type { ContactConfig, ContactCard, ContactLinkType } from "@/lib/site/data/contact";
import type { CategoryHero } from "@/lib/site/data/pages";
import {
  DEFAULT_QUIZ,
  type QuizConfig,
  type QuizBuilderQuestion,
  type QuizBuilderOption,
  type QuizFilterKind,
  type QuizIntro,
  type QuizSettings,
} from "@/lib/site/data/quiz";
import type { SeoDefaults } from "@/lib/site/data/seoDefaults";
import type { SiteConfig } from "@/lib/site/data/siteConfig";

const str = (v: unknown) => String(v ?? "").trim();
const bool = (v: unknown) => v === true;
/** Accept "#rgb"/"#rrggbb" hex colours only; anything else → "" (CSS default). */
const hex = (v: unknown) => (/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(str(v)) ? str(v) : "");

/** Validate/normalize the nav links (with optional dropdown children). */
function cleanNav(v: unknown): NavConfig {
  const links = Array.isArray((v as NavConfig)?.links) ? (v as NavConfig).links : [];
  const out: NavLinkItem[] = [];
  for (const raw of links) {
    const label = str(raw?.label);
    if (!label) continue;
    const item: NavLinkItem = {
      label,
      url: str(raw?.url),
      target: raw?.target === "_blank" ? "_blank" : "_self",
    };
    const dd = Array.isArray(raw?.dropdown) ? raw.dropdown : [];
    const children = dd
      .map((c) => ({ label: str(c?.label), url: str(c?.url) }))
      .filter((c) => c.label);
    if (children.length) item.dropdown = children;
    out.push(item);
  }
  const cfg: NavConfig = { links: out };
  const nav = v as NavConfig;
  const brand = cleanBrand(nav?.brand);
  if (brand) cfg.brand = brand;
  if (nav?.cta !== undefined) cfg.cta = cleanCta(nav.cta);
  if (nav?.display !== undefined) cfg.display = cleanDisplay(nav.display);
  if (nav?.style !== undefined) cfg.style = cleanStyle(nav.style);
  return cfg;
}

/** Validate/normalize the right-side CTA button. */
function cleanCta(v: unknown): NavCta {
  const c = (v ?? {}) as Partial<NavCta>;
  return {
    label: str(c.label),
    url: str(c.url),
    style: c.style === "ghost" ? "ghost" : "primary",
    show: bool(c.show),
  };
}

/** Validate/normalize the display toggles. */
function cleanDisplay(v: unknown): NavDisplay {
  const d = (v ?? {}) as Partial<NavDisplay>;
  return {
    sticky: bool(d.sticky),
    showOnAllPages: bool(d.showOnAllPages),
    transparentOnHero: bool(d.transparentOnHero),
  };
}

/** Validate/normalize the nav colour overrides. */
function cleanStyle(v: unknown): NavStyle {
  const s = (v ?? {}) as Partial<NavStyle>;
  return {
    bgColor: hex(s.bgColor),
    textColor: hex(s.textColor),
    showBorder: bool(s.showBorder),
  };
}

/** Validate/normalize the optional nav branding; returns undefined when all blank. */
function cleanBrand(v: unknown): NavBrand | undefined {
  const b = (v ?? {}) as Partial<NavBrand>;
  const brand: NavBrand = {
    logoUrl: str(b.logoUrl),
    logoAlt: str(b.logoAlt),
    logoLink: str(b.logoLink),
    faviconUrl: str(b.faviconUrl),
  };
  // Drop the field entirely when nothing is set, so the public nav stays default.
  return brand.logoUrl || brand.logoAlt || brand.logoLink || brand.faviconUrl
    ? brand
    : undefined;
}

/** Validate/normalize the footer config. */
function cleanFooter(v: unknown): FooterConfig {
  const f = (v ?? {}) as Partial<FooterConfig>;
  const columns: FooterColumnItem[] = (Array.isArray(f.columns) ? f.columns : [])
    .map((col) => ({
      label: str(col?.label),
      links: (Array.isArray(col?.links) ? col.links : [])
        .map((l) => ({ label: str(l?.label), url: str(l?.url) }))
        .filter((l) => l.label),
    }))
    .filter((col) => col.label || col.links.length);
  const socials = (Array.isArray(f.socials) ? f.socials : [])
    .map((s) => str(s))
    .filter(Boolean);
  // URLs run parallel to `socials` (same indices); cap to the glyph count.
  const socialUrls = (Array.isArray(f.socialUrls) ? f.socialUrls : [])
    .map((u) => str(u))
    .slice(0, socials.length);
  return {
    wordmark1: str(f.wordmark1),
    wordmark2: str(f.wordmark2),
    tagline: str(f.tagline),
    socials,
    socialUrls,
    logoUrl: str(f.logoUrl),
    columns,
    copyright: str(f.copyright),
    bottomTagline: str(f.bottomTagline),
    showSocialBottom: bool(f.showSocialBottom),
    newsletter: cleanNewsletter(f.newsletter),
    style: cleanFooterStyle(f.style),
  };
}

/** Validate/normalize the newsletter strip. */
function cleanNewsletter(v: unknown): FooterNewsletter {
  const n = (v ?? {}) as Partial<FooterNewsletter>;
  return {
    show: bool(n.show),
    eyebrow: str(n.eyebrow),
    heading: str(n.heading),
    subtext: str(n.subtext),
    emailPlaceholder: str(n.emailPlaceholder),
    buttonLabel: str(n.buttonLabel),
    disclaimer: str(n.disclaimer),
  };
}

/** Validate/normalize the footer colour + layout overrides. */
function cleanFooterStyle(v: unknown): FooterStyle {
  const s = (v ?? {}) as Partial<FooterStyle>;
  const layouts: FooterStyle["layout"][] = ["4col", "3col", "2col", "centered"];
  return {
    bgColor: hex(s.bgColor),
    textColor: hex(s.textColor),
    layout: layouts.includes(s.layout as FooterStyle["layout"])
      ? (s.layout as FooterStyle["layout"])
      : "4col",
  };
}

const arrOf = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

/** Validate/normalize the full homepage config (all sections). */
function cleanHomepage(v: unknown): HomepageConfig {
  const hp = (v ?? {}) as Partial<HomepageConfig>;
  const h = (hp.hero ?? {}) as Partial<HomeHero>;
  const heroPills: HeroPill[] = arrOf<HeroPill>(h.pills)
    .map((p) => ({ label: str(p?.label), link: str(p?.link) }))
    .filter((p) => p.label);
  const heroCards = (a: unknown): HeroCard[] =>
    arrOf<HeroCard>(a)
      .map((c) => {
        const card: HeroCard = {
          cp: str(c?.cp) || "cp1",
          icon: str(c?.icon),
          title: str(c?.title),
          desc: str(c?.desc),
          link: str(c?.link),
        };
        const image = str(c?.image);
        if (image) card.image = image;
        return card;
      })
      .filter((c) => c.title || c.icon || c.desc || c.image);

  const why = (hp.why ?? {}) as { heading?: unknown; cells?: unknown };
  const wus = (hp.whoUsesUs ?? {}) as { title?: unknown; subtitle?: unknown; personas?: unknown };
  const pp = (hp.popularPrograms ?? {}) as Record<string, unknown>;
  const proof = (hp.socialProof ?? {}) as { title?: unknown; subtitle?: unknown; cards?: unknown; hide?: unknown };
  const cmp = (hp.comparePaths ?? {}) as Record<string, unknown>;
  const reel = (r: unknown) => {
    const s = (r ?? {}) as { title?: unknown; buttonLabel?: unknown; cards?: unknown };
    return {
      title: str(s.title),
      buttonLabel: str(s.buttonLabel),
      cards: arrOf<ReelCard>(s.cards)
        .map((c) => {
          const a = (c?.action ?? {}) as { type?: unknown; value?: unknown };
          const type = ["destination", "category", "outcome", "page"].includes(str(a.type))
            ? (str(a.type) as ReelCard["action"]["type"])
            : "page";
          return {
            action: { type, value: str(a.value) },
            gradient: str(c?.gradient),
            image: str(c?.image),
            emoji: str(c?.emoji),
            tag: str(c?.tag),
            title: str(c?.title),
            count: str(c?.count),
          };
        })
        .filter((c) => c.title || c.emoji),
    };
  };
  const jr = (hp.journal ?? {}) as Record<string, unknown>;

  return {
    hero: {
      h1Main: str(h.h1Main),
      h1Em: str(h.h1Em),
      tagline: str(h.tagline),
      primaryCtaLabel: str(h.primaryCtaLabel),
      secondaryCtaLabel: str(h.secondaryCtaLabel),
      pills: heroPills,
      cards1: heroCards(h.cards1),
      cards2: heroCards(h.cards2),
    },
    why: {
      heading: str(why.heading),
      cells: arrOf<WhyCell>(why.cells)
        .map((c) => ({ emoji: str(c?.emoji), title: str(c?.title), body: str(c?.body) }))
        .filter((c) => c.title || c.body || c.emoji),
    },
    whoUsesUs: {
      title: str(wus.title),
      subtitle: str(wus.subtitle),
      personas: arrOf<Persona>(wus.personas).map((p) => ({
        cls: str(p?.cls),
        key: str(p?.key),
        emoji: str(p?.emoji),
        name: str(p?.name),
        role: str(p?.role),
        pull: str(p?.pull),
        questsTitle: str(p?.questsTitle),
        quests: arrOf<string>(p?.quests).map((q) => str(q)).filter(Boolean),
      })),
    },
    popularPrograms: {
      label: str(pp.label),
      title: str(pp.title),
      subtitle: str(pp.subtitle),
      buttonLabel: str(pp.buttonLabel),
    },
    socialProof: {
      title: str(proof.title),
      subtitle: str(proof.subtitle),
      hide: proof.hide === true,
      cards: arrOf<ProofCard>(proof.cards)
        .map((c) => ({
          outcome: str(c?.outcome),
          quote: str(c?.quote),
          avatarBg: str(c?.avatarBg),
          avatarEmoji: str(c?.avatarEmoji),
          name: str(c?.name),
          detail: str(c?.detail),
        }))
        .filter((c) => c.name || c.quote),
    },
    comparePaths: {
      kicker: str(cmp.kicker),
      title: str(cmp.title),
      copy: str(cmp.copy),
      clearLabel: str(cmp.clearLabel),
      quizLabel: str(cmp.quizLabel),
      cards: arrOf<ComparePathCard>(cmp.cards)
        .map((c, i) => ({
          id: str(c?.id) || `path-${i + 1}`,
          icon: str(c?.icon),
          tag: str(c?.tag),
          name: str(c?.name),
          mini: str(c?.mini),
          score: str(c?.score),
          cost: str(c?.cost),
          time: str(c?.time),
          income: str(c?.income),
          risk: str(c?.risk),
          difficulty: str(c?.difficulty),
          bestFor: str(c?.bestFor),
          firstStep: str(c?.firstStep),
          note: str(c?.note),
        }))
        .filter((c) => c.name),
    },
    destination: reel(hp.destination),
    goals: reel(hp.goals),
    journal: { title: str(jr.title), buttonLabel: str(jr.buttonLabel) },
  };
}

/** Validate/normalize the About page config (all sections; layout fields like
 *  polaroid colours / map positions are preserved as-is). */
function cleanAbout(v: unknown): AboutConfig {
  const a = (v ?? {}) as Partial<AboutConfig>;
  const hero = (a.hero ?? {}) as Partial<AboutConfig["hero"]>;
  const wwd = (a.whatWeDo ?? {}) as Partial<AboutConfig["whatWeDo"]>;
  const paths = (a.paths ?? {}) as Partial<AboutConfig["paths"]>;
  const who = (a.who ?? {}) as Partial<AboutConfig["who"]>;
  const map = (a.map ?? {}) as Partial<AboutConfig["map"]>;
  const hiw = (a.howItWorks ?? {}) as Partial<AboutConfig["howItWorks"]>;
  const why = (a.why ?? {}) as Partial<AboutConfig["why"]>;
  const cta = (a.cta ?? {}) as Partial<AboutConfig["cta"]>;
  return {
    hero: {
      h1: str(hero.h1),
      sub: str(hero.sub),
      ctaLabel: str(hero.ctaLabel),
      polaroids: arrOf<AboutPolaroid>(hero.polaroids).map((p) => ({
        cls: str(p?.cls),
        bg: str(p?.bg),
        color: str(p?.color),
        role: str(p?.role),
        title: [str(p?.title?.[0]), str(p?.title?.[1])],
      })),
    },
    whatWeDo: {
      label: str(wwd.label),
      heading: str(wwd.heading),
      paragraphs: arrOf<string>(wwd.paragraphs).map((s) => str(s)),
      polaroids: arrOf<AboutDecoPolaroid>(wwd.polaroids).map((p) => {
        const pol: AboutDecoPolaroid = {
          cls: str(p?.cls),
          emoji: str(p?.emoji),
          caption: str(p?.caption),
        };
        const image = str(p?.image);
        if (image) pol.image = image;
        return pol;
      }),
    },
    paths: {
      heading: str(paths.heading),
      subtitle: str(paths.subtitle),
      cards: arrOf<AboutPathCard>(paths.cards).map((c) => ({
        page: str(c?.page),
        emoji: str(c?.emoji),
        tag: str(c?.tag),
        title: str(c?.title),
        desc: str(c?.desc),
      })),
    },
    who: {
      heading: str(who.heading),
      cards: arrOf<AboutWhoCard>(who.cards).map((c) => ({
        icon: str(c?.icon),
        title: str(c?.title),
        desc: str(c?.desc),
      })),
    },
    map: {
      heading: str(map.heading),
      cards: arrOf<AboutMapCard>(map.cards).map((c) => ({
        left: str(c?.left),
        top: str(c?.top),
        bg: str(c?.bg),
        ...(c?.color ? { color: str(c.color) } : {}),
        avatarBg: str(c?.avatarBg),
        emoji: str(c?.emoji),
        name: str(c?.name),
        role: str(c?.role),
        desc: str(c?.desc),
        tag: str(c?.tag),
        ...(c?.tagStyle
          ? { tagStyle: { background: str(c.tagStyle.background), color: str(c.tagStyle.color) } }
          : {}),
      })),
      dots: arrOf<AboutLocDot>(map.dots).map((d) => ({ left: str(d?.left), top: str(d?.top), bg: str(d?.bg) })),
    },
    howItWorks: {
      heading: str(hiw.heading),
      steps: arrOf<AboutHiwStep>(hiw.steps).map((s) => ({
        icon: str(s?.icon),
        title: str(s?.title),
        desc: str(s?.desc),
      })),
    },
    why: {
      label: str(why.label),
      heading: str(why.heading),
      items: arrOf<AboutWhyItem>(why.items).map((i) => ({
        badge: str(i?.badge),
        title: str(i?.title),
        desc: str(i?.desc),
      })),
    },
    cta: {
      heading: str(cta.heading),
      subtitle: str(cta.subtitle),
      ctaLabel: str(cta.ctaLabel),
      footnote: str(cta.footnote),
    },
  };
}

/** Validate/normalize the Partner page config (all sections). */
function cleanPartner(v: unknown): PartnerConfig {
  const p = (v ?? {}) as Partial<PartnerConfig>;
  const hero = (p.hero ?? {}) as Partial<PartnerConfig["hero"]>;
  const wwd = (p.whatWeDo ?? {}) as Partial<PartnerConfig["whatWeDo"]>;
  const pw = (p.partnerWith ?? {}) as Partial<PartnerConfig["partnerWith"]>;
  const quote = (p.quote ?? {}) as Partial<PartnerConfig["quote"]>;
  const why = (p.why ?? {}) as Partial<PartnerConfig["why"]>;
  const faq = (p.faq ?? {}) as Partial<PartnerConfig["faq"]>;
  const form = (p.form ?? {}) as Partial<PartnerConfig["form"]>;
  return {
    hero: { headline: str(hero.headline), sub: str(hero.sub), ctaLabel: str(hero.ctaLabel) },
    whatWeDo: {
      label: str(wwd.label),
      heading: str(wwd.heading),
      sub: str(wwd.sub),
      pills: arrOf<string>(wwd.pills).map((s) => str(s)).filter(Boolean),
    },
    partnerWith: {
      heading: str(pw.heading),
      cards: arrOf<PartnerCategory>(pw.cards)
        .map((c) => ({
          bg: str(c?.bg) || "#FFD400",
          color: str(c?.color) || "#161412",
          icon: str(c?.icon),
          title: str(c?.title),
          body: str(c?.body),
        }))
        .filter((c) => c.title || c.body || c.icon),
    },
    quote: { text: str(quote.text), tag: str(quote.tag) },
    why: {
      label: str(why.label),
      heading: str(why.heading),
      cards: arrOf<PartnerWhyCard>(why.cards)
        .map((c) => ({ emoji: str(c?.emoji), title: str(c?.title), body: str(c?.body) }))
        .filter((c) => c.title || c.body),
    },
    faq: {
      emoji: str(faq.emoji),
      label: str(faq.label),
      heading: str(faq.heading),
      items: arrOf<PartnerFaq>(faq.items)
        .map((i) => ({ q: str(i?.q), a: str(i?.a) }))
        .filter((i) => i.q),
    },
    form: {
      emoji: str(form.emoji),
      label: str(form.label),
      heading: str(form.heading),
      sub: str(form.sub),
      nameLabel: str(form.nameLabel),
      companyLabel: str(form.companyLabel),
      websiteLabel: str(form.websiteLabel),
      offeringLabel: str(form.offeringLabel),
      descLabel: str(form.descLabel),
      emailLabel: str(form.emailLabel),
      offerings: arrOf<string>(form.offerings).map((s) => str(s)).filter(Boolean),
      submitLabel: str(form.submitLabel),
      successHeading: str(form.successHeading),
      successBody: str(form.successBody),
    },
  };
}

/** Validate/normalize the FAQ page config (hero + categories + still box). */
function cleanFaq(v: unknown): FaqPageConfig {
  const f = (v ?? {}) as Partial<FaqPageConfig>;
  const hero = (f.hero ?? {}) as Partial<FaqPageConfig["hero"]>;
  const sb = (f.stillBox ?? {}) as Partial<FaqPageConfig["stillBox"]>;
  return {
    hero: { eyebrow: str(hero.eyebrow), title: str(hero.title), em: str(hero.em), sub: str(hero.sub) },
    categories: arrOf<FaqCategory>(f.categories)
      .map((c) => ({
        icon: str(c?.icon),
        title: str(c?.title),
        items: arrOf<{ q: unknown; a: unknown }>(c?.items)
          .map((it) => ({ q: str(it?.q), a: str(it?.a) }))
          .filter((it) => it.q || it.a),
      }))
      .filter((c) => c.title || c.items.length),
    stillBox: {
      heading: str(sb.heading),
      body: str(sb.body),
      buttonLabel: str(sb.buttonLabel),
      modalIcon: str(sb.modalIcon),
      modalTitle: str(sb.modalTitle),
      modalDesc: str(sb.modalDesc),
    },
  };
}

/** Validate/normalize a legal page config (Privacy / Terms). Single rich-HTML
 *  `body` box (the reference admin layout) + hero + contact. */
function cleanLegal(v: unknown): LegalPageConfig {
  const l = (v ?? {}) as Partial<LegalPageConfig>;
  const hero = (l.hero ?? {}) as Partial<LegalPageConfig["hero"]>;
  const contact = (l.contact ?? {}) as Partial<LegalPageConfig["contact"]>;
  return {
    hero: { label: str(hero.label), heading: str(hero.heading), sub: str(hero.sub), lastUpdated: str(hero.lastUpdated) },
    body: String(l.body ?? ""),
    contact: { heading: str(contact.heading), body: str(contact.body), email: str(contact.email) },
  };
}

/** Validate/normalize the Contact page config. */
function cleanContact(v: unknown): ContactConfig {
  const c = (v ?? {}) as Partial<ContactConfig>;
  const hero = (c.hero ?? {}) as Partial<ContactConfig["hero"]>;
  const form = (c.form ?? {}) as Partial<ContactConfig["form"]>;
  const linkTypes: ContactLinkType[] = ["email", "page", "url"];
  return {
    hero: { label: str(hero.label), heading: str(hero.heading), sub: str(hero.sub) },
    cards: arrOf<ContactCard>(c.cards)
      .map((card) => ({
        icon: str(card?.icon),
        title: str(card?.title),
        body: str(card?.body),
        linkType: linkTypes.includes(card?.linkType as ContactLinkType) ? (card!.linkType as ContactLinkType) : "url",
        linkValue: str(card?.linkValue),
        linkLabel: str(card?.linkLabel),
      }))
      .filter((card) => card.title || card.body),
    form: {
      heading: str(form.heading),
      nameLabel: str(form.nameLabel),
      emailLabel: str(form.emailLabel),
      subjectLabel: str(form.subjectLabel),
      messageLabel: str(form.messageLabel),
      namePlaceholder: str(form.namePlaceholder),
      emailPlaceholder: str(form.emailPlaceholder),
      subjectPlaceholder: str(form.subjectPlaceholder),
      messagePlaceholder: str(form.messagePlaceholder),
      submitLabel: str(form.submitLabel),
      successHeading: str(form.successHeading),
      successBody: str(form.successBody),
    },
  };
}

/** Validate the per-category hero overrides (object keyed by category slug). */
function cleanCategoryHeroes(v: unknown): Record<string, CategoryHero> {
  if (!v || typeof v !== "object") return {};
  const out: Record<string, CategoryHero> = {};
  for (const [slug, raw] of Object.entries(v as Record<string, unknown>)) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) continue;
    const h = (raw ?? {}) as Partial<CategoryHero>;
    out[slug] = { label: str(h.label), title: str(h.title), sub: str(h.sub) };
  }
  return out;
}

/**
 * Merge only the page keys present in `body` into the existing `pages` column,
 * so saving one page (each editor sends just its own key) never blanks the
 * others. Unprovided keys keep their stored value.
 */
function mergePages(body: unknown, existing: Record<string, unknown>): Record<string, unknown> {
  const p = (body ?? {}) as Partial<PagesConfig>;
  const hero = (h: Partial<PageHero> | undefined): PageHero => ({
    label: str(h?.label),
    heading: str(h?.heading),
    subtitle: str(h?.subtitle),
  });
  const out: Record<string, unknown> = { ...existing };
  if (p.quests !== undefined) out.quests = hero(p.quests);
  if (p.journal !== undefined) out.journal = hero(p.journal);
  if (p.about !== undefined) out.about = cleanAbout(p.about);
  if (p.partner !== undefined) out.partner = cleanPartner(p.partner);
  if (p.faq !== undefined) out.faq = cleanFaq(p.faq);
  if (p.privacy !== undefined) out.privacy = cleanLegal(p.privacy);
  if (p.terms !== undefined) out.terms = cleanLegal(p.terms);
  if (p.contact !== undefined) out.contact = cleanContact(p.contact);
  if (p.categories !== undefined) out.categories = cleanCategoryHeroes(p.categories);
  return out;
}

/**
 * Validate/normalize the Quiz Builder config (intro + questions + result paths +
 * settings). Structure is admin-defined, so arrays are sanitized and kept; a
 * missing section falls back to the seed defaults.
 */
function cleanQuiz(v: unknown): QuizConfig {
  const q = (v ?? {}) as Partial<QuizConfig>;
  const D = DEFAULT_QUIZ;
  const intro = (q.intro ?? {}) as Partial<QuizIntro>;
  const st = (q.settings ?? {}) as Partial<QuizSettings>;

  const questions: QuizBuilderQuestion[] = Array.isArray(q.questions)
    ? (q.questions as Partial<QuizBuilderQuestion>[])
        .map((qq) => ({
          text: str(qq?.text),
          show: qq?.show !== false,
          options: (Array.isArray(qq?.options) ? qq!.options : ([] as Partial<QuizBuilderOption>[]))
            .map((o) => {
              // Single taxonomy filter (kind + term); migrate the legacy
              // categorySlug/budgetSlug two-filter fields onto it.
              const rawKind = str(o?.filterKind);
              let filterKind: QuizFilterKind =
                rawKind === "category" || rawKind === "budget" || rawKind === "duration" ? rawKind : "";
              let filterSlug = filterKind ? str(o?.filterSlug) : "";
              if (!filterSlug && str(o?.categorySlug)) {
                filterKind = "category";
                filterSlug = str(o?.categorySlug);
              } else if (!filterSlug && str(o?.budgetSlug)) {
                filterKind = "budget";
                filterSlug = str(o?.budgetSlug);
              }
              if (!filterSlug) filterKind = ""; // a kind with no term is not a filter
              return {
                icon: str(o?.icon),
                label: str(o?.label),
                subtext: str(o?.subtext),
                filterKind,
                filterSlug,
              };
            })
            .filter((o) => o.label || o.icon),
        }))
        .filter((qq) => qq.text || qq.options.length)
    : D.questions;

  return {
    intro: {
      show: intro.show !== false,
      headline: str(intro.headline) || D.intro.headline,
      subline: str(intro.subline),
      startCta: str(intro.startCta) || D.intro.startCta,
      slug: str(intro.slug) || D.intro.slug,
    },
    questions,
    settings: {
      status: st.status === "draft" ? "draft" : "published",
      showOnHomepage: st.showOnHomepage !== false,
      showOnQuests: st.showOnQuests !== false,
      progression: st.progression === "all" || st.progression === "snap" ? st.progression : "one",
      resultsDisplay: st.resultsDisplay === "top" || st.resultsDisplay === "all" ? st.resultsDisplay : "top3",
    },
  };
}

/** Validate/normalize the site-wide SEO defaults. */
function cleanSeo(v: unknown): SeoDefaults {
  const s = (v ?? {}) as Partial<SeoDefaults>;
  return {
    titlePattern: str(s.titlePattern).slice(0, 200),
    metaDescription: str(s.metaDescription).slice(0, 320),
    defaultOgImage: str(s.defaultOgImage).slice(0, 500),
    noindex: bool(s.noindex),
  };
}

/** Validate/normalize the public site config (General + Global Copy). */
function cleanSiteConfig(v: unknown): SiteConfig {
  const s = (v ?? {}) as Partial<SiteConfig>;
  const g = (s.general ?? {}) as Partial<SiteConfig["general"]>;
  const c = (s.globalCopy ?? {}) as Partial<SiteConfig["globalCopy"]>;
  const cut = (x: unknown, n: number) => str(x).slice(0, n);
  return {
    general: {
      siteName: cut(g.siteName, 120),
      siteUrl: cut(g.siteUrl, 300),
      timezone: cut(g.timezone, 80),
    },
    globalCopy: {
      questModalHeading: cut(c.questModalHeading, 200),
      questModalSubtext: cut(c.questModalSubtext, 500),
      mqEmptyHeading: cut(c.mqEmptyHeading, 200),
      mqEmptyBody: cut(c.mqEmptyBody, 500),
      mqEmptyCta: cut(c.mqEmptyCta, 120),
      mqFooter: cut(c.mqFooter, 300),
      compareHeading: cut(c.compareHeading, 200),
      compareSubtext: cut(c.compareSubtext, 500),
    },
  };
}

/** Save the site nav + footer + homepage + pages + quiz + seo (single-row upsert). */
export async function PUT(req: Request) {
  const auth = await requireAdminApi();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { sb } = auth;

  const body = await req.json().catch(() => ({}));
  const payload: Record<string, unknown> = { id: 1 };
  if (body.nav !== undefined) payload.nav = cleanNav(body.nav);
  if (body.footer !== undefined) payload.footer = cleanFooter(body.footer);
  if (body.homepage !== undefined) payload.homepage = cleanHomepage(body.homepage);
  if (body.quiz !== undefined) payload.quiz = cleanQuiz(body.quiz);
  if (body.seo !== undefined) payload.seo = cleanSeo(body.seo);
  if (body.settings !== undefined) payload.settings = cleanSiteConfig(body.settings);
  if (body.page_seo !== undefined) payload.page_seo = body.page_seo;
  if (body.pages !== undefined) {
    // Merge into existing pages so a single-page save can't blank the others.
    const { data } = await sb.from("site_settings").select("pages").eq("id", 1).maybeSingle();
    const existing = ((data as { pages?: unknown } | null)?.pages ?? {}) as Record<string, unknown>;
    payload.pages = mergePages(body.pages, existing);
  }

  const { error } = await sb.from("site_settings").upsert(payload, { onConflict: "id" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Invalidate the cached settings data immediately…
  revalidateTag(SITE_SETTINGS_TAG, { expire: 0 });
  // …and the front route cache, so the change shows on the next load instead of
  // being served stale-while-revalidate. Settings drive the whole `(site)` tree
  // (nav/footer + every page), so revalidate the layout, not a single path.
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
