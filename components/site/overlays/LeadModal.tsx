"use client";

import { useEffect, useState } from "react";
import { useOverlay } from "@/components/site/state/OverlayProvider";
import { DEFAULT_SITE_CONFIG, type GlobalCopy } from "@/lib/site/data/siteConfig";

/**
 * Lead-capture modal — React-owned (ported from front.js's openQuestModal /
 * setContact / submitModal). Opened via OverlayProvider with an optional
 * per-quest icon/title/desc payload; defaults come from Global Copy.
 *
 * Submit behaviour mirrors the original verbatim: it validates name + contact
 * method + timeline, then shows the success panel. (The original never POSTed
 * the lead anywhere — preserved here; wiring it to /api/leads would be a
 * separate, intentional change.)
 */
type Contact = "wa" | "email" | null;

export function LeadModal({ copy }: { copy?: GlobalCopy }) {
  const c = copy ?? DEFAULT_SITE_CONFIG.globalCopy;
  const { leadModal, closeLeadModal } = useOverlay();
  const { open, icon, title, desc } = leadModal;

  const [contact, setContact] = useState<Contact>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [timeline, setTimeline] = useState("");
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [err, setErr] = useState<{ name?: boolean; contact?: boolean; timeline?: boolean }>({});

  // Reset the form each time the modal opens (mirrors openQuestModal clearing).
  useEffect(() => {
    if (open) {
      setContact(null);
      setName("");
      setPhone("");
      setEmail("");
      setTimeline("");
      setComments("");
      setSubmitted(false);
      setErr({});
    }
  }, [open]);

  const submit = () => {
    const e: typeof err = {};
    if (!name.trim()) e.name = true;
    if (!contact) e.contact = true;
    if (!timeline) e.timeline = true;
    setErr(e);
    if (e.name || e.contact || e.timeline) return;
    setSubmitted(true);
  };

  const errBorder = (bad?: boolean) => (bad ? { borderColor: "var(--orange)" } : undefined);

  return (
    <div
      className={open ? "modal-wrap show" : "modal-wrap"}
      id="modal-wrap"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeLeadModal();
      }}
    >
      <div className="modal" id="modal-inner">
        <button className="modal-close" onClick={() => closeLeadModal()}>
          ✕
        </button>

        <div id="modal-form-content" style={{ display: submitted ? "none" : "block" }}>
          <div className="modal-top-bar">
            <span className="modal-quest-icon" id="modal-icon">
              {icon || "🗺️"}
            </span>
            <h3 id="modal-title">{title || c.questModalHeading}</h3>
            <p id="modal-desc">{desc || c.questModalSubtext}</p>
          </div>

          <div className="modal-body">
            <div className="m-field">
              <label className="m-label">Your first name</label>
              <input
                className="m-input"
                type="text"
                id="m-name"
                placeholder="e.g. Alex"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={errBorder(err.name)}
              />
            </div>

            <div className="m-field">
              <label className="m-label">How should we reach you?</label>
              <div className="contact-toggle">
                <div
                  className={contact === "wa" ? "contact-opt active" : "contact-opt"}
                  id="opt-wa"
                  onClick={() => setContact("wa")}
                  style={errBorder(err.contact)}
                >
                  📱 Text / WhatsApp
                </div>
                <div
                  className={contact === "email" ? "contact-opt active" : "contact-opt"}
                  id="opt-email"
                  onClick={() => setContact("email")}
                  style={errBorder(err.contact)}
                >
                  ✉️ Email
                </div>
              </div>
              <div
                className={contact === "wa" ? "contact-input-reveal open" : "contact-input-reveal"}
                id="reveal-wa"
              >
                <input
                  className="m-input"
                  type="tel"
                  id="m-phone"
                  placeholder="Your WhatsApp number (with country code)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div
                className={contact === "email" ? "contact-input-reveal open" : "contact-input-reveal"}
                id="reveal-email"
              >
                <input
                  className="m-input"
                  type="email"
                  id="m-email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="m-field">
              <label className="m-label">When do you want to start this quest?</label>
              <select
                className="m-select"
                id="m-timeline"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                style={errBorder(err.timeline)}
              >
                <option value="">Pick a timeframe…</option>
                <option value="asap">🔥 ASAP (0–1 month)</option>
                <option value="1-3">📅 1–3 months</option>
                <option value="3-6">🗓️ 3–6 months</option>
                <option value="exploring">👀 Just exploring</option>
              </select>
            </div>

            <div className="m-field">
              <label className="m-label">
                Questions or comments?{" "}
                <span
                  style={{
                    color: "var(--text3)",
                    fontWeight: 400,
                    textTransform: "none",
                    letterSpacing: 0,
                  }}
                >
                  Optional
                </span>
              </label>
              <textarea
                className="m-textarea"
                id="m-comments"
                placeholder="e.g. I'm worried about the visa process, or I have a remote job already…"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              ></textarea>
            </div>

            <button className="m-submit" onClick={submit}>
              Send my quest details
            </button>
          </div>
        </div>

        <div className="modal-success" id="modal-success" style={{ display: submitted ? "block" : "none" }}>
          <span className="s-icon">🎉</span>
          <h4>You&apos;re on the list.</h4>
          <p>
            We&apos;ll be in touch shortly with everything you need to make this quest happen. Get
            ready.
          </p>
        </div>
      </div>
    </div>
  );
}
