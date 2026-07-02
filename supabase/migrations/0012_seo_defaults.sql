-- ============================================================================
-- Site-wide SEO defaults stored on the single-row site_settings table as JSON:
-- meta title pattern, default OG image, and a site-wide noindex toggle. Edited
-- from the admin "Settings → SEO Defaults" form and applied as fallbacks by
-- lib/seo.ts buildMetadata across every page. Empty default ({}) means the
-- built-in DEFAULT_SEO_DEFAULTS are used until an admin saves.
-- ============================================================================

alter table site_settings
  add column if not exists seo jsonb not null default '{}';
