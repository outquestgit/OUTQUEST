import { slugify } from "./forms";
import type {
  BookingFormField,
  BookingFormFieldType,
  LeadFormField,
  LeadFormFieldType,
} from "../deals";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CATEGORIES = new Set(["programs", "setup", "tools"]);
const LCF_TYPES = new Set<LeadFormFieldType>([
  "short_text",
  "long_text",
  "email",
  "phone",
  "dropdown",
  "radio",
  "checkbox",
]);
const BKF_TYPES = new Set<BookingFormFieldType>([
  "short_text",
  "long_text",
  "dropdown",
  "date",
  "number",
  "radio",
]);

/** Validate/normalize the lead-capture form builder rows from the deal editor. */
function leadFormFields(v: unknown): LeadFormField[] {
  if (!Array.isArray(v)) return [];
  const out: LeadFormField[] = [];
  for (const raw of v) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const label = String(r.label ?? "").trim();
    if (!label) continue;
    const type = (LCF_TYPES.has(r.type as LeadFormFieldType)
      ? r.type
      : "short_text") as LeadFormFieldType;
    const placeholder = String(r.placeholder ?? "").trim();
    const field: LeadFormField = { label, type, required: !!r.required };
    if (placeholder) field.placeholder = placeholder;
    if (type === "dropdown" || type === "radio" || type === "checkbox") {
      const options = Array.isArray(r.options)
        ? r.options.map((o) => String(o ?? "").trim()).filter(Boolean)
        : [];
      field.options = options;
    }
    out.push(field);
  }
  return out;
}

/** Validate/normalize the Step-1 booking form builder rows from the deal editor. */
function bookingFormFields(v: unknown): BookingFormField[] {
  if (!Array.isArray(v)) return [];
  const out: BookingFormField[] = [];
  for (const raw of v) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const label = String(r.label ?? "").trim();
    if (!label) continue;
    const type = (BKF_TYPES.has(r.type as BookingFormFieldType)
      ? r.type
      : "short_text") as BookingFormFieldType;
    const placeholder = String(r.placeholder ?? "").trim();
    const field: BookingFormField = { label, type, required: !!r.required };
    if (placeholder) field.placeholder = placeholder;
    if (type === "dropdown" || type === "radio") {
      field.options = Array.isArray(r.options)
        ? r.options.map((o) => String(o ?? "").trim()).filter(Boolean)
        : [];
    }
    out.push(field);
  }
  return out;
}

export type DealPayload = {
  title: string;
  slug: string;
  category: string | null;
  short_desc: string | null;
  partner_name: string | null;
  card_icon: string | null;
  card_color: string | null;
  what_is: string | null;
  who_for: string | null;
  why_useful: string | null;
  requirements: string[];
  checklist: string[];
  cta_label: string | null;
  action_type: string | null;
  book_url: string | null;
  affiliate_url: string | null;
  lead_form_fields: LeadFormField[];
  pay_type: string | null;
  total_price: number | null;
  deposit_amount: number | null;
  refund_policy: string | null;
  booking_fields: BookingFormField[];
  price_from: number | null;
  billing_unit: string | null;
  offer_label: string | null;
  offer_price: string | null;
  outcome_text: string | null;
  cta_heading: string | null;
  cta_subtext: string | null;
  cta_button_label: string | null;
  verified: boolean;
  featured: boolean;
  seo_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  noindex: boolean;
  image_alt: string | null;
  visibility: "published" | "draft";
  display_order: number;
  // Optional — set only when present so they're preserved on update.
  featured_image_path?: string;
  card_image_path?: string;
  og_image_url?: string;
};

const clean = (v: unknown) => {
  const s = String(v ?? "").trim();
  return s === "" ? null : s;
};
const arr = (v: unknown): string[] =>
  Array.isArray(v) ? v.map((x) => String(x ?? "").trim()).filter(Boolean) : [];

/**
 * Validates + normalizes a deal editor payload. Shared by the create (POST) and
 * update (PUT) routes so they can't diverge. Returns an `error` string, or the
 * `payload` + cleaned `slug` + `questIds` (connected quests to sync).
 */
export function buildDealPayload(
  body: Record<string, unknown>
): { error: string } | { payload: DealPayload; slug: string; questIds: string[] } {
  const title = String(body.title ?? "").trim();
  let slug = String(body.slug ?? "").trim();
  if (!slug && title) slug = slugify(title);
  if (!title) return { error: "Title is required." };
  if (!SLUG_RE.test(slug))
    return { error: "Slug must be lowercase letters, numbers and hyphens." };

  const cat = String(body.category ?? "").trim();
  const priceRaw = body.price_from;
  const price = priceRaw === "" || priceRaw == null ? null : Number(priceRaw);
  const num = (v: unknown): number | null => {
    if (v === "" || v == null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const payTypeRaw = String(body.pay_type ?? "").trim();

  const payload: DealPayload = {
    title,
    slug,
    category: CATEGORIES.has(cat) ? cat : null,
    short_desc: clean(body.short_desc),
    partner_name: clean(body.partner_name),
    card_icon: clean(body.card_icon),
    card_color: clean(body.card_color),
    what_is: clean(body.what_is),
    who_for: clean(body.who_for),
    why_useful: clean(body.why_useful),
    requirements: arr(body.requirements),
    checklist: arr(body.checklist),
    cta_label: clean(body.cta_label),
    action_type: clean(body.action_type),
    book_url: clean(body.book_url),
    affiliate_url: clean(body.affiliate_url),
    lead_form_fields: leadFormFields(body.lead_form_fields),
    pay_type: payTypeRaw === "full" ? "full" : payTypeRaw === "deposit" ? "deposit" : null,
    total_price: num(body.total_price),
    deposit_amount: num(body.deposit_amount),
    refund_policy: clean(body.refund_policy),
    booking_fields: bookingFormFields(body.booking_fields),
    price_from: price != null && Number.isFinite(price) ? price : null,
    billing_unit: clean(body.billing_unit),
    offer_label: clean(body.offer_label),
    offer_price: clean(body.offer_price),
    outcome_text: clean(body.outcome_text),
    cta_heading: clean(body.cta_heading),
    cta_subtext: clean(body.cta_subtext),
    cta_button_label: clean(body.cta_button_label),
    verified: !!body.verified,
    featured: !!body.featured,
    seo_title: clean(body.seo_title),
    meta_description: clean(body.meta_description),
    canonical_url: clean(body.canonical_url),
    noindex: body.noindex === true || body.noindex === "true",
    image_alt: clean(body.image_alt) || null,
    visibility: body.status === "published" ? "published" : "draft",
    display_order: Number.isFinite(Number(body.display_order))
      ? Math.trunc(Number(body.display_order))
      : 0,
  };

  if (clean(body.featured_image_path)) payload.featured_image_path = String(body.featured_image_path);
  if (clean(body.card_image_path)) payload.card_image_path = String(body.card_image_path);
  if (clean(body.og_image_url)) payload.og_image_url = String(body.og_image_url);

  const rawQ = body.questIds;
  const questIds = Array.isArray(rawQ)
    ? [...new Set(rawQ.map((x) => String(x)).filter((s) => s !== ""))]
    : [];

  return { payload, slug, questIds };
}