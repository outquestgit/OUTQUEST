/**
 * Typed bridge to the admin runtime (`public/admin.js`).
 *
 * Same architecture decision as the front site (`lib/site/runtime.ts`):
 * behaviour is NOT reimplemented in React. The original admin runtime stays the
 * single source of truth — it defines the global functions the reference markup
 * invoked through inline `onclick` / `oninput` / … attributes.
 *
 * React strips string event attributes, so the admin components call these
 * globals from real handlers (`onClick={() => nav("deals-list")}`) instead.
 * This module gives those calls static types and one greppable place where the
 * runtime surface lives.
 *
 * The runtime is loaded by `<AdminBoot>`. Until it loads the globals are
 * undefined; every wrapper is therefore a no-op guard so an early interaction
 * can never throw. In practice the script is in the DOM before the user can act.
 */

declare global {
  interface Window {
    // Navigation / sidebar
    nav(page: string): void;
    toggleTax(): void;
    togglePagesCms(): void;

    // Generic repeaters / item add+remove
    addItem(repeaterId: string, label: string): void;
    removeItem(el: Element | null): void;
    addRequirement(): void;
    addIncluded(): void;
    addStep(): void;
    addUnlock(): void;
    addPrepCard(): void;
    addPathStep(): void;
    addFAQ(): void;
    addFaqQ(catId: string): void;
    addJournalCategory(): void;
    addNavLink(): void;
    addFooterColumn(): void;
    addFooterLink(el: HTMLElement): void;
    addEmbarkStep(): void;
    removeEmbarkStep(el: HTMLElement): void;
    addBKFField(): void;
    addLCFField(): void;

    // Status pills / toggles
    setStatus(groupId: string, status: string, el: HTMLElement): void;
    setPcmsStatus(el: HTMLElement, status: string): void;
    setDealCategory(el: HTMLElement): void;
    updateFeaturedState(el: HTMLElement): void;
    toggleSchedFields(el: HTMLElement): void;
    toggleDatePicker(which: string): void;
    dpShift(which: string, dir: number): void;
    confirmSchedule(): void;
    togglePw(inputId: string, iconId: string): void;
    togglePwField(inputId: string, el: HTMLElement): void;

    // Tabs
    switchTab(tabsId: string, panelsId: string, idx: number): void;
    extSwitchTab(tabsId: string, panelsId: string, idx: number): void;
    switchActionTypeCard(el: HTMLElement, type: string): void;
    switchBookingPayType(type: string): void;

    // Deal / quest card editor (ext*)
    extToggleRel(el: HTMLElement, chipsId: string): void;
    extFilterList(el: HTMLElement, listId: string, rowClass: string): void;
    extSyncColorInput(el: HTMLElement, colorId: string, mockId: string): void;
    extUpdateCardBg(el: HTMLElement, mockId: string): void;
    extUpdateCardIcon(el: HTMLElement, mockId: string): void;
    extPreviewCardImg(el: HTMLElement, mockId: string): void;
    extToggleFeaturedBadge(el: HTMLElement, badgeId: string): void;
    extToggleHideBadge(el: HTMLElement, badgeId: string): void;

    // Quest selector
    filterQuestSelector(): void;
    selectAllFilteredQuests(): void;

    // SEO / SERP previews + counters
    autoSlug(srcId: string, dstId: string): void;
    updateSeoCounter(el: HTMLElement, countId: string, max: number): void;
    updateQuestSerpTitle(): void;
    updateQuestSerpDesc(): void;
    syncDealSerp(): void;
    syncJournalSerp(): void;
    syncDealIndexBadge(): void;
    updateJournalSeo(el: HTMLElement): void;
    updateJournalSeoDesc(el: HTMLElement): void;
    updateBookingPreview(): void;
    updateDealBtnPreview(el: HTMLElement): void;
    updateFinalCtaPreview(): void;

    // Rich-text editors
    fmt(cmd: string, arg?: string): void;
    rteCmd(cmd: string, arg?: string): void;
    rteFloatCmd(cmd: string, arg?: string): void;
    rteFloatImage(): void;
    rteFloatLink(): void;
    applyBlockFormat(tag: string, areaId: string): void;
    legalExec(areaId: string, cmd: string): void;
    legalHeading(areaId: string, tag: string): void;
    legalLink(areaId: string): void;
    insertLink(): void;
    openLinkModal(areaId: string): void;
    closeLinkModal(): void;
    handleRteImage(el: HTMLElement, areaId: string): void;
    handleRteKeydown(e: KeyboardEvent): void;

    // Leads
    closeLead(): void;

    // PagesCMS
    togglePcmsSection(el: HTMLElement): void;
    deletePcmsSection(el: HTMLElement): void;
    deletePcmsInlineCard(el: HTMLElement, cardId: string): void;
    dismissSocial(id: string): void;
    restoreAllSocial(): void;
    previewBrandAsset(el: HTMLElement, previewId: string, areaId: string): void;

    // Quiz builder
    qbAddQuestion(): void;
    qbAddResult(): void;
    qbPreviewNav(view: string): void;
    qbUpdatePreview(): void;
    qbSave(status?: string): void;
    qbReset(): void;

    // Misc
    showToast(msg: string): void;
  }
}

/**
 * Calls a runtime global by name, guarding against it not being loaded yet, so
 * the `window.fn?.()` guard lives in one place and the wrappers read cleanly.
 */
function call<K extends keyof Window>(
  name: K,
  ...args: Parameters<Extract<Window[K], (...a: never[]) => unknown>>
): void {
  if (typeof window === "undefined") return;
  const fn = window[name] as ((...a: unknown[]) => unknown) | undefined;
  if (typeof fn === "function") fn(...(args as unknown[]));
}

// Navigation / sidebar
export const nav = (page: string) => call("nav", page);
export const toggleTax = () => call("toggleTax");
export const togglePagesCms = () => call("togglePagesCms");

// Repeaters
export const addItem = (repeaterId: string, label: string) => call("addItem", repeaterId, label);
export const removeItem = (el: Element | null) => call("removeItem", el);
export const addRequirement = () => call("addRequirement");
export const addIncluded = () => call("addIncluded");
export const addStep = () => call("addStep");
export const addUnlock = () => call("addUnlock");
export const addPrepCard = () => call("addPrepCard");
export const addPathStep = () => call("addPathStep");
export const addFAQ = () => call("addFAQ");
export const addFaqQ = (catId: string) => call("addFaqQ", catId);
export const addJournalCategory = () => call("addJournalCategory");
export const addNavLink = () => call("addNavLink");
export const addFooterColumn = () => call("addFooterColumn");
export const addFooterLink = (el: HTMLElement) => call("addFooterLink", el);
export const addEmbarkStep = () => call("addEmbarkStep");
export const removeEmbarkStep = (el: HTMLElement) => call("removeEmbarkStep", el);
export const addBKFField = () => call("addBKFField");
export const addLCFField = () => call("addLCFField");

// Status / toggles
export const setStatus = (groupId: string, status: string, el: HTMLElement) =>
  call("setStatus", groupId, status, el);
export const setPcmsStatus = (el: HTMLElement, status: string) => call("setPcmsStatus", el, status);
export const setDealCategory = (el: HTMLElement) => call("setDealCategory", el);
export const updateFeaturedState = (el: HTMLElement) => call("updateFeaturedState", el);
export const toggleSchedFields = (el: HTMLElement) => call("toggleSchedFields", el);
export const toggleDatePicker = (which: string) => call("toggleDatePicker", which);
export const dpShift = (which: string, dir: number) => call("dpShift", which, dir);
export const confirmSchedule = () => call("confirmSchedule");
export const togglePw = (inputId: string, iconId: string) => call("togglePw", inputId, iconId);
export const togglePwField = (inputId: string, el: HTMLElement) => call("togglePwField", inputId, el);

// Tabs
export const switchTab = (tabsId: string, panelsId: string, idx: number) =>
  call("switchTab", tabsId, panelsId, idx);
export const extSwitchTab = (tabsId: string, panelsId: string, idx: number) =>
  call("extSwitchTab", tabsId, panelsId, idx);
export const switchActionTypeCard = (el: HTMLElement, type: string) =>
  call("switchActionTypeCard", el, type);
export const switchBookingPayType = (type: string) => call("switchBookingPayType", type);

// Card editor (ext*)
export const extToggleRel = (el: HTMLElement, chipsId: string) => call("extToggleRel", el, chipsId);
export const extFilterList = (el: HTMLElement, listId: string, rowClass: string) =>
  call("extFilterList", el, listId, rowClass);
export const extSyncColorInput = (el: HTMLElement, colorId: string, mockId: string) =>
  call("extSyncColorInput", el, colorId, mockId);
export const extUpdateCardBg = (el: HTMLElement, mockId: string) => call("extUpdateCardBg", el, mockId);
export const extUpdateCardIcon = (el: HTMLElement, mockId: string) =>
  call("extUpdateCardIcon", el, mockId);
export const extPreviewCardImg = (el: HTMLElement, mockId: string) =>
  call("extPreviewCardImg", el, mockId);
export const extToggleFeaturedBadge = (el: HTMLElement, badgeId: string) =>
  call("extToggleFeaturedBadge", el, badgeId);
export const extToggleHideBadge = (el: HTMLElement, badgeId: string) =>
  call("extToggleHideBadge", el, badgeId);

// Quest selector
export const filterQuestSelector = () => call("filterQuestSelector");
export const selectAllFilteredQuests = () => call("selectAllFilteredQuests");

// SEO / previews
export const autoSlug = (srcId: string, dstId: string) => call("autoSlug", srcId, dstId);
export const updateSeoCounter = (el: HTMLElement, countId: string, max: number) =>
  call("updateSeoCounter", el, countId, max);
export const updateQuestSerpTitle = () => call("updateQuestSerpTitle");
export const updateQuestSerpDesc = () => call("updateQuestSerpDesc");
export const syncDealSerp = () => call("syncDealSerp");
export const syncJournalSerp = () => call("syncJournalSerp");
export const syncDealIndexBadge = () => call("syncDealIndexBadge");
export const updateJournalSeo = (el: HTMLElement) => call("updateJournalSeo", el);
export const updateJournalSeoDesc = (el: HTMLElement) => call("updateJournalSeoDesc", el);
export const updateBookingPreview = () => call("updateBookingPreview");
export const updateDealBtnPreview = (el: HTMLElement) => call("updateDealBtnPreview", el);
export const updateFinalCtaPreview = () => call("updateFinalCtaPreview");

// Rich-text editors
export const fmt = (cmd: string, arg?: string) => call("fmt", cmd, arg);
export const rteCmd = (cmd: string, arg?: string) => call("rteCmd", cmd, arg);
export const rteFloatCmd = (cmd: string, arg?: string) => call("rteFloatCmd", cmd, arg);
export const rteFloatImage = () => call("rteFloatImage");
export const rteFloatLink = () => call("rteFloatLink");
export const applyBlockFormat = (tag: string, areaId: string) => call("applyBlockFormat", tag, areaId);
export const legalExec = (areaId: string, cmd: string) => call("legalExec", areaId, cmd);
export const legalHeading = (areaId: string, tag: string) => call("legalHeading", areaId, tag);
export const legalLink = (areaId: string) => call("legalLink", areaId);
export const insertLink = () => call("insertLink");
export const openLinkModal = (areaId: string) => call("openLinkModal", areaId);
export const closeLinkModal = () => call("closeLinkModal");
export const handleRteImage = (el: HTMLElement, areaId: string) => call("handleRteImage", el, areaId);
export const handleRteKeydown = (e: KeyboardEvent) => call("handleRteKeydown", e);

// Leads
export const closeLead = () => call("closeLead");

// PagesCMS
export const togglePcmsSection = (el: HTMLElement) => call("togglePcmsSection", el);
export const deletePcmsSection = (el: HTMLElement) => call("deletePcmsSection", el);
export const deletePcmsInlineCard = (el: HTMLElement, cardId: string) =>
  call("deletePcmsInlineCard", el, cardId);
export const dismissSocial = (id: string) => call("dismissSocial", id);
export const restoreAllSocial = () => call("restoreAllSocial");
export const previewBrandAsset = (el: HTMLElement, previewId: string, areaId: string) =>
  call("previewBrandAsset", el, previewId, areaId);

// Quiz builder
export const qbAddQuestion = () => call("qbAddQuestion");
export const qbAddResult = () => call("qbAddResult");
export const qbPreviewNav = (view: string) => call("qbPreviewNav", view);
export const qbUpdatePreview = () => call("qbUpdatePreview");
export const qbSave = (status?: string) => call("qbSave", status);
export const qbReset = () => call("qbReset");

// Misc
export const showToast = (msg: string) => call("showToast", msg);
