"use client";

import { useState } from "react";
import type { Deal, LeadFormField } from "@/lib/deals";
import { getRecaptchaToken } from "@/lib/recaptchaClient";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const errStyle: React.CSSProperties = { color: "#d9303e", fontSize: "12px", marginTop: "4px" };

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1.5px solid var(--border)",
  background: "#fff",
  fontSize: "14px",
  fontFamily: "inherit",
  color: "var(--text)",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--text)",
  marginBottom: "7px",
};

/**
 * Lead-capture form shown on a deal page when `action_type === "leadform"`.
 * Renders Name + Email (always) plus the deal's admin-defined custom fields,
 * and POSTs to `/api/leads` — the submission appears in the admin Leads table.
 */
export function DealLeadForm({ deal }: { deal: Deal }) {
  const fields = deal.lead_form_fields ?? [];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [values, setValues] = useState<Record<number, string | string[]>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean }>({});

  // A lead always needs a name + email. We render built-in Name/Email boxes —
  // UNLESS the admin's own field list already includes an equivalent, in which
  // case that custom field is the source (so there's never a duplicate box and
  // every admin-defined field still renders).
  const asStr = (v: string | string[] | undefined) => (Array.isArray(v) ? "" : String(v ?? ""));
  const emailIdx = fields.findIndex(
    (f) =>
      f.type === "email" ||
      ["email", "e-mail", "email address", "your email"].includes(f.label.trim().toLowerCase())
  );
  const nameIdx = fields.findIndex((f) =>
    ["name", "full name", "your name"].includes(f.label.trim().toLowerCase())
  );
  const showCoreName = nameIdx === -1;
  const showCoreEmail = emailIdx === -1;
  const effName = (showCoreName ? name : asStr(values[nameIdx])).trim();
  const effEmail = (showCoreEmail ? email : asStr(values[emailIdx])).trim();

  // Progressive validation for the resolved core values (built-in or custom).
  const coreErrs = {
    name: !effName ? "Please enter your name." : "",
    email: !effEmail
      ? "Please enter your email."
      : !EMAIL_RE.test(effEmail)
        ? "Enter a valid email address."
        : "",
  };
  const fieldStyleFor = (f: "name" | "email"): React.CSSProperties =>
    touched[f] && coreErrs[f] ? { ...inputStyle, borderColor: "#d9303e" } : inputStyle;

  const setVal = (i: number, v: string | string[]) =>
    setValues((prev) => ({ ...prev, [i]: v }));

  const toggleMulti = (i: number, opt: string) =>
    setValues((prev) => {
      const cur = Array.isArray(prev[i]) ? (prev[i] as string[]) : [];
      return { ...prev, [i]: cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt] };
    });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Core fields (name/email) progressive validation.
    setTouched({ name: true, email: true });
    if (coreErrs.name || coreErrs.email) {
      // Built-in boxes show inline errors; surface a message for custom-sourced
      // name/email (which have no inline error line).
      const customErr = (!showCoreName && coreErrs.name) || (!showCoreEmail && coreErrs.email) || "";
      setErrorMsg(customErr);
      setStatus(customErr ? "error" : "idle");
      return;
    }
    // Client-side required check (server validates name/email too).
    for (let i = 0; i < fields.length; i++) {
      const f = fields[i];
      if (!f.required) continue;
      const v = values[i];
      const empty = Array.isArray(v) ? v.length === 0 : !String(v ?? "").trim();
      if (empty) {
        setErrorMsg(`Please fill in “${f.label}”.`);
        setStatus("error");
        return;
      }
    }
    setStatus("sending");
    setErrorMsg("");
    // Custom fields → answers, excluding any that already feed the core
    // name/email (so they aren't duplicated in the admin Leads view).
    const answers: [string, string][] = fields
      .map((f, i): [string, string] => {
        const v = values[i];
        return [f.label, Array.isArray(v) ? v.join(", ") : String(v ?? "")];
      })
      .filter((_, i) => i !== nameIdx && i !== emailIdx);
    // The quest the visitor came from (quest page links carry ?from=<slug>).
    const questSlug =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("from") ?? ""
        : "";
    try {
      const recaptchaToken = await getRecaptchaToken("lead");
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealSlug: deal.slug, questSlug, name: effName, email: effEmail, answers, recaptchaToken }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(out.error || "Could not submit — please try again.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setErrorMsg("Network error — please try again.");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="dp-end-cta" style={{ marginTop: "8px" }}>
        <h3>Thanks, {effName.split(" ")[0] || "there"}! 🎉</h3>
        <p style={{ marginBottom: 0 }}>
          We&apos;ve got your details and will be in touch shortly about {deal.title}.
        </p>
      </div>
    );
  }

  const renderField = (f: LeadFormField, i: number) => {
    const ph = f.placeholder ?? "";
    const val = values[i];
    switch (f.type) {
      case "long_text":
        return (
          <textarea
            rows={3}
            placeholder={ph}
            style={{ ...inputStyle, resize: "vertical" }}
            value={typeof val === "string" ? val : ""}
            onChange={(e) => setVal(i, e.target.value)}
          />
        );
      case "dropdown":
        return (
          <select
            style={inputStyle}
            value={typeof val === "string" ? val : ""}
            onChange={(e) => setVal(i, e.target.value)}
          >
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
              <label key={k} style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "14px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name={`lcf-${i}`}
                  checked={val === o}
                  onChange={() => setVal(i, o)}
                />
                {o}
              </label>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {(f.options ?? []).map((o, k) => (
              <label key={k} style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "14px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={Array.isArray(val) && val.includes(o)}
                  onChange={() => toggleMulti(i, o)}
                />
                {o}
              </label>
            ))}
          </div>
        );
      default:
        return (
          <input
            type={f.type === "email" ? "email" : f.type === "phone" ? "tel" : "text"}
            placeholder={ph}
            style={inputStyle}
            value={typeof val === "string" ? val : ""}
            onChange={(e) => setVal(i, e.target.value)}
          />
        );
    }
  };

  return (
    <form
      onSubmit={submit}
      className="dp-lead-form"
      style={{
        background: "#FEF3EE",
        border: "1.5px solid rgba(232,69,26,0.18)",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "32px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: "18px", fontWeight: 400, marginBottom: "4px", color: "var(--text)" }}>
          {deal.cta_heading || "Enquire about this deal"}
        </h2>
        {deal.cta_subtext && (
          <p style={{ fontSize: "13px", color: "var(--muted, #6b6b6b)", margin: 0 }}>{deal.cta_subtext}</p>
        )}
      </div>

      {showCoreName && (
        <div>
          <label style={labelStyle}>
            Full Name <span style={{ color: "var(--orange)" }}>*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Your name"
            style={fieldStyleFor("name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          />
          {touched.name && coreErrs.name && <div style={errStyle}>{coreErrs.name}</div>}
        </div>
      )}
      {showCoreEmail && (
        <div>
          <label style={labelStyle}>
            Email <span style={{ color: "var(--orange)" }}>*</span>
          </label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            style={fieldStyleFor("email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          />
          {touched.email && coreErrs.email && <div style={errStyle}>{coreErrs.email}</div>}
        </div>
      )}

      {fields.map((f, i) => (
        <div key={i}>
          <label style={labelStyle}>
            {f.label} {f.required && <span style={{ color: "var(--orange)" }}>*</span>}
          </label>
          {renderField(f, i)}
        </div>
      ))}

      {status === "error" && (
        <div style={{ color: "#d9303e", fontSize: "13px" }}>{errorMsg}</div>
      )}

      <button
        type="submit"
        className="dp-claim-btn"
        disabled={status === "sending"}
        style={{ alignSelf: "flex-start", opacity: status === "sending" ? 0.7 : 1 }}
      >
        {status === "sending" ? "Submitting…" : deal.cta_label || "Submit"}
      </button>
    </form>
  );
}
