-- ============================================================================
-- Journal scheduled publishing. A scheduled post is saved with visibility
-- 'published' (so it's a real, finished post) plus a future `scheduled_at`
-- timestamp; the public reads gate it out until that moment, so it goes live
-- automatically at the chosen date/time without any cron. NULL = publish
-- immediately (normal behaviour for every existing post).
-- ============================================================================

alter table journal_posts
  add column if not exists scheduled_at timestamptz;
