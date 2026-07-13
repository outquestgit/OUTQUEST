ALTER TABLE public.site_settings
ADD COLUMN page_seo JSONB DEFAULT '{}'::jsonb;

ALTER TABLE public.deals
ADD COLUMN canonical_url TEXT,
ADD COLUMN noindex BOOLEAN DEFAULT false;