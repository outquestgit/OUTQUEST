/**
 * Site-wide SEO defaults (admin-editable, Settings → SEO Defaults). Applied by
 * `buildMetadata` as fallbacks across every page:
 * - `titlePattern` wraps each page title ({title} is replaced),
 * - `metaDescription` is the default meta/OG description (homepage + any page
 *   without its own),
 * - `defaultOgImage` is the OG/social image when an item has none,
 * - `noindex` flips the whole site to noindex (e.g. while staging).
 */
export interface SeoDefaults {
  titlePattern: string;
  metaDescription: string;
  defaultOgImage: string;
  noindex: boolean;
}

export const DEFAULT_SEO_DEFAULTS: SeoDefaults = {
  titlePattern: "",
  metaDescription:
    "Your GPS for programs, opportunities and paths for the unconventional.",
  defaultOgImage: "",
  noindex: false,
};
