import { slugify } from "./forms";

export const TAXONOMY_KINDS = [
  "category",
  "country",
  "budget",
  "duration",
  "difficulty",
  "delivery",
  "life_direction",
  "outcome_goal",
  "journal_category",
] as const;

export type TaxKind = (typeof TAXONOMY_KINDS)[number];

/** Kinds whose terms auto-generate a public landing page. */
export const TAX_PAGE_PREFIX: Partial<Record<TaxKind, string>> = {
  country: "/locations/",
  outcome_goal: "/outcomes/",
};

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Validate/normalize a taxonomy term payload (shared by create + update). */
export function parseTaxonomyInput(
  body: Record<string, unknown>
): { error: string } | { kind: TaxKind; name: string; slug: string } {
  const kind = String(body.kind ?? "") as TaxKind;
  const name = String(body.name ?? "").trim();
  let slug = String(body.slug ?? "").trim();
  if (!slug && name) slug = slugify(name);
  if (!(TAXONOMY_KINDS as readonly string[]).includes(kind))
    return { error: "Unknown taxonomy." };
  if (!name) return { error: "Name is required." };
  if (!SLUG_RE.test(slug))
    return { error: "Slug must be lowercase letters, numbers and hyphens." };
  return { kind, name, slug };
}
