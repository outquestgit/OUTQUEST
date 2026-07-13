export type Visibility =
  | "draft"
  | "published"
  | "hidden"
  | "coming_soon"
  | "featured"
  | "archived";

export const PUBLIC_VISIBILITIES: Visibility[] = [
  "published",
  "coming_soon",
  "featured",
];

export type LeadStatus = "new" | "contacted" | "qualified" | "closed";

/** Fields shared by entities that carry admin-controlled SEO. */
export interface SeoFields {
  seo_title: string | null;
  meta_description: string | null;
  h1: string | null;
  intro: string | null;
  og_image_url: string | null;
}

export interface Industry extends SeoFields {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  visibility: Visibility;
  sort_order: number;
}

export interface BusinessModel extends SeoFields {
  id: string;
  industry_id: string;
  slug: string;
  name: string;
  description: string | null;
  visibility: Visibility;
  sort_order: number;
}

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  parent_id: string | null;
  visibility: Visibility;
  sort_order: number;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  storage_path: string;
  alt_text: string;
  width: number | null;
  height: number | null;
  format: string | null;
  is_logo: boolean;
  sort_order: number;
}

export interface Listing extends SeoFields {
  id: string;
  slug: string;
  company_name: string;
  industry_id: string | null;
  business_model_id: string | null;
  location: string | null;
  made_in: string | null;
  years_in_operation: number | null;
  description: string | null;
  production_time: string | null;
  capabilities: string[];
  moq_min: number | null;
  moq_max: number | null;
  certifications: string[];
  tags: string[];
  visibility: Visibility;
  featured: boolean;
}

export interface ListingWithRelations extends Listing {
  images: ListingImage[];
  industry: Pick<Industry, "slug" | "name"> | null;
  business_model: Pick<BusinessModel, "slug" | "name"> | null;
  product_categories: Pick<ProductCategory, "slug" | "name">[];
}

export interface CmsPage extends SeoFields {
  id: string;
  slug: string;
  title: string | null;
  content: Record<string, unknown>;
  visibility: Visibility;
}

export interface FaqItem {
  id: string;
  page_id: string | null;
  question: string;
  answer: string;
  visibility: Visibility;
  sort_order: number;
}

export interface Lead {
  id: string;
  listing_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  contact_pref: string | null;
  timeline: string | null;
  message: string | null;
  status: LeadStatus;
  assigned_supplier: string | null;
  created_at: string;
}

export interface PageSeoData {
  seo_title?: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  og_image_url?: string;
  canonical_url?: string;
  noindex?: boolean;
}