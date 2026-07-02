-- ============================================================================
-- Quiz CMS — editable "Find My Path" quiz content stored on the existing
-- single-row site_settings table as JSON. Editable: the 5 questions' text, each
-- option's icon/label/description, the results header, and the quiz status &
-- settings. The option `q`/`val` scoring keys and step structure are NOT stored
-- (they stay locked in code) so quest scoring can never be broken. Empty default
-- ({}) means the public quiz falls back to the built-in DEFAULT_QUIZ until an
-- admin saves.
-- ============================================================================

alter table site_settings
  add column if not exists quiz jsonb not null default '{}';
