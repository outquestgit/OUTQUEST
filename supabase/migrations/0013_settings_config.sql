-- ============================================================================
-- Admin "Settings" page wiring.
--
-- 1) `site_settings.settings` (jsonb) — PUBLIC config: General (site name / url /
--    timezone) + Global Copy (quest modal, My Quests drawer, Compare modal text).
--    Lives on site_settings because it's publicly read by the front site to
--    render those strings. Edited from Settings → General / Global Copy.
--
-- 2) `admin_config` — PRIVATE config that must NEVER be public: lead-alert email
--    recipients/sender (+ stored SMTP fields) and the session timeout. Separate
--    table with admin-only RLS, since site_settings is world-readable.
-- ============================================================================

alter table site_settings
  add column if not exists settings jsonb not null default '{}';

create table if not exists admin_config (
  id int primary key default 1 check (id = 1),     -- enforce a single row
  email jsonb not null default '{}',               -- { recipients, sender, smtpHost, smtpPort, smtpUser }
  security jsonb not null default '{}',            -- { sessionTimeout }
  updated_at timestamptz not null default now()
);

create trigger trg_admin_config_updated before update on admin_config
  for each row execute function set_updated_at();

alter table admin_config enable row level security;

-- Admin-only for everything — no public read (unlike site_settings).
drop policy if exists "admin_config_admin_all" on admin_config;
create policy "admin_config_admin_all" on admin_config for all
  using (is_admin()) with check (is_admin());

insert into admin_config (id) values (1) on conflict (id) do nothing;
