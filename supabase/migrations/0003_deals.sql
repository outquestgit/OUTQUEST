-- ============================================================================
-- Deals / Marketplace vertical
-- enums / is_admin() / is_public_visibility() / set_updated_at() are defined in
-- 0001_init.sql. Deals are linked to quests via deal_quests (the admin "Connected
-- Quests" field) — that link drives the quest page's Programs/Get-Set-Up/Tools
-- sections and the marketplace.
-- ============================================================================

create table if not exists deals (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,                  -- routes at /deals/[slug]
  title text not null,
  category text,                              -- programs | setup | tools
  badge text,                                 -- e.g. "Top Pick", "Free Resource"
  partner_name text,                          -- hero label
  short_desc text,                            -- card + hero description
  -- Hero / card appearance
  hero_icon text,
  hero_bg text,                               -- gradient
  card_icon text,
  card_color text,
  card_image_path text,
  featured_image_path text,
  -- Offer box
  offer_label text,
  offer_price text,                           -- free-text price line on the deal page
  price_from numeric,                         -- structured price (editor)
  billing_unit text,
  outcome_text text,                          -- shown as the offer "saving" line
  cta_label text,                             -- claim/book button label
  action_type text,                           -- book_url | affiliate | form | …
  book_url text,
  affiliate_url text,
  -- Body content
  what_is text,
  who_for text,
  why_useful text,
  requirements jsonb not null default '[]',   -- string[]
  checklist jsonb not null default '[]',      -- string[] ("what you get")
  cta_heading text,                           -- final CTA heading
  cta_subtext text,
  -- Flags + SEO
  verified boolean not null default false,
  featured boolean not null default false,
  seo_title text,
  meta_description text,
  og_image_url text,
  visibility visibility_status not null default 'draft',
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_deals_updated before update on deals
  for each row execute function set_updated_at();

-- M2M: a deal's "Connected Quests" (drives the quest page deal sections).
create table if not exists deal_quests (
  deal_id uuid not null references deals(id) on delete cascade,
  quest_id uuid not null references quests(id) on delete cascade,
  primary key (deal_id, quest_id)
);

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table deals enable row level security;
alter table deal_quests enable row level security;

drop policy if exists "deals_public_read" on deals;
create policy "deals_public_read" on deals for select
  using (is_public_visibility(visibility) or is_admin());
drop policy if exists "deals_admin_all" on deals;
create policy "deals_admin_all" on deals for all
  using (is_admin()) with check (is_admin());

drop policy if exists "deal_quests_public_read" on deal_quests;
create policy "deal_quests_public_read" on deal_quests for select
  using (
    exists (select 1 from deals d where d.id = deal_id
            and (is_public_visibility(d.visibility) or is_admin()))
  );
drop policy if exists "deal_quests_admin_all" on deal_quests;
create policy "deal_quests_admin_all" on deal_quests for all
  using (is_admin()) with check (is_admin());

-- ── Seed (mirrors the front.js DEALS map; connected to the ski-season quest) ─
insert into deals (slug, title, category, badge, partner_name, short_desc, hero_icon, hero_bg,
  card_icon, card_color, offer_label, offer_price, outcome_text, cta_label, action_type, book_url,
  what_is, who_for, why_useful, requirements, checklist, cta_heading, cta_subtext,
  verified, featured, visibility, display_order)
values
  ('hubba','Hubba Co-working 3-Month Membership','programs','Popular','Hubba Bangkok',
   'Bangkok''s most vibrant co-working network — 12 locations, daily hot desks, and a community of 3,000+ founders and remote workers.',
   '🏢','linear-gradient(160deg,#1A2740,#243B5E,#1E3A5F)','🏢','#243B5E',
   'OutQuest exclusive','3 months for $189','Save 30% vs. walk-in rate','Claim offer','book_url','https://hubba.co',
   'Hubba is Bangkok''s largest co-working network with 12 locations. This 3-month membership gives unlimited hot desk access, 8 hrs/month private room credits, and free event access.',
   'Remote workers, freelancers, and digital nomads who want a reliable workspace and instant community.',
   'When you first arrive in Bangkok your workspace is a big unknown. A Hubba membership solves that on day one — professional setup, fast internet, and a built-in community.',
   '["Valid passport for registration","Payment via card or bank transfer","No prior co-working experience needed"]'::jsonb,
   '["Unlimited hot desk at 12 Bangkok locations","8 hrs/month private room credits","Free weekly nomad and founder meetups","Fast WiFi (1Gbps), printing, free coffee","Locker storage and phone booths","24/7 access at select locations"]'::jsonb,
   'Your desk in Bangkok is waiting.','Join 3,000+ members already building in Bangkok.',
   true,true,'published',1),

  ('ski-jacket','All-Mountain Ski Jacket & Shell Layers','tools','Gear Pick','REI Co-op',
   'Premium waterproof outerwear for the Japanese backcountry — built for Hokkaido powder days.',
   '🎿','linear-gradient(160deg,#1B3A5A,#2E6A9A,#5BA3D9)','🎿','#2E6A9A',
   'OutQuest pick','From $189 at REI','Free shipping on orders over $50','Shop Deal','affiliate','https://www.rei.com',
   'A complete layering system for ski-season workers: a waterproof hardshell, a warm mid layer, and a moisture-wicking base layer.',
   'Anyone doing a ski season in Japan or any cold-weather destination.',
   'Showing up to Niseko without proper layers is the most common rookie mistake. Buying before you leave means you''re comfortable from day one.',
   '["Any fitness level — no experience required","Check airline baggage allowance for bulky gear","Budget $300–$600 for a full layering system"]'::jsonb,
   '["Waterproof hardshell (rated 10k+ mm)","Insulated mid layer for sub-zero days","Merino wool base layers","Ski-specific fit","Packable options for travel","Rated for -15°C and below"]'::jsonb,
   'Gear up before the season starts.','Stock sells out fast for popular sizes. Order before October.',
   true,false,'published',2),

  ('japan-wifi','Japan Pocket WiFi — 6-Month Plan','setup','Top Pick','Sakura Mobile',
   'Unlimited-data pocket WiFi for long-stay visitors — reliable 4G LTE even in mountain resort towns.',
   '📶','linear-gradient(160deg,#1A3A0A,#2A7A1A,#50C050)','📶','#2A7A1A',
   'OutQuest pick','From ¥3,480/month','Free delivery to your Japan address','Get Connected','book_url','https://www.sakuramobile.jp',
   'Sakura Mobile is the most popular WiFi provider among long-stay foreign workers in Japan. Devices work on Japan''s fast 4G network with unlimited data.',
   'Seasonal workers and remote workers living in Japan for 2–6 months who need reliable internet beyond café WiFi.',
   'Mountain resort towns often have weak café WiFi. A pocket WiFi device means you can work from the staff dorm, the car, or the lodge.',
   '["Japan address or hotel for delivery","Credit or debit card for billing","Smartphone or laptop to use as receiver"]'::jsonb,
   '["Unlimited 4G LTE data","Works across all of Japan incl. Hokkaido","Multiple simultaneous devices","Free delivery in Japan","English support","Month-to-month, cancel anytime"]'::jsonb,
   'Stay connected on the mountain.','Order in advance — delivery takes 3–5 days after arrival.',
   true,false,'published',3),

  ('worldnomads','Long-Stay Travel Insurance — 6 Months','setup','Recommended','World Nomads',
   'Comprehensive travel and health insurance built for ski seasons and long-term adventures — adventure sports included.',
   '🏥','linear-gradient(160deg,#3A0A1A,#7A1A3A,#C03060)','🏥','#7A1A3A',
   'OutQuest partner','From $8/day','Adventure sports included at no extra cost','Get Covered','affiliate','https://www.worldnomads.com',
   'World Nomads'' Explorer plan covers medical evacuation, ski accidents, trip cancellation, and gear theft — the things most likely to go wrong on an extended trip.',
   'Anyone on a ski season, surf placement, or trip longer than 30 days who wants peace of mind.',
   'A single helicopter evacuation from a Japanese mountain costs $30,000+. World Nomads is the one product that pays out for adventure sports without hidden exclusions.',
   '["Purchase before leaving home","Age limit: under 66 for most plans","Pre-existing conditions may not be covered"]'::jsonb,
   '["Emergency medical and hospital cover","Medical evacuation","Ski and winter sports","Surf and water sports","Trip cancellation","Gear cover up to $3,000"]'::jsonb,
   'Don''t skip the insurance.','The one time you need it makes it worth every dollar.',
   true,false,'published',4),

  ('japan-visa-guide','Working Holiday Visa Guide — Japan','tools','Free Resource','OutQuest',
   'The complete step-by-step guide to applying for a Japan Working Holiday Visa.',
   '🗺️','linear-gradient(160deg,#3A1A0A,#7A3A0A,#C06020)','🗺️','#7A3A0A',
   'OutQuest exclusive','Free — no email required','Updated April 2026','Read Guide','book_url','#',
   'Japan''s Working Holiday Visa is available to citizens of 30+ countries aged 18–30. This guide walks through the full application process.',
   'Anyone aged 18–30 from an eligible country who wants to legally work a ski season in Japan.',
   'The WHV process is straightforward but poorly documented in English. This guide eliminates the guesswork.',
   '["Age 18–30 at application","Citizen of an eligible country","Valid passport with 6+ months remaining"]'::jsonb,
   '["Check country eligibility","Required documents checklist","How to apply at the consulate","Processing time expectations","What to do on arrival","How to extend your stay"]'::jsonb,
   'Start your Japan visa process today.','Most applications are approved within 1–2 weeks when submitted correctly.',
   false,false,'published',5),

  ('power-bank','Portable Power Bank + Travel Adapter','tools','Essential Gear','Amazon',
   'A high-capacity power bank (20,000mAh+) and universal adapter bundle for keeping devices charged across Japan''s resorts.',
   '💻','linear-gradient(160deg,#1A1A4A,#3A3A8A,#6060C0)','💻','#3A3A8A',
   'OutQuest pick','From $34 on Amazon','Ships internationally','Shop Deal','affiliate','https://www.amazon.com',
   'A 20,000mAh power bank gives 3–4 full phone charges. Paired with a universal adapter for Japan''s Type A plugs, it covers every charging situation.',
   'Travellers heading to Japan who need to stay powered up in transit and where outlets are limited.',
   'Resort staff dorms often have limited outlets. A high-capacity power bank means you''re never hunting for a socket.',
   '["TSA carry-on rules apply (under 100Wh)","Check airline policy on large power banks","USB-C cable required"]'::jsonb,
   '["20,000mAh capacity minimum","USB-C Power Delivery for laptops","Universal adapter (Type A/B/C/G/I)","Japan-compatible 100V input","Lightweight for carry-on","TSA approved"]'::jsonb,
   'Stay powered up from day one.','Order before you fly — Japanese electronics are pricier.',
   false,false,'published',6)
on conflict (slug) do nothing;

-- Connect the seeded deals to the ski-season quest (powers its deal sections).
insert into deal_quests (deal_id, quest_id)
select d.id, q.id from deals d
  cross join quests q
  where q.slug = 'japan-ski-season'
    and d.slug in ('hubba','ski-jacket','japan-wifi','worldnomads','japan-visa-guide','power-bank')
on conflict do nothing;
