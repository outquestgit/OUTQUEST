-- ============================================================================
-- Editable "Final CTA Copy" button text for deals.
--
-- The deal page's bottom CTA button reused `cta_label` (the main claim/book
-- button). This adds a dedicated `cta_button_label` so the final CTA button can
-- be set independently from the Deal editor's "Final CTA Copy" section. Empty →
-- the front falls back to `cta_label` (then "Book now" / "Claim offer").
-- ============================================================================

alter table deals
  add column if not exists cta_button_label text;  -- final CTA button text
