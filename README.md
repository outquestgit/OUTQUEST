# OutQuest — GetSetGo App

Marketing + content site and admin CMS for **OutQuest**: a catalogue of immersive short‑term "quests" (experiences), partner **deals**, a **journal** (blog), a quiz, lead‑capture forms, and a fully self‑service **admin dashboard** that drives every piece of front‑site content.

> **Read this first:** `AGENTS.md` / `CLAUDE.md` note that this repo pins **Next.js 16**, which has breaking changes vs. older App Router conventions. When in doubt, consult the bundled docs in `node_modules/next/dist/docs/` rather than assuming pre‑16 behaviour.

---

## Table of contents

1. [Project overview](#project-overview)
2. [Tech stack & versions](#tech-stack--versions)
3. [Folder structure](#folder-structure)
4. [Installation & local setup](#installation--local-setup)
5. [Environment variables](#environment-variables)
6. [Build & deployment](#build--deployment)
7. [Application architecture & data flow](#application-architecture--data-flow)
8. [Database overview](#database-overview)
9. [API endpoints](#api-endpoints)
10. [Third‑party integrations](#third-party-integrations)
11. [Search, filters, email, caching & error handling](#search-filters-email-caching--error-handling)
12. [Reusable components](#reusable-components)
13. [Known issues, technical debt & troubleshooting](#known-issues-technical-debt--troubleshooting)

---

## Project overview

- **Front site** (`app/(site)`): public marketing pages — home, quests listing + detail, category pages, deals, journal, about, partner, contact, FAQ, legal (privacy/terms), and a quiz. Server‑rendered from the database, with a legacy client runtime (`public/front.js`) layered on top for SPA‑style navigation and interactive behaviour (see [architecture](#application-architecture--data-flow)).
- **Admin CMS** (`app/admin`): a single‑document dashboard where an authenticated admin edits **all** front‑site content — quests, deals, journal posts, taxonomy, homepage sections, per‑page content, quiz builder, footer/nav, SEO defaults, site settings, and leads.
- **Suppliers directory** (`app/(directory)`): a secondary B2B directory feature (industries → business models → suppliers/listings). Separate layout and tables.

Essentially everything a visitor sees is **admin‑editable and stored in Supabase**; the React code ships sensible defaults (`lib/site/data/*`) that are used until the DB overrides them.

---

## Tech stack & versions

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js (App Router) | `16.2.9` |
| UI | React / React DOM | `19.2.4` |
| Language | TypeScript | `^5` |
| Backend / DB | Supabase (Postgres + Auth + Storage + RLS) | `@supabase/supabase-js ^2.108.1`, `@supabase/ssr ^0.12.0` |
| Transactional email / lists | Brevo (REST API) | — |
| SMTP fallback | nodemailer | `^9.0.1` |
| Bot protection | Google reCAPTCHA v3 | — |
| Analytics | Google Analytics (GA4) | — |
| Lint | ESLint + `eslint-config-next` | `^9` / `16.2.9` |
| E2E (dev only) | Playwright | `^1.60.0` |
| Runtime | Node.js | **20+** (required by Next 16; `@types/node ^20`) |
| Package manager | npm | `package-lock.json` present |
| Hosting | Vercel | prod: `https://get-set-go-app.vercel.app` |

Scripts (`package.json`):

```bash
npm run dev     # next dev  — local dev server (http://localhost:3000)
npm run build   # next build — production build
npm run start   # next start — serve the production build
npm run lint    # eslint
```

---

## Folder structure

```
app/
  layout.tsx              # Root layout; async generateMetadata() pulls title/SEO/favicon from DB
  (site)/                 # Public marketing site (route group)
    layout.tsx            #   loads public/front.js runtime (FrontBoot) + site chrome
    quests/  [category]/  deals/  journal/  about/  partner/  contact/  faq/
    privacy/  tos/  ...    #   plus category aliases (move-abroad, level-up, life, …)
  (directory)/            # Suppliers directory feature (industry/model/listing)
  admin/                  # Admin CMS (gated)
    page.tsx              #   the big single-document dashboard (assembles all sections)
    login/ forgot/ reset/ auth/callback/   # Supabase auth flows
    *Bridge.tsx           #   client "bridges" that wire ported/raw sections to the DB
  api/
    admin/                # Authenticated CRUD (quests, deals, journal, taxonomy,
                          #   site-settings, config, email, password, leads, upload)
    leads/ contact/ partner/ newsletter/   # Public form submissions

components/
  site/    (cards, chrome, overlays, pages, sections, state, ui)   # front-site React
  admin/   (layout, pages, pages/pcms, ui)                          # admin React

lib/
  supabase/   (server, client, public, admin)   # 4 Supabase client factories
  site/data/*                                    # default content + config (fallbacks)
  quests.ts deals.ts journal.ts siteSettings.ts  # cached DB readers (unstable_cache)
  auth.ts  origin.ts  brevo.ts  smtp.ts  notify.ts
  rateLimit.ts  recaptcha.ts  sanitize.ts  formGuard.ts  seo.ts
  admin/*                                        # admin payload builders + runtime helpers

supabase/migrations/      # 0001 … 0017 SQL migrations (source of truth for schema + seed)
proxy.ts                  # Next 16 middleware (renamed) — auth gate for /admin + /api/admin
next.config.ts            # image formats + Supabase Storage remote patterns
public/front.js           # legacy front-site runtime (still loaded by (site) layout)
_reference/               # original HTML/JS references the admin is transcribed from
```

---

## Installation & local setup

1. **Prerequisites:** Node.js 20+, npm, and a Supabase project.
2. **Install:**
   ```bash
   npm install
   ```
3. **Configure env:** copy `.env.example` → `.env.local` and fill in the values (see [Environment variables](#environment-variables)).
4. **Set up the database:** run every file in `supabase/migrations/` in order (Supabase SQL Editor, or the Supabase CLI). They are ordered `0001` → `0017` and include schema, RLS, and seed data.
5. **Create an admin user:** create a user in Supabase Auth, then set their `profiles.role = 'admin'` (the `is_admin()` RLS function keys off this).
6. **Run:**
   ```bash
   npm run dev
   ```
   Front site at `http://localhost:3000`, admin at `http://localhost:3000/admin`.

---

## Environment variables

From `.env.example` — set these in `.env.local` locally and in **Vercel → Project → Environment Variables** for production.

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Anon key (RLS‑bound, browser‑safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | Bypasses RLS — never expose to the client |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | public | reCAPTCHA v3 site key |
| `RECAPTCHA_SECRET_KEY` | server | reCAPTCHA v3 verification secret |
| `BREVO_API_KEY` | server | Brevo API key (email + lists) |
| `BREVO_LIST_ID` | server | Newsletter list id |
| `LEAD_NOTIFY_EMAIL` | server | Where new‑lead alerts are sent |
| `BREVO_SENDER_EMAIL` / `BREVO_SENDER_NAME` | server | From address/name |
| `NEXT_PUBLIC_SITE_URL` | public | Canonical/OG base URL. **Set to the deployed domain on Vercel** (`https://get-set-go-app.vercel.app`) — used by `lib/seo.ts` and page metadata |

> Auth email links (password reset / email change) no longer depend on `NEXT_PUBLIC_SITE_URL` — they derive the origin from the request headers via `lib/origin.ts` (`originFromHeaders`), so they always match the domain the admin is actually using.

---

## Build & deployment

- **Hosting:** Vercel. Pushing to the deployment branch triggers a build (`next build`) and deploy.
- **Database:** Supabase is **not** managed by the deploy. **Migrations must be run manually** on the hosted DB (SQL Editor or Supabase CLI) when new ones land — the app does not auto‑migrate. See [Known issues](#known-issues-technical-debt--troubleshooting) for which migrations may still be pending.
- **Images:** `next.config.ts` allows remote images from `*.supabase.co/storage/v1/object/public/**` and serves AVIF/WebP. Tighten the hostname to your project ref for production.
- **Cache after direct DB edits:** the front site caches DB reads (see [caching](#search-filters-email-caching--error-handling)). Admin UI edits invalidate the cache automatically, but **direct SQL edits do not** — redeploy on Vercel (clears all caches) or wait out the revalidation window.

---

## Application architecture & data flow

### Front site (hybrid SSR + legacy runtime)

The front site is **mid‑migration** from a hand‑written HTML/JS single‑page app to native Next routes (see `_reference/` for the originals). Current state:

- Pages under `app/(site)` are **Server Components** that read content from cached DB helpers (`lib/siteSettings.ts`, `lib/quests.ts`, `lib/deals.ts`, `lib/journal.ts`) and render React sections/components.
- `app/(site)/layout.tsx` still loads **`public/front.js`** (via `FrontBoot`), the original runtime that drives SPA‑style navigation, filters, modals, and some interactive behaviour. Many React components are faithful ports of front.js markup and are designed for **zero UI/UX change**.
- Data flow: **Supabase → cached reader (`unstable_cache`) → Server Component → HTML** (+ front.js hydration/behaviour on the client).

### Admin CMS (transcription + bridges)

- `app/admin/page.tsx` assembles one large document. Sections are either **ported React components** (`components/admin/pages/*`) or **raw HTML** carved out of `_reference/admin-body.html` (`components/admin/RawHtml.tsx`, `lib/admin/carve.ts`).
- **Bridges** (`app/admin/*Bridge.tsx`) are client components that wire each editor's DOM inputs to the DB: they populate fields on mount and POST/PUT to `/api/admin/*` on save. Bridges must select inputs by `id`/label/placeholder (not React event‑handler attributes).
- Which section is visible is driven by a `?p=<page>` query param plus a small pre‑paint inline script (`admin-initial-page-activate`) that activates the requested section before hydration. Section root `.page` divs carry `suppressHydrationWarning` so React doesn't fight/revert that pre‑paint activation (prevents a flash + hydration warnings).
- **Write path:** admin editor → `POST/PUT /api/admin/*` → `requireAdminApi()` → validate/normalize → Supabase upsert → `revalidateTag(...)` **and** `revalidatePath("/", "layout")` → change is visible on the next normal front‑site load.

### Auth

- `proxy.ts` (Next 16's renamed middleware) refreshes the Supabase session cookie and gates `/admin/*` (redirects unauthenticated users to `/admin/login`); `/api/admin/*` is refreshed but **not** redirected (route handlers return JSON 401/403 instead).
- Three defence layers: proxy (coarse "signed in?"), `requireAdmin()` / `requireAdminApi()` (role check via `profiles.role`), and Postgres **RLS** (`is_admin()`) as the final backstop. Server Actions call `requireAdmin()` too, since they're reachable by direct POST.

---

## Database overview

Postgres on Supabase. Schema + seed live entirely in `supabase/migrations/` (`0001`–`0017`).

**Core tables:**

| Table | Purpose |
|---|---|
| `profiles` | User profiles; `role` column drives admin access (`is_admin()`) |
| `quests` | Quest experiences (content JSONB, SEO, visibility, ordering) |
| `taxonomy_terms` | Categories, countries, budgets, durations, difficulty, delivery, life direction, outcome goal, journal category |
| `quest_terms` / `quest_images` | Quest ↔ taxonomy join; quest gallery images |
| `deals` | Partner deals/offers (lead‑form & booking‑form JSONB fields) |
| `deal_quests` | Deal ↔ quest join (connected quests) |
| `journal_posts` | Blog posts (scheduling: `scheduled_at`, `scheduled_tz`) |
| `leads` | Form submissions (deal lead, contact, partner) with `lead_type` |
| `site_settings` | Single row (`id=1`): JSONB blobs `nav`, `footer`, `homepage`, `pages`, `quiz`, `seo`, `settings` — the CMS content store |
| `admin_config` | Private admin config (SMTP creds, lead‑alert settings) |

**Directory feature tables:** `industries`, `business_models`, `product_categories`, `listings`, `listing_images`, `listing_contacts`, `listing_product_categories`, `faq_items`, `pages`.

**RLS / helper functions:** `is_admin()` (role gate), `is_public_visibility()` (public read gate for published/visible rows), `set_updated_at()` (trigger). Public/anon reads only see publicly‑visible rows; admin reads (service‑bound server client) see drafts/hidden.

**Migrations of note:** `0008` site_settings, `0009` homepage CMS, `0010` pages CMS, `0011` quiz CMS, `0012` SEO defaults, `0013` settings/config, `0014`+`0016` journal scheduling (tz), `0015` deal final CTA button, `0017` OutQuest rebrand (rewrites legacy "SideQuesta"/"SideQuest" content).

---

## API endpoints

All under `app/api`. Admin routes require an authenticated admin (`requireAdminApi()`); public routes are validated + rate‑limited + reCAPTCHA‑guarded.

**Public (form submissions):**

| Route | Method | Purpose |
|---|---|---|
| `/api/leads` | POST | Deal lead / booking form submission |
| `/api/contact` | POST | Contact form |
| `/api/partner` | POST | Partner/"become a partner" form |
| `/api/newsletter` | POST | Newsletter subscribe (Brevo) |

**Admin (CRUD; each mutation revalidates cache):**

| Route | Methods | Purpose |
|---|---|---|
| `/api/admin/quests` , `/api/admin/quests/[id]` | POST / PUT / DELETE | Quest CRUD |
| `/api/admin/quests/upload` | POST | Image upload → Supabase Storage |
| `/api/admin/deals` , `/api/admin/deals/[id]` | POST / PUT / DELETE | Deal CRUD (+ connected quests) |
| `/api/admin/journal` , `/api/admin/journal/[id]` | POST / PUT / DELETE | Journal CRUD |
| `/api/admin/taxonomy` , `/[id]` , `/reorder` | POST / PUT / DELETE / POST | Taxonomy CRUD + reordering |
| `/api/admin/site-settings` | PUT | nav / footer / homepage / pages / quiz / seo / settings |
| `/api/admin/config` | GET / PUT | Private admin config (SMTP, alerts) |
| `/api/admin/email` | GET / POST | Change admin login email (Supabase) |
| `/api/admin/password` | POST | Change admin password (re‑auth then update) |
| `/api/admin/leads/[id]` | PATCH / DELETE | Update lead status / delete |

---

## Third‑party integrations

- **Supabase** — Postgres, Auth, Storage (image uploads to a public `quests` bucket), and RLS. Four client factories in `lib/supabase/`: `server` (SSR, cookie‑bound), `client` (browser), `public` (anon, cookie‑free, for cached reads), `admin` (service‑role, **server only**, bypasses RLS).
- **Brevo** (`lib/brevo.ts`) — newsletter list subscription, new‑lead email alerts, and transactional email. Needs `BREVO_API_KEY` + `BREVO_LIST_ID`.
- **nodemailer / SMTP** (`lib/smtp.ts`) — fallback/alternate transactional email; SMTP credentials stored in `admin_config` (editable in Settings).
- **reCAPTCHA v3** (`lib/recaptcha.ts`, `lib/recaptchaClient.ts`) — bot scoring on public forms.
- **Google Analytics (GA4)** (`components/GoogleAnalytics.tsx`) — page‑view tracking; coordinates with front.js SPA navigation.

---

## Search, filters, email, caching & error handling

### Search & filters (quests)
- Public quest filters (life direction, outcome goal, effort/difficulty, delivery, duration, budget, country) are driven by **active `taxonomy_terms`** (`getActiveFilterTerms` in `lib/quests.ts`), so admin taxonomy edits appear on `/quests` and category pages.
- Category pages are generated from active `category` taxonomy terms; the client filter behaviour is handled by `public/front.js` + `lib/site/questFilterBus.ts`.
- Listing pages paginate (`components/site/cards/Pagination.tsx`).

### Email flow
- **Newsletter / leads:** front forms → API routes → Brevo (list subscribe + admin lead alert).
- **Admin auth email (Supabase):**
  - *Password reset:* `/admin/login` → `/admin/forgot` → `resetPasswordForEmail` → link → `/admin/auth/callback` → `/admin/reset`.
  - *Change email:* Settings → Security → `/api/admin/email` → Supabase confirmation link → `/admin/auth/callback` (verifies, **signs the stale session out**) → `/admin/login?flash=email-changed` (notice) → after login → `/admin?flash=email-changed` (dashboard success banner via `AdminFlash`).
  - The callback handles both PKCE (`?code=`) and OTP (`?token_hash=&type=`) link shapes.
  - **Supabase config required:** add the callback to **Redirect URLs** allowlist (`https://get-set-go-app.vercel.app/admin/auth/callback` and `/**`, plus localhost equivalents), set **Site URL**, and turn **Secure email change OFF** (ON = two confirmation emails + a "confirm the other email" message).

### Caching (important)
- Public DB reads are wrapped in `unstable_cache` with **cache tags** and time‑based fallbacks:
  - `SITE_SETTINGS_TAG` (settings/nav/footer/pages) — `revalidate: 60s`
  - `QUESTS_TAG` (quests, taxonomy) — `revalidate: 3600s`
  - `DEALS_TAG` — `revalidate: 3600s`
  - `JOURNAL_TAG` — `revalidate: 60s`
- Admin mutation routes call **`revalidateTag(TAG, { expire: 0 })` AND `revalidatePath("/", "layout")`**. Tag revalidation alone is served *stale‑while‑revalidate* (and doesn't purge the client router cache), so a normal refresh would show stale content and appear to "need a hard refresh" — pairing it with `revalidatePath` makes the change show on the next normal load. **Any new admin mutation route should follow this same both‑calls pattern.**
- Direct SQL edits bypass the app, so they don't invalidate tags — redeploy or wait for the time‑based window.

### Error handling & form security (`lib/formGuard.ts`, `sanitize.ts`, `rateLimit.ts`, `recaptcha.ts`)
- Public forms use progressive client validation **and** server validation, input sanitization, reCAPTCHA v3, and a **rate limit of 10 requests / IP / hour**.
- API routes return typed JSON errors (`{ error, status }`); admin gate returns 401/403 as JSON (never a redirect, so `fetch` on save can't misread a login page as success).
- Cached readers `.catch()` to safe defaults so a DB hiccup degrades to built‑in content rather than crashing the page.

---

## Reusable components

Preferred structure is **reusable, prop‑driven** components (change‑once). Highlights:

- **Front chrome** (`components/site/chrome`): `Nav`, `Footer`, `MobileMenu`, `NavLogo`, `SiteEnd`.
- **Cards** (`components/site/cards`): `QCard` / `SlimQCard` (quest cards), `ProgCard`, `FaqItem`, `Pagination`, deal/journal cards.
- **Sections** (`components/site/sections`, `.../about`, `.../partner`): homepage + page sections (hero, why, personas, social proof, reels, newsletter, about/partner sub‑sections).
- **Overlays** (`components/site/overlays`): `LeadModal`, `ShareSheet`, `MyQuestsDrawer`, quiz/compare overlays.
- **Admin layout** (`components/admin/layout`): `AppShell`, `Sidebar`, `Header`.
- **Admin pages** (`components/admin/pages`, `.../pcms`): one component per editor section (Dashboard, Quests/Deals/Journal list+edit, Footer, NavMenu, Settings, Quiz builder, About/Partner/FAQ/Contact/Legal/Category editors, Auth pages, TaxonomyShell).
- **State/util** (`components/site/state`, `lib/site/data/*`): default content + client state buses; edit the `data/*` defaults to change fallbacks used before DB overrides.

---

## Known issues, technical debt & troubleshooting

### Technical debt / migration state
- **Front runtime migration in progress.** `public/front.js` still drives front‑site SPA behaviour; React components are being ported over with zero UI change. `_reference/` holds the original HTML/JS the site + admin are transcribed from.
- **Admin is partly raw HTML.** Some admin sections are still carved from `_reference/admin-body.html` and wired via bridges rather than fully ported to React.
- **Legacy reference files** (`body.html`, `fjs.js`, the two `*.htm` files, `_reference/*`) are historical references, not served to users. They've been rebranded to OutQuest for consistency but can eventually be removed.

### Pending manual DB migrations
Migrations are **not** applied automatically. Confirm these have been run on the hosted DB (previously flagged as pending): **`0011` (quiz), `0013` (settings/config), `0016` (journal scheduled_tz), `0017` (OutQuest rebrand)**. Symptoms of an unrun migration include missing columns or content still showing old values.

### Troubleshooting
- **"Edited content in admin but the front site still shows old data on refresh."** The mutation route must call both `revalidateTag(...)` and `revalidatePath("/", "layout")`. If you edited the DB directly (SQL), redeploy on Vercel or wait for the revalidate window.
- **Email‑change / reset link lands on the home page instead of the callback.** The callback URL isn't in Supabase's **Redirect URLs** allowlist (falls back to Site URL). Add it. Also ensure **Secure email change is OFF** for a single confirmation email.
- **"Please proceed to confirm link sent to the other email."** = Supabase **Secure email change is ON** — one click won't complete the change. Turn it off.
- **Admin hydration warning / section flash on `?p=` refresh.** Handled by `suppressHydrationWarning` on `.page` roots + the pre‑paint activation script. If you add a new admin section component, put `suppressHydrationWarning` on its root `.page` div.
- **Rebrand: stray old brand text.** Content lives in the DB, so editing code/seed files won't change a seeded DB — run `supabase/migrations/0017_rebrand_outquest.sql` (idempotent) and redeploy. It rewrites all text + JSONB columns across `quests`, `deals`, `journal_posts`, `site_settings`.
- **Intermittent 401 on admin save.** The proxy refreshes the session cookie for `/api/admin/*` to avoid refresh‑token rotation races; don't add per‑route ad‑hoc refreshes that fight it.
- **`about-paths` ("Pick Your Path") card layout.** Uses `grid-template-columns: repeat(auto-fit, minmax(min(180px,100%),1fr))` so columns adapt to card count. Card background colours are defined for `nth-child(1..6)` only — a 7th+ card renders without a colour.

### Conventions
- Match surrounding code style; keep front‑site changes visually identical to the reference.
- New admin mutation → validate/normalize server‑side, then `revalidateTag` + `revalidatePath`.
- Never import the service‑role client (`lib/supabase/admin.ts`) into anything that reaches the browser.
