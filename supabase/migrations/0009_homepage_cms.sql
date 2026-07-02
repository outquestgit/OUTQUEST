-- ============================================================================
-- Homepage CMS — editable home page content stored on the existing single-row
-- site_settings table as JSON. First slice: the Hero block (headline, tagline,
-- CTA labels), edited from the admin "Pages CMS → Homepage → Hero" form and
-- read by the public home page. Empty default ({}) means the public site falls
-- back to the built-in DEFAULT_HOME_HERO until an admin saves.
-- ============================================================================

alter table site_settings
  add column if not exists homepage jsonb not null default '{}';
