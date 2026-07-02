"use client";

import { useEffect, useState } from "react";
import type { BookingFormField, Deal } from "@/lib/deals";

/**
 * Booking sheet shown on a deal page when `action_type === "booking"`.
 * Two steps (Details → Payment) then a success screen — mirrors the reference
 * "BOOKING SHEET". Note: this is the booking *UI* only; nothing is submitted to
 * a backend (no Stripe / no lead record) — payment is validated client-side and
 * the success screen is shown locally.
 *
 * Mounted only while open (the parent gates it), so it always opens on a clean
 * Step 1 without needing a reset effect.
 */
export function DealBookingSheet({ deal, onClose }: { deal: Deal; onClose: () => void }) {
  const fields = deal.booking_fields ?? [];
  const isFull = deal.pay_type === "full";
  const total = deal.total_price;
  const dep = deal.deposit_amount ?? 0;
  const offerPrice = deal.offer_price || (total != null ? `$${total}` : "—");
  const dueNow = isFull ? total ?? 0 : dep;
  const balance = total != null && dep > 0 ? total - dep : null;

  const [step, setStep] = useState<1 | 2>(1);
  const [done, setDone] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [prog, setProg] = useState<Record<number, string>>({});
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [error, setError] = useState("");

  // Lock background scroll while mounted (open).
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const setProgVal = (i: number, v: string) => setProg((p) => ({ ...p, [i]: v }));

  const goStep2 = () => {
    if (!first.trim()) {
      setError("Please enter your first name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    setError("");
    setStep(2);
    document.querySelector(".book-sheet-body")?.scrollTo({ top: 0 });
  };

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + " / " + d.slice(2) : d;
  };

  const pay = () => {
    if (card.replace(/\s/g, "").length < 14) {
      setError("Please enter a valid card number.");
      return;
    }
    if (expiry.replace(/\D/g, "").length < 4) {
      setError("Please enter a valid expiry date.");
      return;
    }
    if (cvc.trim().length < 3) {
      setError("Please enter a valid CVC.");
      return;
    }
    if (!cardName.trim()) {
      setError("Please enter the name on your card.");
      return;
    }
    setError("");
    setBookingRef("SQ-" + Math.random().toString(36).slice(2, 8).toUpperCase());
    setDone(true);
  };

  const renderProgramField = (f: BookingFormField, i: number) => {
    const v = prog[i] ?? "";
    switch (f.type) {
      case "dropdown":
        return (
          <select className="bsf-select" value={v} onChange={(e) => setProgVal(i, e.target.value)}>
            <option value="">Select…</option>
            {(f.options ?? []).map((o, k) => (
              <option key={k} value={o}>
                {o}
              </option>
            ))}
          </select>
        );
      case "radio":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {(f.options ?? []).map((o, k) => (
              <label
                key={k}
                style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "15px", cursor: "pointer" }}
              >
                <input type="radio" name={`bsf-prog-${i}`} checked={v === o} onChange={() => setProgVal(i, o)} />
                {o}
              </label>
            ))}
          </div>
        );
      case "long_text":
        return (
          <textarea
            className="bsf-textarea"
            placeholder={f.placeholder ?? ""}
            value={v}
            onChange={(e) => setProgVal(i, e.target.value)}
          />
        );
      default:
        return (
          <input
            className="bsf-input"
            type={f.type === "date" ? "date" : f.type === "number" ? "number" : "text"}
            placeholder={f.placeholder ?? ""}
            value={v}
            onChange={(e) => setProgVal(i, e.target.value)}
          />
        );
    }
  };

  return (
    <div
      className="book-sheet-wrap show"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="book-sheet">
        <button className="book-sheet-close" onClick={onClose}>
          ✕
        </button>
        <div className="book-sheet-drag" />

        {!done && (
          <div className="book-steps">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div className={`book-step-dot ${step === 1 ? "active" : "done"}`}>1</div>
              <div className="book-step-label">Details</div>
            </div>
            <div className={`book-step-line ${step === 2 ? "done" : ""}`} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div className={`book-step-dot ${step === 2 ? "active" : "idle"}`}>2</div>
              <div className="book-step-label">Payment</div>
            </div>
          </div>
        )}

        {!done && (
          <div className="book-sheet-head">
            <div className="book-context">
              <div className="book-context-icon" style={{ background: deal.hero_bg || "var(--orange)" }}>
                {deal.hero_icon || deal.card_icon || "📋"}
              </div>
              <div>
                <div className="book-context-title">{deal.title}</div>
                <div className="book-context-price">{offerPrice}</div>
              </div>
            </div>
            <div className="book-sheet-h">{step === 1 ? "Book your spot" : "Secure your place"}</div>
            <div className="book-sheet-sub">
              {step === 1
                ? "Fill in your details and we'll hold your place with a deposit."
                : "Pay the deposit now to confirm your booking."}
            </div>
          </div>
        )}

        <div className="book-sheet-body">
          {/* ── STEP 1: Details ── */}
          {!done && step === 1 && (
            <div>
              <div className="bsf-section-label">Your details</div>
              <div className="bsf-row">
                <div className="bsf-field">
                  <label className="bsf-label">First name</label>
                  <input
                    className="bsf-input"
                    type="text"
                    placeholder="First name"
                    autoComplete="given-name"
                    value={first}
                    onChange={(e) => setFirst(e.target.value)}
                  />
                </div>
                <div className="bsf-field">
                  <label className="bsf-label">Last name</label>
                  <input
                    className="bsf-input"
                    type="text"
                    placeholder="Last name"
                    autoComplete="family-name"
                    value={last}
                    onChange={(e) => setLast(e.target.value)}
                  />
                </div>
              </div>
              <div className="bsf-field">
                <label className="bsf-label">Email</label>
                <input
                  className="bsf-input"
                  type="email"
                  placeholder="you@email.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="bsf-field">
                <label className="bsf-label">WhatsApp / Phone</label>
                <input
                  className="bsf-input"
                  type="tel"
                  placeholder="+60 12 345 6789"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {fields.length > 0 && <div className="bsf-section-label">Program details</div>}
              {fields.map((f, i) => (
                <div className="bsf-field" key={i}>
                  <label className="bsf-label">{f.label}</label>
                  {renderProgramField(f, i)}
                </div>
              ))}

              <div className="bsf-field">
                <label className="bsf-label">
                  Anything else we should know?{" "}
                  <span
                    style={{
                      fontWeight: 400,
                      textTransform: "none",
                      letterSpacing: 0,
                      fontSize: "11px",
                      color: "var(--text3)",
                    }}
                  >
                    optional
                  </span>
                </label>
                <textarea
                  className="bsf-textarea"
                  placeholder="Dietary needs, accessibility requirements, specific questions…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {error && <div style={{ color: "#d9303e", fontSize: "13px", marginBottom: "8px" }}>{error}</div>}

              <div className="bsf-btn-row">
                <button className="bsf-next" onClick={goStep2}>
                  Continue to payment
                </button>
              </div>
              <p
                style={{
                  fontSize: "11px",
                  color: "var(--text3)",
                  textAlign: "center",
                  marginTop: "10px",
                  lineHeight: 1.5,
                }}
              >
                No charge yet — you&apos;ll review the {isFull ? "amount" : "deposit"} on the next screen.
              </p>
            </div>
          )}

          {/* ── STEP 2: Payment ── */}
          {!done && step === 2 && (
            <div>
              <div className="deposit-box">
                <div className="deposit-box-label">
                  {isFull ? "Full payment" : "Deposit to secure your place"}
                </div>
                <div className="deposit-amount">
                  {isFull
                    ? total != null
                      ? `$${total}`
                      : "—"
                    : dep > 0
                      ? `$${dep} deposit`
                      : "Free to book"}
                </div>
                <div className="deposit-note">
                  {deal.refund_policy || "Deposit deducted from total amount due."}
                </div>
                <div className="deposit-breakdown">
                  <div className="deposit-line">
                    <span>Program price</span>
                    <span>{offerPrice}</span>
                  </div>
                  <div className="deposit-line">
                    <span>{isFull ? "Total due now" : "Deposit due now"}</span>
                    <strong>${dueNow}</strong>
                  </div>
                  {!isFull && (
                    <div className="deposit-line">
                      <span>Balance due later</span>
                      <span>{balance != null && balance > 0 ? `$${balance}` : "Remainder on confirmation"}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bsf-section-label">Payment details</div>
              <div className="secure-note">Payments secured by Stripe. We never store your card details.</div>
              <div className="card-brand-row">
                <div className="card-brand">VISA</div>
                <div className="card-brand">MC</div>
                <div className="card-brand">AMEX</div>
                <div className="card-brand">JCB</div>
              </div>
              <div className="bsf-field">
                <label className="bsf-label">Card number</label>
                <input
                  className="bsf-input"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  autoComplete="cc-number"
                  value={card}
                  onChange={(e) => setCard(formatCard(e.target.value))}
                />
              </div>
              <div className="card-field-row">
                <div className="bsf-field">
                  <label className="bsf-label">Expiry</label>
                  <input
                    className="bsf-input"
                    type="text"
                    placeholder="MM / YY"
                    maxLength={7}
                    autoComplete="cc-exp"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  />
                </div>
                <div className="bsf-field">
                  <label className="bsf-label">CVC</label>
                  <input
                    className="bsf-input"
                    type="text"
                    placeholder="123"
                    maxLength={4}
                    autoComplete="cc-csc"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              </div>
              <div className="bsf-field">
                <label className="bsf-label">Name on card</label>
                <input
                  className="bsf-input"
                  type="text"
                  placeholder="As it appears on your card"
                  autoComplete="cc-name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>

              {error && <div style={{ color: "#d9303e", fontSize: "13px", marginBottom: "8px" }}>{error}</div>}

              <div className="bsf-btn-row">
                <button className="bsf-back" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button className="bsf-pay" onClick={pay}>
                  {isFull ? "Pay now" : "Pay deposit"}
                </button>
              </div>
              <p
                style={{
                  fontSize: "11px",
                  color: "var(--text3)",
                  textAlign: "center",
                  marginTop: "10px",
                  lineHeight: 1.5,
                }}
              >
                By booking you agree to our cancellation policy. Full balance due 30 days before start.
              </p>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {done && (
            <div className="book-success show">
              <div className="book-success-tick">✓</div>
              <div className="book-success-h">You&apos;re booked.</div>
              <p className="book-success-p">
                Your {isFull ? "payment" : `$${dep} deposit`} for &quot;{deal.title}&quot; has been received. Check
                your email for your booking confirmation and next steps.
              </p>
              <div className="book-success-ref">
                Booking ref: <strong>{bookingRef}</strong>
              </div>
              <button className="book-success-done" onClick={onClose}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
