-- Sample data so the public SSR routes render before real content exists.
-- Run after 0001_init.sql.

insert into industries (slug, name, description, seo_title, meta_description, h1, intro, visibility, sort_order)
values
  ('apparel', 'Apparel & Textiles', 'Clothing, fabric and textile manufacturers.',
   'Apparel & Textile Manufacturers Directory', 'Browse vetted apparel and textile suppliers by business model and capability.',
   'Apparel & Textile Suppliers', 'Find manufacturers across knitwear, woven, denim and more.', 'featured', 1),
  ('electronics', 'Electronics', 'Consumer and industrial electronics makers.',
   'Electronics Manufacturers Directory', 'Browse vetted electronics suppliers by business model and capability.',
   'Electronics Suppliers', 'Find OEM/ODM electronics partners.', 'published', 2)
on conflict (slug) do nothing;

insert into business_models (industry_id, slug, name, description, seo_title, meta_description, h1, intro, visibility, sort_order)
select i.id, v.slug, v.name, v.description, v.seo_title, v.meta_description, v.h1, v.intro, 'published', v.sort_order
from industries i
join (values
  ('apparel', 'oem', 'OEM', 'Make to your design.', 'Apparel OEM Manufacturers', 'OEM apparel factories that produce to your specs.', 'Apparel OEM Suppliers', 'Produce to your own designs and specs.', 1),
  ('apparel', 'private-label', 'Private Label', 'Rebrand existing products.', 'Private Label Apparel Suppliers', 'Private-label apparel suppliers ready to brand.', 'Private Label Apparel', 'Launch under your own brand fast.', 2),
  ('electronics', 'odm', 'ODM', 'Ready designs to customize.', 'Electronics ODM Suppliers', 'ODM electronics suppliers with ready designs.', 'Electronics ODM', 'Customize proven designs.', 1)
) as v(industry_slug, slug, name, description, seo_title, meta_description, h1, intro, sort_order)
  on i.slug = v.industry_slug
on conflict (industry_id, slug) do nothing;

insert into product_categories (slug, name, visibility, sort_order) values
  ('t-shirts', 'T-Shirts', 'published', 1),
  ('hoodies', 'Hoodies', 'published', 2),
  ('wearables', 'Wearables', 'published', 3)
on conflict (slug) do nothing;

insert into listings (slug, company_name, industry_id, business_model_id, location, made_in,
  years_in_operation, description, production_time, capabilities, moq_min, moq_max,
  certifications, tags, seo_title, meta_description, h1, intro, visibility, featured)
select 'acme-knitwear', 'Acme Knitwear Co.', i.id, bm.id, 'Tiruppur, India', 'India',
  12, 'Full-package knitwear manufacturer specialising in cotton basics and heavyweight fleece.',
  '25–35 days', array['Cut & Sew','Screen Printing','Embroidery'], 300, 5000,
  array['GOTS','OEKO-TEX'], array['cotton','fleece','sustainable'],
  'Acme Knitwear — Cotton & Fleece OEM Manufacturer',
  'Acme Knitwear is a GOTS-certified OEM knitwear factory in Tiruppur producing cotton basics and fleece.',
  'Acme Knitwear Co.', 'Heavyweight cotton and fleece, made to your design.', 'featured', true
from industries i
join business_models bm on bm.industry_id = i.id and bm.slug = 'oem'
where i.slug = 'apparel'
on conflict (slug) do nothing;

insert into listing_images (listing_id, storage_path, alt_text, width, height, format, is_logo, sort_order)
select l.id, 'placeholder/acme-logo.webp', 'Acme Knitwear Co. logo', 600, 600, 'webp', true, 0
from listings l where l.slug = 'acme-knitwear'
on conflict do nothing;

insert into listing_product_categories (listing_id, product_category_id)
select l.id, pc.id from listings l, product_categories pc
where l.slug = 'acme-knitwear' and pc.slug in ('t-shirts','hoodies')
on conflict do nothing;

insert into pages (slug, title, seo_title, meta_description, h1, intro, visibility) values
  ('home', 'Home', 'GetSetGo — Sourcing Directory', 'Discover vetted suppliers across industries and business models.', 'Find your next manufacturing partner', 'Search by industry, model and capability.', 'published'),
  ('about', 'About', 'About GetSetGo', 'How GetSetGo connects buyers with vetted suppliers.', 'About GetSetGo', 'Our mission and how it works.', 'published')
on conflict (slug) do nothing;
