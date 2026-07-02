-- ============================================================================
-- GetSetGo / OutQuest — quests domain
-- Backs the /admin "Quests" section and the public quest pages. Reuses the
-- enums / is_admin() / is_public_visibility() / set_updated_at() defined in
-- 0001_init.sql. UUID PKs (never exposed), unique editable slugs for routing,
-- visibility + Row Level Security, taxonomy terms as the shared filter
-- dimensions, quest<->term M2M, gallery images with mandatory alt text.
-- ============================================================================

-- ---- Taxonomy terms (the 9 filter dimensions; some auto-generate pages) -----
create table if not exists taxonomy_terms (
  id uuid primary key default gen_random_uuid(),
  -- category|country|budget|duration|difficulty|delivery|life_direction|outcome_goal|journal_category
  kind text not null,
  slug text not null,
  name text not null,
  active boolean not null default true,
  sort_order int not null default 0,
  -- when set, each term auto-generates a landing page, e.g. '/locations/'
  generates_page_prefix text,
  created_at timestamptz not null default now(),
  unique (kind, slug)
);
create index if not exists taxonomy_terms_kind_idx on taxonomy_terms(kind);

-- ---- Quests -----------------------------------------------------------------
create table if not exists quests (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,                 -- routes at /quests/[slug]
  title text not null,
  tagline text,
  level text,                                -- card badge: Starter/Epic/Boss Quest, Legendary

  -- Display labels (free text shown in the front-end info bar)
  timeline_label text,
  difficulty_label text,
  budget_label text,                         -- e.g. '$$ Mid Budget'
  monthly_budget text,                       -- e.g. '$1,200 – $2,200'
  best_time text,
  location_label text,
  duration text,                             -- e.g. '3–5 Months'

  -- Card appearance
  card_icon text,                            -- emoji
  card_color text,                           -- hex bg when no image
  card_gradient text,                        -- gradient bg used on listing cards
  card_image_path text,                      -- storage path (overrides icon/gradient)
  featured_image_path text,

  -- Detail media + content blocks (kept as JSON: slides[], arts[], unlocks[],
  -- immersive, path[], embark[], prep[], faq[], included[], requirements[])
  slides jsonb not null default '[]',
  arts jsonb not null default '[]',
  content jsonb not null default '{}',

  -- SEO (admin-controlled; no hardcoded head tags on the FE)
  seo_title text,
  meta_description text,
  h1 text,
  canonical_url text,
  og_image_url text,

  -- Flags
  visibility visibility_status not null default 'draft',
  featured boolean not null default false,
  hide_frontend boolean not null default false,
  display_order int not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists quests_visibility_idx on quests(visibility);
create index if not exists quests_order_idx on quests(display_order);

-- ---- Quest <-> taxonomy term (single- and multi-selects) --------------------
create table if not exists quest_terms (
  quest_id uuid references quests(id) on delete cascade,
  term_id uuid references taxonomy_terms(id) on delete cascade,
  primary key (quest_id, term_id)
);
create index if not exists quest_terms_term_idx on quest_terms(term_id);

-- ---- Quest gallery images (alt text mandatory) ------------------------------
create table if not exists quest_images (
  id uuid primary key default gen_random_uuid(),
  quest_id uuid not null references quests(id) on delete cascade,
  storage_path text not null,
  alt_text text not null check (length(trim(alt_text)) > 0),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists quest_images_quest_idx on quest_images(quest_id);

-- ---- updated_at trigger -----------------------------------------------------
drop trigger if exists trg_quests_updated on quests;
create trigger trg_quests_updated before update on quests
  for each row execute function set_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table taxonomy_terms enable row level security;
alter table quests enable row level security;
alter table quest_terms enable row level security;
alter table quest_images enable row level security;

-- Taxonomy terms: public sees active terms; admin sees/edits all.
drop policy if exists "taxonomy_public_read" on taxonomy_terms;
create policy "taxonomy_public_read" on taxonomy_terms for select
  using (active or is_admin());
drop policy if exists "taxonomy_admin_all" on taxonomy_terms;
create policy "taxonomy_admin_all" on taxonomy_terms for all
  using (is_admin()) with check (is_admin());

-- Quests: public sees publicly-visible, non-hidden quests; admin sees/edits all.
drop policy if exists "quests_public_read" on quests;
create policy "quests_public_read" on quests for select
  using ((is_public_visibility(visibility) and not hide_frontend) or is_admin());
drop policy if exists "quests_admin_all" on quests;
create policy "quests_admin_all" on quests for all
  using (is_admin()) with check (is_admin());

-- quest_terms + quest_images follow their parent quest for public reads.
drop policy if exists "quest_terms_public_read" on quest_terms;
create policy "quest_terms_public_read" on quest_terms for select
  using (
    exists (select 1 from quests q where q.id = quest_id
            and ((is_public_visibility(q.visibility) and not q.hide_frontend) or is_admin()))
  );
drop policy if exists "quest_terms_admin_all" on quest_terms;
create policy "quest_terms_admin_all" on quest_terms for all
  using (is_admin()) with check (is_admin());

drop policy if exists "quest_images_public_read" on quest_images;
create policy "quest_images_public_read" on quest_images for select
  using (
    exists (select 1 from quests q where q.id = quest_id
            and ((is_public_visibility(q.visibility) and not q.hide_frontend) or is_admin()))
  );
drop policy if exists "quest_images_admin_all" on quest_images;
create policy "quest_images_admin_all" on quest_images for all
  using (is_admin()) with check (is_admin());

-- ============================================================================
-- Storage: public-read quest image bucket, admin-only writes.
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('quests', 'quests', true)
on conflict (id) do nothing;

drop policy if exists "quests_images_public_read" on storage.objects;
create policy "quests_images_public_read" on storage.objects for select
  using (bucket_id = 'quests');
drop policy if exists "quests_images_admin_write" on storage.objects;
create policy "quests_images_admin_write" on storage.objects for all
  using (bucket_id = 'quests' and is_admin())
  with check (bucket_id = 'quests' and is_admin());

-- ============================================================================
-- Seed taxonomy terms (from the admin reference TAX_DATA)
-- ============================================================================
insert into taxonomy_terms (kind, slug, name, active, sort_order, generates_page_prefix) values
  ('category','move-abroad','Move Abroad',true,1,null),
  ('category','level-up','Level Up',true,2,null),
  ('category','try-a-new-life','Try a New Life',true,3,null),

  ('country','indonesia','Indonesia',true,1,'/locations/'),
  ('country','japan','Japan',true,2,'/locations/'),
  ('country','nepal','Nepal',true,3,'/locations/'),
  ('country','morocco','Morocco',true,4,'/locations/'),
  ('country','thailand','Thailand',true,5,'/locations/'),
  ('country','portugal','Portugal',true,6,'/locations/'),

  ('budget','under-500','Under $500',true,1,null),
  ('budget','500-1000','$500–$1000',true,2,null),
  ('budget','1000-2000','$1000–$2000',true,3,null),
  ('budget','2000-plus','$2000+',false,4,null),

  ('duration','weekend','Weekend (1–3d)',true,1,null),
  ('duration','short','Short (4–7d)',true,2,null),
  ('duration','medium','Medium (8–14d)',true,3,null),
  ('duration','long','Long (15d+)',true,4,null),

  ('difficulty','easy','Easy',true,1,null),
  ('difficulty','moderate','Moderate',true,2,null),
  ('difficulty','challenging','Challenging',true,3,null),
  ('difficulty','expert','Expert',false,4,null),

  ('delivery','self-guided','Self-guided',true,1,null),
  ('delivery','group-tour','Group tour',true,2,null),
  ('delivery','private-guided','Private guided',true,3,null),

  ('life_direction','career-reset','Career Reset',true,1,null),
  ('life_direction','identity-reset','Identity Reset',true,2,null),
  ('life_direction','purpose-reset','Purpose Reset',true,3,null),
  ('life_direction','lifestyle-reset','Lifestyle Reset',true,4,null),

  ('outcome_goal','learn-a-skill','Learn a skill',true,1,'/outcomes/'),
  ('outcome_goal','build-a-portfolio','Build a portfolio',true,2,'/outcomes/'),
  ('outcome_goal','explore-a-path','Explore a path',true,3,'/outcomes/'),
  ('outcome_goal','gain-experience','Gain experience',true,4,'/outcomes/'),
  ('outcome_goal','meet-people','Meet people',true,5,'/outcomes/'),
  ('outcome_goal','wellness','Wellness',true,6,'/outcomes/'),
  ('outcome_goal','adventure','Adventure',true,7,'/outcomes/'),

  ('journal_category','travel-tips','Travel Tips',true,1,null),
  ('journal_category','guides','Guides',true,2,null),
  ('journal_category','budget-travel','Budget Travel',true,3,null),
  ('journal_category','stories','Stories',false,4,null)
on conflict (kind, slug) do nothing;

-- ============================================================================
-- Seed a couple of sample quests so the admin list/editor render
-- ============================================================================
insert into quests (slug, title, tagline, level, duration, monthly_budget, budget_label,
  best_time, location_label, card_icon, card_color, card_gradient, visibility, featured, display_order,
  seo_title, meta_description)
values
  ('japan-ski-season','Work a ski season in Japan',
   'Live at altitude, earn your keep on the slopes, and spend your days in powder.',
   'Epic Quest','3–5 Months','$1,200 – $2,200','$$ Mid Budget','Nov – Mar','Hokkaido, Japan',
   '🏔️','#0A2A44','linear-gradient(170deg,#0A2A44,#1A5A8A,#4ABCD4)','featured',true,1,
   'Work a Ski Season in Japan — OutQuest',
   'Live and work a winter season in Hokkaido. Visa, housing, jobs and the full roadmap.'),
  ('bali-surf-instructor','Live as a surf instructor in Bali',
   'Teach beginners by morning, explore rice terraces by afternoon.',
   'Boss Quest','1–6 Months','$800 – $1,400','$ Lean Budget','Apr – Oct','Bali, Indonesia',
   '🏄','#1A0A2E','linear-gradient(170deg,#1A0A2E,#5A2A8A,#E060A0)','published',false,2,
   'Become a Surf Instructor in Bali — OutQuest',
   'Get certified and teach surf in Bali. Visa, certification, housing and costs explained.')
on conflict (slug) do nothing;

-- Tag the sample quests with taxonomy terms (idempotent).
insert into quest_terms (quest_id, term_id)
select q.id, t.id from quests q join taxonomy_terms t on true
where (q.slug='japan-ski-season' and (t.kind,t.slug) in
        (('country','japan'),('category','try-a-new-life'),('difficulty','challenging'),
         ('life_direction','identity-reset'),('outcome_goal','gain-experience'),('outcome_goal','adventure')))
   or (q.slug='bali-surf-instructor' and (t.kind,t.slug) in
        (('country','indonesia'),('category','try-a-new-life'),('difficulty','moderate'),
         ('life_direction','identity-reset'),('outcome_goal','learn-a-skill'),('outcome_goal','wellness')))
on conflict do nothing;
