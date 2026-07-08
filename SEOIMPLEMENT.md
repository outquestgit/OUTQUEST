feat(seo): M1 CMS SEO Foundation — Tasks 1–8

## Summary
Adds a fully database-driven SEO metadata layer across all static pages,
deal pages, and journal posts. Non-developers can now manage all SEO fields
through the admin CMS without touching code or triggering a redeploy.

## Database (Task 1)
- Migration 0018_page_seo.sql
  - Add `page_seo JSONB DEFAULT '{}'` to `site_settings`
  - Add `canonical_url TEXT` and `noindex BOOLEAN DEFAULT false` to `deals`

## Types & Data Layer (Task 2)
- Add `PageSeoData` interface to `lib/types.ts`
- Add `page_seo?: Record<string, PageSeoData>` to `SiteSettings` in `chromeConfig.ts`
- Add `page_seo` to `COLS_FULL` select string in `siteSettings.ts`
- Add `page_seo` normalization in `normalize()` in `siteSettings.ts`
- Add `page_seo` branch to PUT handler in `api/admin/site-settings/route.ts`

## Admin CMS SEO Panels (Task 3)
- New shared `SeoPanel.tsx` component (fully controlled React, live SERP
  preview, character counters, OG fields, canonical override, noindex toggle)
- Wired into 6 static page editors:
  - `AboutEditorPage.tsx`
  - `FaqEditorPage.tsx`
  - `ContactEditorPage.tsx`
  - `LegalContentEditor.tsx` (shared for Privacy + Terms via pageKey)
  - `PartnerEditorPage.tsx`
  - `HomepagePage.tsx`
- Each editor: added `fullPageSeo` prop, `seoData` state, `page_seo` in
  save() payload
- `app/admin/page.tsx`: pass `pageSeo` to all 6 components, remove
  duplicate `getSiteSettings()` call

## Frontend Metadata (Task 4)
- `lib/site/staticMeta.ts`: check `page_seo[key]` first, fall back to
  hero copy, then site-wide defaults. Forward `canonical_url` and `noindex`
  from CMS panel to `buildMetadata()`

## Deals Metadata (Tasks 5 & 6)
- `lib/deals.ts`: add `canonical_url` and `noindex` to `Deal` interface
- `app/(site)/deals/[slug]/page.tsx`: pass `canonical_url` and `noindex`
  to `buildMetadata()`
- `lib/admin/dealPayload.ts`: add `canonical_url` and `noindex` to
  `DealPayload` type and `buildDealPayload()`
- `components/admin/pages/DealsEditPage.tsx`: fix duplicate
  `<input id="d-canonical">` (was rendering two inputs)
- `app/admin/DealsBridge.tsx`: populate `canonical_url` and `noindex` on
  deal load; include both in save payload; add `d-canonical` to clearEditor

## Sitemap (Task 7)
- `app/sitemap.ts`: add deals to parallel fetch; output `/deals/[slug]`
  entries at priority 0.75; automatically exclude noindex deals

## OG Type (Task 8)
- `lib/seo.ts`: add optional `ogType` param to `buildMetadata()`
  (defaults to "website")
- `app/(site)/journal/[slug]/page.tsx`: pass `ogType: "article"` so
  journal posts output correct Open Graph type for social sharing

## Verified
- page_seo saves to DB and renders server-side in <title> and <meta> tags
- All 6 static page SEO panels save and load correctly
- /sitemap.xml includes all published deal URLs
- Journal posts output og:type = article in page source
- TypeScript: npx tsc --noEmit passes with 0 errors