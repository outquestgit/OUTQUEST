"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { openLink } from "@/lib/site/runtime";
import type { Deal } from "@/lib/deals";
import { DealLeadForm } from "./DealLeadForm";
import { DealBookingSheet } from "./DealBookingSheet";

const FALLBACK_BG = "linear-gradient(160deg,#1A0A2A,#4A1A7A,#A060E0)";

/**
 * Single deal page — reproduces the SPA `openDealPage` markup/classes exactly
 * (so `front.css` styles it identically) but rendered from the database. Client
 * component (SSR'd for SEO) so the Claim/Back buttons work without the SPA's
 * hardcoded `DEALS` map.
 */
export function DealDetail({ deal }: { deal: Deal }) {
  const router = useRouter();
  const heroBg = deal.hero_bg || deal.card_color || FALLBACK_BG;
  // An uploaded featured (or card) image paints the hero; else the gradient + icon.
  const heroImage = deal.featured_image_path || deal.card_image_path || null;
  const offerPrice =
    deal.offer_price ||
    (deal.price_from != null
      ? `From $${deal.price_from}${deal.billing_unit ? ` / ${deal.billing_unit}` : ""}`
      : "");
  const offerUrl = deal.book_url || deal.affiliate_url || "";
  const isLeadForm = deal.action_type === "leadform";
  const isBooking = deal.action_type === "booking";
  const claimLabel = deal.cta_label || (isBooking ? "Book now" : "Claim offer");
  // The bottom "Final CTA" button can have its own text (admin: Final CTA Copy);
  // falls back to the main claim label.
  const finalCtaLabel = deal.cta_button_label || claimLabel;
  const [bookOpen, setBookOpen] = useState(false);
  const claim = () => {
    if (isBooking) {
      setBookOpen(true);
      return;
    }
    if (isLeadForm) {
      document.getElementById("dp-lead-form-anchor")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (offerUrl && offerUrl !== "#") openLink(offerUrl);
  };

  return (
    <>
      <div className="deal-back-bar">
        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "20px 20px 0" }}>
          <button className="deal-back-btn" onClick={() => router.back()}>
            Back
          </button>
        </div>
      </div>
      <div className="deal-page-wrap">
        <div
          className="dp-hero-img"
          style={
            heroImage
              ? {
                  backgroundImage: `url(${heroImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  marginTop: "20px",
                }
              : { background: heroBg, marginTop: "20px" }
          }
        >
          {!heroImage && (deal.hero_icon || deal.card_icon || "✦")}
          {deal.partner_name && <div className="dp-hero-label">{deal.partner_name}</div>}
        </div>
        {deal.badge && <div className="dp-badge">{deal.badge}</div>}
        <h1 className="dp-title">{deal.title}</h1>
        {deal.short_desc && <p className="dp-desc">{deal.short_desc}</p>}

        <div className="dp-offer-box">
          <div>
            {deal.offer_label && <div className="dp-offer-label">{deal.offer_label}</div>}
            {offerPrice && <div className="dp-offer-price">{offerPrice}</div>}
            {deal.outcome_text && <div className="dp-offer-saving">{deal.outcome_text}</div>}
          </div>
          <button className="dp-claim-btn" onClick={claim}>
            {claimLabel}
          </button>
        </div>

        {deal.what_is && (
          <div className="dp-section">
            <h2>What this is</h2>
            <p dangerouslySetInnerHTML={{ __html: deal.what_is }} />
          </div>
        )}
        {deal.who_for && (
          <div className="dp-section">
            <h2>Who it&apos;s for</h2>
            <p dangerouslySetInnerHTML={{ __html: deal.who_for }} />
          </div>
        )}
        {deal.requirements.length > 0 && (
          <div className="dp-section req-section">
            <h2>Requirements</h2>
            <ul className="dp-req-list">
              {deal.requirements.map((r, i) => (
                <li className="dp-req-item" key={i}>
                  <span className="dp-req-dot"></span>
                  <span className="dp-req-text">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {deal.checklist.length > 0 && (
          <div className="dp-section">
            <h2>What you get</h2>
            <ul className="dp-checklist">
              {deal.checklist.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}
        {deal.why_useful && (
          <div className="dp-section">
            <h2>Why this is useful</h2>
            <p dangerouslySetInnerHTML={{ __html: deal.why_useful }} />
          </div>
        )}

        {isLeadForm ? (
          <div id="dp-lead-form-anchor">
            <DealLeadForm deal={deal} />
          </div>
        ) : (
          (deal.cta_heading || deal.cta_subtext) && (
            <div className="dp-end-cta">
              {deal.cta_heading && <h3>{deal.cta_heading}</h3>}
              {deal.cta_subtext && <p>{deal.cta_subtext}</p>}
              <button className="dp-claim-btn" onClick={claim}>
                {finalCtaLabel}
              </button>
            </div>
          )
        )}
      </div>
      {isBooking && bookOpen && (
        <DealBookingSheet deal={deal} onClose={() => setBookOpen(false)} />
      )}
    </>
  );
}
