/**
 * Port of front.js `normalizeCategoryCardDatasets`: fill in any filter
 * dimensions a category card is missing so the sidebar can match it. Derives
 * from sibling dims + the card's text (badge/title/meta), exactly as the runtime
 * did from `card.textContent`. Only fills *missing* keys — present ones win.
 *
 * Needed because some category cards (notably the hard-coded "goal" pages) don't
 * carry every dimension; e.g. none have `outcome`, which the runtime derived
 * from the title so the Wellness/Adventure filter still worked.
 */
export function normalizeSlimData(
  data: Record<string, string>,
  title: string,
  meta: string,
  badge: string,
  pageId: string
): Record<string, string> {
  const d: Record<string, string> = { ...data };
  const text = `${badge} ${title} ${meta}`;
  const t = text.toLowerCase();
  const pageDirection =
    pageId === "work-abroad" || pageId === "relocate-abroad"
      ? "abroad"
      : pageId === "level-income"
        ? "upgrade"
        : "newlife";
  if (!d.direction) d.direction = pageDirection;
  if (!d.level) d.level = pageId === "start-business" || pageId === "level-income" ? "boss" : "starter";
  if (!d.outcome) d.outcome = /surf|ski|harvest|bali|japan|france/i.test(text) ? "adventure" : "wellness";
  if (!d.difficulty)
    d.difficulty = d.commitment === "serious" ? "hard" : d.commitment === "quick" ? "easy" : "moderate";
  if (!d.delivery)
    d.delivery = d.format === "online" ? "online" : d.format === "inperson" ? "inperson" : "remotefriendly";
  if (!d.budgetlevel)
    d.budgetlevel = d.budget === "high" ? "premium" : d.budget === "mid" ? "comfortable" : "lean";
  if (!d.duration)
    d.duration = /ongoing/.test(t)
      ? "ongoing"
      : /long-term|long term/.test(t)
        ? "long"
        : /month|weeks|week/.test(t)
          ? "medium"
          : "short";
  if (!d.location)
    d.location = /france|lisbon|portugal/.test(t)
      ? "europe"
      : /medell|colombia/.test(t)
        ? "latam"
        : /remote|online|worldwide/.test(t)
          ? "remote"
          : "asia";
  return d;
}
