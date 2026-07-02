-- ============================================================================
-- Site settings — a single-row table holding the editable site chrome (the
-- top navigation + the footer) as JSON. Edited from the admin "Nav Menu" and
-- "Footer" pages; read by the public site to render <Nav>/<MobileMenu>/<Footer>.
-- Public read is allowed (it's public chrome); only admins can write.
-- ============================================================================

create table if not exists site_settings (
  id int primary key default 1 check (id = 1),     -- enforce a single row
  nav jsonb not null default '{}',                 -- { links: [...] }
  footer jsonb not null default '{}',              -- { wordmark1, columns, ... }
  updated_at timestamptz not null default now()
);

create trigger trg_site_settings_updated before update on site_settings
  for each row execute function set_updated_at();

alter table site_settings enable row level security;

drop policy if exists "site_settings_public_read" on site_settings;
create policy "site_settings_public_read" on site_settings for select using (true);
drop policy if exists "site_settings_admin_all" on site_settings;
create policy "site_settings_admin_all" on site_settings for all
  using (is_admin()) with check (is_admin());

-- Seed the single row with the site's current nav + footer (so the public site
-- renders identically until an admin edits it).
insert into site_settings (id, nav, footer) values (
  1,
  '{
    "links": [
      { "label": "Quests", "url": "/quests", "target": "_self", "dropdown": [
        { "label": "All Quests", "url": "/quests" },
        { "label": "Work Abroad", "url": "/work-abroad" },
        { "label": "Move Abroad", "url": "/relocate-abroad" },
        { "label": "Get Certified", "url": "/earn-skill" },
        { "label": "Start a Side Hustle", "url": "/side-hustle" },
        { "label": "Start a Business", "url": "/start-business" },
        { "label": "Level Up", "url": "/level-income" }
      ] },
      { "label": "Resources", "url": "/journal", "target": "_self", "dropdown": [
        { "label": "Journal", "url": "/journal" },
        { "label": "FAQ", "url": "/faq" }
      ] },
      { "label": "Company", "url": "/about", "target": "_self", "dropdown": [
        { "label": "About", "url": "/about" },
        { "label": "Partner With Us", "url": "/partner" },
        { "label": "Contact", "url": "/contact" }
      ] }
    ]
  }'::jsonb,
  '{
    "wordmark1": "Side",
    "wordmark2": "Questa",
    "tagline": "Short-term immersive experiences that help you explore a new direction.",
    "socials": ["📷", "♪", "✕", "in"],
    "columns": [
      { "label": "Platform", "links": [
        { "label": "Explore Quests", "url": "/quests" },
        { "label": "Work Abroad", "url": "/work-abroad" },
        { "label": "Partner With Us", "url": "/partner" }
      ] },
      { "label": "Goals", "links": [
        { "label": "Move Abroad", "url": "/relocate-abroad" },
        { "label": "Get Certified", "url": "/earn-skill" },
        { "label": "Start a Business", "url": "/start-business" }
      ] },
      { "label": "More Goals", "links": [
        { "label": "Start a Side Hustle", "url": "/side-hustle" },
        { "label": "Level Up (Upskill)", "url": "/level-income" },
        { "label": "About", "url": "/about" }
      ] },
      { "label": "Legal", "links": [
        { "label": "Terms of Service", "url": "/tos" },
        { "label": "Privacy Policy", "url": "/privacy" }
      ] }
    ],
    "copyright": "© {year} OutQuest. All rights reserved.",
    "bottomTagline": "Built for people who want more."
  }'::jsonb
) on conflict (id) do nothing;
