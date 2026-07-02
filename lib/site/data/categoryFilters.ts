/**
 * The filter sidebar shown on every category page. Identical across all six
 * pages in the source (only the `data-catpage` attribute differs, which the
 * `<CategoryPage>` injects), so it lives here once. `filter`/`value` are read
 * by the runtime's `toggleCatFilter` / `applyCatFilters`.
 */
export interface CatFilterPill {
  filter: string;
  value: string;
  label: string;
}

export interface CatFilterGroup {
  label: string;
  /** Whether the pills render with the `qf-pills-grid` layout. */
  grid: boolean;
  pills: CatFilterPill[];
}

export const categoryFilterGroups: CatFilterGroup[] = [
  {
    label: "Life Direction",
    grid: true,
    pills: [
      { filter: "direction", value: "abroad", label: "Move Abroad" },
      { filter: "direction", value: "newlife", label: "New Life" },
      { filter: "direction", value: "upgrade", label: "Upgrade" },
    ],
  },
  {
    // Single `outcome` dimension, generated from the Outcome Goal taxonomy (the
    // static pills below are a fallback for when no terms exist).
    label: "Outcome Goal",
    grid: true,
    pills: [
      { filter: "outcome", value: "starter", label: "Learn a skill" },
      { filter: "outcome", value: "boss", label: "Build a portfolio" },
      { filter: "outcome", value: "epic", label: "Explore a path" },
      { filter: "outcome", value: "dip", label: "Gain experience" },
      { filter: "outcome", value: "seasonal", label: "Meet people" },
      { filter: "outcome", value: "wellness", label: "Wellness" },
      { filter: "outcome", value: "adventure", label: "Adventure" },
    ],
  },
  {
    label: "Difficulty",
    grid: true,
    pills: [
      { filter: "difficulty", value: "easy", label: "Easy" },
      { filter: "difficulty", value: "moderate", label: "Moderate" },
      { filter: "difficulty", value: "hard", label: "Hard" },
    ],
  },
  {
    label: "Delivery Mode",
    grid: true,
    pills: [
      { filter: "delivery", value: "inperson", label: "In person" },
      { filter: "delivery", value: "remotefriendly", label: "Remote-friendly" },
      { filter: "delivery", value: "online", label: "Online" },
    ],
  },
  {
    label: "Budget",
    grid: true,
    pills: [
      { filter: "budgetlevel", value: "lean", label: "Lean ($)" },
      { filter: "budgetlevel", value: "comfortable", label: "Comfortable ($$)" },
      { filter: "budgetlevel", value: "premium", label: "Premium ($$$)" },
    ],
  },
  {
    label: "Duration",
    grid: true,
    pills: [
      { filter: "duration", value: "short", label: "Under 2 months" },
      { filter: "duration", value: "medium", label: "2–6 months" },
      { filter: "duration", value: "long", label: "Long-term" },
      { filter: "duration", value: "ongoing", label: "Ongoing" },
    ],
  },
  {
    label: "Location",
    grid: true,
    pills: [
      { filter: "location", value: "asia", label: "Asia" },
      { filter: "location", value: "europe", label: "Europe" },
      { filter: "location", value: "latam", label: "Latin America" },
      { filter: "location", value: "remote", label: "Remote / Anywhere" },
    ],
  },
];

/** Front filter key → taxonomy kind, for the groups generated from live terms. */
const DYNAMIC_GROUP_KIND: Record<string, string> = {
  direction: "life_direction",
  outcome: "outcome_goal",
  difficulty: "difficulty",
  delivery: "delivery",
  budgetlevel: "budget",
  duration: "duration",
  location: "country",
};

/**
 * Build the directory category-page filter groups, swapping each taxonomy-backed
 * group (Life Direction, Outcome Goal, Difficulty/Effort, Delivery, Budget,
 * Duration, Location/country) for pills built from the live active terms —
 * `value` = term slug (matches the card's `data-*`), `label` = term name. A kind
 * with no active terms keeps that group's static pills.
 */
export function buildCategoryFilterGroups(
  active: Record<string, { slug: string; name: string }[]>
): CatFilterGroup[] {
  return categoryFilterGroups.map((g) => {
    const filterKey = g.pills[0]?.filter;
    const kind = filterKey ? DYNAMIC_GROUP_KIND[filterKey] : undefined;
    const terms = kind ? active[kind] : undefined;
    if (!filterKey || !terms || terms.length === 0) return g;
    return { ...g, pills: terms.map((t) => ({ filter: filterKey, value: t.slug, label: t.name })) };
  });
}

/**
 * The second category-sidebar variant (abroad / life / upgrade pages). It uses
 * the "Reset" direction labels, renders the first two groups without the grid
 * layout, and filters budget under `budget` (not `budgetlevel`).
 */
export const altCategoryFilterGroups: CatFilterGroup[] = [
  {
    label: "Life Direction",
    grid: false,
    pills: [
      { filter: "direction", value: "abroad", label: "Career Reset" },
      { filter: "direction", value: "newlife", label: "Identity Reset" },
      { filter: "direction", value: "upgrade", label: "Purpose Reset" },
      { filter: "direction", value: "all", label: "Lifestyle Reset" },
    ],
  },
  {
    label: "Outcome Goal",
    grid: false,
    pills: [
      { filter: "level", value: "starter", label: "Learn a skill" },
      { filter: "level", value: "boss", label: "Build a portfolio" },
      { filter: "level", value: "epic", label: "Explore a path" },
      { filter: "commitment", value: "dip", label: "Gain experience" },
      { filter: "commitment", value: "seasonal", label: "Meet people" },
      { filter: "outcome", value: "wellness", label: "Wellness" },
      { filter: "outcome", value: "adventure", label: "Adventure" },
    ],
  },
  {
    label: "Difficulty",
    grid: true,
    pills: [
      { filter: "difficulty", value: "easy", label: "Easy" },
      { filter: "difficulty", value: "moderate", label: "Moderate" },
      { filter: "difficulty", value: "hard", label: "Hard" },
    ],
  },
  {
    label: "Delivery Mode",
    grid: true,
    pills: [
      { filter: "delivery", value: "inperson", label: "In person" },
      { filter: "delivery", value: "remotefriendly", label: "Remote-friendly" },
      { filter: "delivery", value: "online", label: "Online" },
    ],
  },
  {
    label: "Budget",
    grid: true,
    pills: [
      { filter: "budget", value: "lean", label: "Lean ($)" },
      { filter: "budget", value: "comfortable", label: "Comfortable ($$)" },
      { filter: "budget", value: "premium", label: "Premium ($$$)" },
    ],
  },
  {
    label: "Duration",
    grid: true,
    pills: [
      { filter: "duration", value: "short", label: "Under 2 months" },
      { filter: "duration", value: "medium", label: "2–6 months" },
      { filter: "duration", value: "long", label: "Long-term" },
      { filter: "duration", value: "ongoing", label: "Ongoing" },
    ],
  },
  {
    label: "Location",
    grid: true,
    pills: [
      { filter: "location", value: "asia", label: "Asia" },
      { filter: "location", value: "europe", label: "Europe" },
      { filter: "location", value: "latam", label: "Latin America" },
      { filter: "location", value: "remote", label: "Remote / Anywhere" },
    ],
  },
];
