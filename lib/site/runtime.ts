/**
 * Typed bridge to the front-site runtime (`public/front.js`).
 *
 * Per the project's architecture decision, behaviour is NOT reimplemented in
 * React — the original 2,357-line runtime stays as the single source of truth.
 * It defines a set of global functions (`showPage`, `openQuiz`, the filters,
 * the modals…) that the original markup invoked through inline `onclick`
 * attributes.
 *
 * React strips string `onclick` attributes, so our components call these
 * globals from real `onClick` handlers instead. This module gives those calls
 * static types and a single, greppable place where the runtime surface lives.
 *
 * The runtime is loaded by `<RuntimeScript>` (next/script). Until it has
 * loaded, the globals are undefined; every wrapper here is therefore a no-op
 * guard (`window.fn?.(…)`) so an early click can never throw. In practice the
 * script is in the DOM before the user can interact.
 */

/** A DOM/synthetic event whose `.target` the runtime inspects (bg-click guards). */
type RuntimeEvent = Pick<Event, "target">;

declare global {
  interface Window {
    // Navigation / pages
    showPage(id: string): void;
    showListing(id: string): void;
    openLink(url: string): void;

    // Lead modal
    openModal(icon: string, title: string, desc: string): void;
    openQuestModal(icon: string, title: string, desc: string): void;
    closeModal(): void;
    handleModalBgClick(e: RuntimeEvent): void;
    setContact(type: "wa" | "email"): void;
    submitModal(): void;

    // Share sheet
    openShareSheet(): void;
    closeShareSheet(): void;
    handleShareBgClick(e: RuntimeEvent): void;
    shareWhatsApp(): void;
    shareSMS(): void;
    shareEmail(): void;
    shareNative(): void;
    copyLink(): void;

    // My Quests drawer
    openMQDrawer(): void;
    closeMQDrawer(): void;
    mqToggleSave(id: string, btn: HTMLElement): void;
    mqGoNext(): void;
    mqShareWA(): void;
    mqCopyLink(): void;
    mqSaveAllQuizPaths(): void;

    // Mobile menu
    toggleMobileMenu(): void;
    closeMobileMenu(): void;

    // Lightbox
    openLightbox(startIdx: number): void;
    closeLightbox(): void;
    lbNav(dir: number): void;
    handleLbBg(e: RuntimeEvent): void;

    // Quiz
    openQuiz(): void;
    closeQuiz(): void;
    handleQuizOverlayClick(e: RuntimeEvent): void;
    nextStep(to: number): void;
    selectOpt(el: HTMLElement): void;
    selectMulti(el: HTMLElement): void;
    showQuizResults(): void;
    retakeQuiz(): void;
    sqCompareQuizMatches(): void;
    sqClearCompare(): void;

    // Category / quest filters
    toggleCatFilter(btn: HTMLElement): void;
    clearCatFilters(page: string): void;
    toggleFilter(btn: HTMLElement): void;
    clearAllFilters(): void;
    filterByOutcome(outcomeVal: string): void;
    filterByDestination(locationVal: string): void;

    // FAQ / accordions
    togglePartnerFaq(el: HTMLElement): void;
    toggleOffering(el: HTMLElement): void;

    // Blog / deals
    openBlogPost(postId: string): void;
    closeBlogPost(): void;
    closeDealPage(): void;

    // Forms / misc
    handleNewsletter(btn: HTMLElement): void;
    submitPartnerForm(): void;
    wusTogglePersona(key: string): void;
    wusKeyToggle(e: Event, key: string): void;
  }
}

/**
 * Calls a runtime global by name, guarding against it not being loaded yet.
 * Keeping one indirection point means the `window.fn?.()` guard lives in a
 * single place and every wrapper below reads cleanly.
 */
function call<K extends keyof Window>(
  name: K,
  ...args: Parameters<Extract<Window[K], (...a: never[]) => unknown>>
): void {
  if (typeof window === "undefined") return;
  const fn = window[name] as ((...a: unknown[]) => unknown) | undefined;
  if (typeof fn === "function") fn(...(args as unknown[]));
}

// Navigation. On a standalone route (e.g. /quests/[slug]) the SPA's `.page`
// elements aren't in the DOM, so a plain showPage() would be a no-op. In that
// case we deep-link back into the single-page app via `?p=` (handled by
// FrontBoot on load); on the SPA itself it toggles the page in place as before.
export const showPage = (id: string) => {
  if (typeof document !== "undefined" && !document.getElementById(`page-${id}`)) {
    window.location.href = `/?p=${encodeURIComponent(id)}`;
    return;
  }
  call("showPage", id);
};
export const showListing = (id: string) => call("showListing", id);
export const openLink = (url: string) => call("openLink", url);

/**
 * Navigate from an admin-authored nav/footer link `url`. External URLs
 * (http/https) open in a tab; internal paths map to an SPA page id — `/quests`
 * → `quests`, `/` or "" → `home` — and route via `showPage` (which deep-links
 * with `?p=` when that page isn't mounted on the current route).
 */
export const navigateTo = (url: string, target?: "_self" | "_blank") => {
  const u = (url ?? "").trim();
  if (/^https?:\/\//i.test(u)) {
    if (typeof window !== "undefined") window.open(u, target === "_blank" ? "_blank" : "_self");
    return;
  }
  const id = u.replace(/^\/+/, "").replace(/\/+$/, "") || "home";
  showPage(id);
};

/**
 * The canonical href for an admin-authored nav/footer `url`. Used so links can
 * render as real anchors — making right-click "Open in new tab", ⌘/Ctrl-click,
 * and middle-click work — while a plain left click is still intercepted for SPA
 * soft-navigation. External URLs and `mailto:`/`tel:`/`#` pass through; internal
 * paths normalise to a leading-slash route (`""`/`"/"` → `"/"`), mirroring the
 * id→route mapping `navigateTo` uses.
 */
export const internalHref = (url: string): string => {
  const u = (url ?? "").trim();
  if (!u) return "/";
  if (/^(https?:\/\/|mailto:|tel:|#)/i.test(u)) return u;
  const id = u.replace(/^\/+/, "").replace(/\/+$/, "");
  return id ? `/${id}` : "/";
};

// Lead modal
export const openModal = (icon: string, title: string, desc: string) =>
  call("openModal", icon, title, desc);
export const openQuestModal = (icon: string, title: string, desc: string) =>
  call("openQuestModal", icon, title, desc);
export const closeModal = () => call("closeModal");
export const handleModalBgClick = (e: RuntimeEvent) => call("handleModalBgClick", e);
export const setContact = (type: "wa" | "email") => call("setContact", type);
export const submitModal = () => call("submitModal");

// Share sheet
export const openShareSheet = () => call("openShareSheet");
export const closeShareSheet = () => call("closeShareSheet");
export const handleShareBgClick = (e: RuntimeEvent) => call("handleShareBgClick", e);
export const shareWhatsApp = () => call("shareWhatsApp");
export const shareSMS = () => call("shareSMS");
export const shareEmail = () => call("shareEmail");
export const shareNative = () => call("shareNative");
export const copyLink = () => call("copyLink");

// My Quests drawer
export const openMQDrawer = () => call("openMQDrawer");
export const closeMQDrawer = () => call("closeMQDrawer");
export const mqToggleSave = (id: string, btn: HTMLElement) => call("mqToggleSave", id, btn);
export const mqGoNext = () => call("mqGoNext");
export const mqShareWA = () => call("mqShareWA");
export const mqCopyLink = () => call("mqCopyLink");
export const mqSaveAllQuizPaths = () => call("mqSaveAllQuizPaths");

// Mobile menu
export const toggleMobileMenu = () => call("toggleMobileMenu");
export const closeMobileMenu = () => call("closeMobileMenu");

// Lightbox
export const openLightbox = (startIdx: number) => call("openLightbox", startIdx);
export const closeLightbox = () => call("closeLightbox");
export const lbNav = (dir: number) => call("lbNav", dir);
export const handleLbBg = (e: RuntimeEvent) => call("handleLbBg", e);

// Quiz
export const openQuiz = () => call("openQuiz");
export const closeQuiz = () => call("closeQuiz");
export const handleQuizOverlayClick = (e: RuntimeEvent) => call("handleQuizOverlayClick", e);
export const nextStep = (to: number) => call("nextStep", to);
export const selectOpt = (el: HTMLElement) => call("selectOpt", el);
export const selectMulti = (el: HTMLElement) => call("selectMulti", el);
export const showQuizResults = () => call("showQuizResults");
export const retakeQuiz = () => call("retakeQuiz");
export const sqCompareQuizMatches = () => call("sqCompareQuizMatches");
export const sqClearCompare = () => call("sqClearCompare");

// Filters
export const toggleCatFilter = (btn: HTMLElement) => call("toggleCatFilter", btn);
export const clearCatFilters = (page: string) => call("clearCatFilters", page);
export const toggleFilter = (btn: HTMLElement) => call("toggleFilter", btn);
export const clearAllFilters = () => call("clearAllFilters");
export const filterByOutcome = (outcomeVal: string) => call("filterByOutcome", outcomeVal);
export const filterByDestination = (locationVal: string) =>
  call("filterByDestination", locationVal);

// FAQ / accordions
export const togglePartnerFaq = (el: HTMLElement) => call("togglePartnerFaq", el);
export const toggleOffering = (el: HTMLElement) => call("toggleOffering", el);

// Blog / deals
export const openBlogPost = (postId: string) => call("openBlogPost", postId);
export const closeBlogPost = () => call("closeBlogPost");
export const closeDealPage = () => call("closeDealPage");

// Forms / misc
export const handleNewsletter = (btn: HTMLElement) => call("handleNewsletter", btn);
export const submitPartnerForm = () => call("submitPartnerForm");
export const wusTogglePersona = (key: string) => call("wusTogglePersona", key);
export const wusKeyToggle = (e: Event, key: string) => call("wusKeyToggle", e, key);
