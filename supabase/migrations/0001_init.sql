-- ============================================================================
-- GetSetGo — initial schema
-- B2B directory: industries -> business models -> listings, plus CMS pages,
-- FAQ, leads. UUID primary keys (never exposed to FE), unique editable slugs
-- for routing, visibility states, Row Level Security, image alt-text enforced.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---- Enums -----------------------------------------------------------------
do $$ begin
  create type visibility_status as enum
    ('draft','published','hidden','coming_soon','featured','archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type lead_status as enum ('new','contacted','qualified','closed');
exception when duplicate_object then null; end $$;

-- Visibility values that are shown to the public.
create or replace function is_public_visibility(v visibility_status)
returns boolean language sql immutable as $$
  select v in ('published','coming_soon','featured');
$$;

-- updated_at trigger helper
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ---- Profiles / admin role -------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'user',          -- 'user' | 'admin'
  created_at timestamptz not null default now()
);

create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- ---- Industries ------------------------------------------------------------
create table if not exists industries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  seo_title text,
  meta_description text,
  h1 text,
  intro text,
  og_image_url text,
  visibility visibility_status not null default 'draft',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---- Business models (scoped to an industry) -------------------------------
create table if not exists business_models (
  id uuid primary key default gen_random_uuid(),
  industry_id uuid not null references industries(id) on delete cascade,
  slug text not null,
  name text not null,
  description text,
  seo_title text,
  meta_description text,
  h1 text,
  intro text,
  og_image_url text,
  visibility visibility_status not null default 'draft',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (industry_id, slug)
);

-- ---- Product categories (multi-select on listings, self-nesting) -----------
create table if not exists product_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  parent_id uuid references product_categories(id) on delete set null,
  visibility visibility_status not null default 'published',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---- Listings --------------------------------------------------------------
create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  company_name text not null,
  industry_id uuid references industries(id) on delete set null,
  business_model_id uuid references business_models(id) on delete set null,
  location text,
  made_in text,
  years_in_operation int,
  description text,
  production_time text,
  capabilities text[] not null default '{}',
  moq_min int,
  moq_max int,
  certifications text[] not null default '{}',
  tags text[] not null default '{}',
  -- SEO (admin-controlled, no hardcoded head tags on the FE)
  seo_title text,
  meta_description text,
  h1 text,
  intro text,
  og_image_url text,
  visibility visibility_status not null default 'draft',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists listings_industry_idx on listings(industry_id);
create index if not exists listings_model_idx on listings(business_model_id);
create index if not exists listings_visibility_idx on listings(visibility);

-- Private contact info — NEVER shown publicly (admin-only via RLS).
create table if not exists listing_contacts (
  listing_id uuid primary key references listings(id) on delete cascade,
  website text,
  email text,
  phone text
);

-- Listing <-> product categories (multi tick)
create table if not exists listing_product_categories (
  listing_id uuid references listings(id) on delete cascade,
  product_category_id uuid references product_categories(id) on delete cascade,
  primary key (listing_id, product_category_id)
);

-- Images — alt text is MANDATORY (reject empty).
create table if not exists listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  storage_path text not null,
  alt_text text not null check (length(trim(alt_text)) > 0),
  width int,
  height int,
  format text,                         -- 'avif' | 'webp' | ...
  is_logo boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists listing_images_listing_idx on listing_images(listing_id);

-- ---- CMS pages + FAQ -------------------------------------------------------
create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,           -- 'home' | 'about' | 'how-it-works' | 'faq'
  title text,
  seo_title text,
  meta_description text,
  h1 text,
  intro text,
  og_image_url text,
  content jsonb not null default '{}',
  visibility visibility_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists faq_items (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references pages(id) on delete cascade,
  question text not null,
  answer text not null,
  visibility visibility_status not null default 'published',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---- Leads -----------------------------------------------------------------
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete set null,
  name text not null,
  email text,
  phone text,
  contact_pref text,                   -- 'email' | 'wa'
  timeline text,
  message text,
  status lead_status not null default 'new',
  assigned_supplier text,
  ip inet,
  created_at timestamptz not null default now()
);
create index if not exists leads_listing_idx on leads(listing_id);
create index if not exists leads_created_idx on leads(created_at desc);

-- ---- updated_at triggers ---------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['industries','business_models','listings','pages']
  loop
    execute format(
      'drop trigger if exists trg_%1$s_updated on %1$s;
       create trigger trg_%1$s_updated before update on %1$s
       for each row execute function set_updated_at();', t);
  end loop;
end $$;

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table profiles enable row level security;
alter table industries enable row level security;
alter table business_models enable row level security;
alter table product_categories enable row level security;
alter table listings enable row level security;
alter table listing_contacts enable row level security;
alter table listing_product_categories enable row level security;
alter table listing_images enable row level security;
alter table pages enable row level security;
alter table faq_items enable row level security;
alter table leads enable row level security;

-- Public read of visible content + admin full CRUD.
do $$
declare t text;
begin
  foreach t in array array[
    'industries','business_models','product_categories',
    'listings','pages','faq_items'
  ]
  loop
    execute format('drop policy if exists "%1$s_public_read" on %1$s;', t);
    execute format(
      'create policy "%1$s_public_read" on %1$s for select
       using (is_public_visibility(visibility) or is_admin());', t);
    execute format('drop policy if exists "%1$s_admin_all" on %1$s;', t);
    execute format(
      'create policy "%1$s_admin_all" on %1$s for all
       using (is_admin()) with check (is_admin());', t);
  end loop;
end $$;

-- Images have no own visibility column — they follow their parent listing.
drop policy if exists "listing_images_public_read" on listing_images;
create policy "listing_images_public_read" on listing_images for select
  using (
    exists (select 1 from listings l where l.id = listing_id
            and (is_public_visibility(l.visibility) or is_admin()))
  );
drop policy if exists "listing_images_admin_all" on listing_images;
create policy "listing_images_admin_all" on listing_images for all
  using (is_admin()) with check (is_admin());

-- Join table follows its parent listing's visibility for public reads.
drop policy if exists "lpc_public_read" on listing_product_categories;
create policy "lpc_public_read" on listing_product_categories for select
  using (
    exists (select 1 from listings l where l.id = listing_id
            and (is_public_visibility(l.visibility) or is_admin()))
  );
drop policy if exists "lpc_admin_all" on listing_product_categories;
create policy "lpc_admin_all" on listing_product_categories for all
  using (is_admin()) with check (is_admin());

-- Private contacts: admin only.
drop policy if exists "contacts_admin_all" on listing_contacts;
create policy "contacts_admin_all" on listing_contacts for all
  using (is_admin()) with check (is_admin());

-- Profiles: a user sees their own row; admins see all.
drop policy if exists "profiles_self_read" on profiles;
create policy "profiles_self_read" on profiles for select
  using (id = auth.uid() or is_admin());

-- Leads: public may INSERT (subject to app-level reCAPTCHA + rate limit),
-- but only admins may read/update/delete. Direct inserts are typically done by
-- the service-role client after validation, so this anon policy is a fallback.
drop policy if exists "leads_public_insert" on leads;
create policy "leads_public_insert" on leads for insert with check (true);
drop policy if exists "leads_admin_read" on leads;
create policy "leads_admin_read" on leads for select using (is_admin());
drop policy if exists "leads_admin_write" on leads;
create policy "leads_admin_write" on leads for update using (is_admin()) with check (is_admin());
drop policy if exists "leads_admin_delete" on leads;
create policy "leads_admin_delete" on leads for delete using (is_admin());

-- ============================================================================
-- Storage: public-read image bucket, admin-only writes.
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('listings', 'listings', true)
on conflict (id) do nothing;

drop policy if exists "listings_images_public_read" on storage.objects;
create policy "listings_images_public_read" on storage.objects for select
  using (bucket_id = 'listings');

drop policy if exists "listings_images_admin_write" on storage.objects;
create policy "listings_images_admin_write" on storage.objects for all
  using (bucket_id = 'listings' and is_admin())
  with check (bucket_id = 'listings' and is_admin());
