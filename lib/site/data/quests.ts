/**
 * The All-Quests browse page filter sidebar. Distinct from the category-page
 * filters: it uses `toggleFilter` (global, no `data-catpage`) and its first two
 * groups render as plain `qf-pills` (not the `qf-pills-grid` layout).
 */
export interface QuestFilterPill {
  filter: string;
  value: string;
  label: string;
}

export interface QuestFilterGroup {
  label: string;
  /** Whether the pills use the `qf-pills-grid` layout. */
  grid: boolean;
  pills: QuestFilterPill[];
}

export const questFilterGroups: QuestFilterGroup[] = [
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
    // Single `outcome` dimension, generated from the Outcome Goal taxonomy (the
    // static pills below are a fallback for when no terms exist).
    label: "Outcome Goal",
    grid: false,
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
    label: "Effort",
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
 * Build the quest-page filter groups, swapping each taxonomy-backed group (Life
 * Direction, Outcome Goal, Effort/difficulty, Delivery, Budget, Duration,
 * Location/country) for pills generated from the live active terms — `value` =
 * term slug (matches the card's `data-*`), `label` = term name. A kind with no
 * active terms falls back to that group's static pills.
 */
export function buildQuestFilterGroups(
  active: Record<string, { slug: string; name: string }[]>
): QuestFilterGroup[] {
  return questFilterGroups.map((g) => {
    const filterKey = g.pills[0]?.filter;
    const kind = filterKey ? DYNAMIC_GROUP_KIND[filterKey] : undefined;
    const terms = kind ? active[kind] : undefined;
    if (!filterKey || !terms || terms.length === 0) return g;
    return { ...g, pills: terms.map((t) => ({ filter: filterKey, value: t.slug, label: t.name })) };
  });
}
