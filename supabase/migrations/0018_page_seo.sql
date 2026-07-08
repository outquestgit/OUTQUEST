-- Add page_seo JSONB to site_settings
ALTER TABLE public.site_settings
ADD COLUMN page_seo JSONB DEFAULT '{}'::jsonb;

-- Add canonical_url text and noindex boolean to deals
ALTER TABLE public.deals
ADD COLUMN canonical_url TEXT,
ADD COLUMN noindex BOOLEAN DEFAULT false;