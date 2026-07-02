-- ============================================================================
-- Remember the timezone a post was scheduled in. `scheduled_at` is always an
-- absolute UTC moment (so it publishes at the right instant everywhere), but to
-- show the schedule back as the wall-clock time the author actually picked, we
-- also store that zone's offset in minutes east of UTC (e.g. 330 = UTC+5:30,
-- 480 = UTC+8). NULL = not scheduled / unknown → fall back to the viewer's zone.
-- ============================================================================

alter table journal_posts
  add column if not exists scheduled_tz integer;
