"use client";

import { getRecaptchaToken } from "@/lib/recaptchaClient";
import type { PartnerConfig } from "@/lib/site/data/partner";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const val = (id: string) =>
  (document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null)?.value.trim() ?? "";

/** Progressive validation: show/clear an inline error under a field on blur. */
function pfValidate(input: HTMLInputElement): string {
  const v = input.value.trim();
  let msg = "";
  if (input.id === "pf-name") msg = v ? "" : "Please enter your name.";
  else if (input.id === "pf-email")
    msg = !v ? "Please enter your email." : EMAIL_RE.test(v) ? "" : "Enter a valid email address.";
  input.style.borderColor = msg ? "#d9303e" : "";
  const err = document.getElementById(`${input.id}-err`);
  if (err) err.textContent = msg;
  return msg;
}

/**
 * Submit the partner application to /api/partner (appears in the admin Leads
 * dashboard, Partnership tab), then swap to the existing success state — same
 * DOM behaviour as the reference's front.js submitPartnerForm, plus persistence.
 */
async function handlePartnerSubmit(btn: HTMLButtonElement) {
  const nameEl = document.getElementById("pf-name") as HTMLInputElement | null;
  const emailEl = document.getElementById("pf-email") as HTMLInputElement | null;
  const nameErr = nameEl ? pfValidate(nameEl) : "x";
  const emailErr = emailEl ? pfValidate(emailEl) : "x";
  if (nameErr || emailErr) return;
  const name = val("pf-name");
  const email = val("pf-email");
  const offering = Array.from(document.querySelectorAll<HTMLElement>(".pf-offering-opt.active")).map(
    (el) => el.textContent?.trim() ?? ""
  );
  const orig = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Submitting…";
  try {
    const recaptchaToken = await getRecaptchaToken("partner");
    const res = await fetch("/api/partner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        company: val("pf-company"),
        website: val("pf-website"),
        description: val("pf-desc"),
        offering,
        recaptchaToken,
      }),
    });
    const out = await res.json().catch(() => ({}));
    if (!res.ok) {
      window.alert(out.error || "Could not submit — please try again.");
      btn.disabled = false;
      btn.textContent = orig;
      return;
    }
    const fields = document.getElementById("partner-form-fields");
    const success = document.getElementById("partner-success-state");
    if (fields) fields.style.display = "none";
    if (success) success.style.display = "block";
  } catch {
    window.alert("Network error — please try again.");
    btn.disabled = false;
    btn.textContent = orig;
  }
}

/** Partner application form + success state. */
export function PartnerForm({ form }: { form: PartnerConfig["form"] }) {
  return (
    <section className="partner-form-section" id="partner-form-anchor">
      <div className="partner-form-inner">
        <div className="pf-form-header">
          <span className="pff-emoji">{form.emoji}</span>
          <div className="label" style={{ textAlign: "center" }}>
            {form.label}
          </div>
          <h2>{form.heading}</h2>
          <p className="sub">{form.sub}</p>
        </div>

        <div className="partner-form-card">
          <div id="partner-form-fields">
            <div className="pf-field">
              <label className="pf-label">{form.nameLabel}</label>
              <input
                className="pf-input"
                id="pf-name"
                type="text"
                placeholder="e.g. Jamie Tan"
                onBlur={(e) => pfValidate(e.currentTarget)}
              />
              <div id="pf-name-err" style={{ color: "#d9303e", fontSize: "12px", marginTop: "4px" }}></div>
            </div>
            <div className="pf-field">
              <label className="pf-label">{form.companyLabel}</label>
              <input className="pf-input" id="pf-company" type="text" placeholder="e.g. NomadVisa Co." />
            </div>
            <div className="pf-field">
              <label className="pf-label">{form.websiteLabel}</label>
              <input className="pf-input" id="pf-website" type="url" placeholder="https://yourwebsite.com" />
            </div>
            <div className="pf-field">
              <label className="pf-label">{form.offeringLabel}</label>
              <div className="pf-offering-grid">
                {form.offerings.map((opt, i) => (
                  <div
                    className="pf-offering-opt"
                    key={i}
                    onClick={(e) => e.currentTarget.classList.toggle("active")}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </div>
            <div className="pf-field">
              <label className="pf-label">{form.descLabel}</label>
              <textarea className="pf-textarea" id="pf-desc" placeholder="Tell us what you offer and who it's for in a few sentences…"></textarea>
            </div>
            <div className="pf-field" style={{ marginBottom: 0 }}>
              <label className="pf-label">{form.emailLabel}</label>
              <input
                className="pf-input"
                id="pf-email"
                type="email"
                placeholder="you@company.com"
                onBlur={(e) => pfValidate(e.currentTarget)}
              />
              <div id="pf-email-err" style={{ color: "#d9303e", fontSize: "12px", marginTop: "4px" }}></div>
            </div>
            <button className="pf-submit" onClick={(e) => handlePartnerSubmit(e.currentTarget)}>
              {form.submitLabel}
            </button>
          </div>

          <div className="partner-success" id="partner-success-state">
            <span className="ps-icon">🎉</span>
            <h4>{form.successHeading}</h4>
            <p>{form.successBody}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
