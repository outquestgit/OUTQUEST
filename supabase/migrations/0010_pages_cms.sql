-- ============================================================================
-- Pages CMS — editable copy for the simpler standalone pages (currently the
-- Quests / Explore page hero), stored on the single-row site_settings table as
-- JSON. Empty default ({}) means the public site falls back to the built-in
-- DEFAULT_PAGES until an admin saves.
-- ============================================================================

alter table site_settings
  add column if not exists pages jsonb not null default '{}';
