"use client";

import { useState, type CSSProperties } from "react";
import { Page } from "../Page";
import { Breadcrumb } from "../cards/Breadcrumb";
import { Button } from "../ui/Button";
import { showPage } from "@/lib/site/runtime";
import { getRecaptchaToken } from "@/lib/recaptchaClient";
import { DEFAULT_CONTACT, type ContactConfig, type ContactCard } from "@/lib/site/data/contact";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const errStyle: CSSProperties = { color: "#d9303e", fontSize: "12px", marginTop: "4px" };

const cardStyle: CSSProperties = {
  background: "var(--white)",
  border: "1px solid var(--border)",
  borderRadius: "20px",
  padding: "28px 24px",
};

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 700,
  color: "var(--text2)",
  marginBottom: "6px",
  letterSpacing: "0.5px",
};

const fieldStyle: CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  background: "var(--bg)",
  fontSize: "14px",
  color: "var(--text)",
  outline: "none",
  fontFamily: "inherit",
};

/** Highlights the field border on focus, matching the source's inline handlers. */
const focusProps = {
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "var(--orange)";
  },
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "var(--border)";
  },
};

const linkStyle: CSSProperties = { color: "var(--orange)", fontWeight: 700, fontSize: "14px" };

/** Renders an enquiry card's link by type (email / SPA page / url). */
function CardLink({ card }: { card: ContactCard }) {
  if (card.linkType === "email") {
    return (
      <a href={`mailto:${card.linkValue}`} style={linkStyle}>
        {card.linkLabel}
      </a>
    );
  }
  if (card.linkType === "page") {
    return (
      <a onClick={() => showPage(card.linkValue)} style={{ ...linkStyle, cursor: "pointer" }}>
        {card.linkLabel}
      </a>
    );
  }
  return (
    <a href={card.linkValue} style={linkStyle}>
      {card.linkLabel}
    </a>
  );
}

/** Contact page: enquiry cards + message form. Content from CMS (`contact`). */
export function ContactPage({ contact = DEFAULT_CONTACT }: { contact?: ContactConfig }) {
  const { hero, cards, form } = contact;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Progressive validation: errors compute live; shown once a field is touched.
  const errs = {
    name: !name.trim() ? "Please enter your name." : "",
    email: !email.trim()
      ? "Please enter your email."
      : !EMAIL_RE.test(email.trim())
        ? "Enter a valid email address."
        : "",
    message: !message.trim() ? "Please enter a message." : "",
  };
  const isValid = !errs.name && !errs.email && !errs.message;
  const fieldProps = (f: keyof typeof errs) => ({
    onFocus: focusProps.onFocus,
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      focusProps.onBlur(e);
      setTouched((t) => ({ ...t, [f]: true }));
    },
    style: touched[f] && errs[f] ? { ...fieldStyle, borderColor: "#d9303e" } : fieldStyle,
  });

  const send = async () => {
    setTouched({ name: true, email: true, message: true });
    if (!isValid) {
      setError("");
      return;
    }
    setSending(true);
    setError("");
    try {
      const recaptchaToken = await getRecaptchaToken("contact");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, recaptchaToken }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(out.error || "Could not send — please try again.");
        setSending(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Network error — please try again.");
      setSending(false);
    }
  };

  return (
    <Page id="contact">
      <Breadcrumb trail={[{ label: "Home", page: "home" }]} current="Contact" />
      <section className="sec" style={{ maxWidth: "780px", margin: "0 auto", paddingTop: "100px" }}>
        <div className="label">{hero.label}</div>
        <h1 className="serif-h" style={{ marginBottom: "16px" }}>
          {hero.heading}
        </h1>
        <p className="sub" style={{ marginBottom: "52px", maxWidth: "520px" }}>
          {hero.sub}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          {cards.map((card, i) => (
            <div style={cardStyle} key={i}>
              <div style={{ fontSize: "28px", marginBottom: "12px" }}>{card.icon}</div>
              <h3
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: "18px",
                  fontWeight: 400,
                  marginBottom: "8px",
                }}
              >
                {card.title}
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text2)", lineHeight: 1.6, marginBottom: "14px" }}>
                {card.body}
              </p>
              <CardLink card={card} />
            </div>
          ))}
        </div>

        <div
          style={{
            background: "var(--white)",
            border: "1px solid var(--border)",
            borderRadius: "20px",
            padding: "36px 32px",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--serif)",
              fontSize: "20px",
              fontWeight: 400,
              marginBottom: "24px",
            }}
          >
            {form.heading}
          </h3>
          {sent ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "8px 0" }}>
              <div style={{ fontSize: "40px" }}>🎉</div>
              <h4 style={{ fontFamily: "var(--serif)", fontSize: "18px", fontWeight: 400 }}>
                {form.successHeading}
              </h4>
              <p style={{ fontSize: "14px", color: "var(--text2)", lineHeight: 1.6, margin: 0 }}>
                {form.successBody.replace("{name}", name.split(" ")[0] || "for reaching out")}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={labelStyle}>{form.nameLabel}</label>
                  <input
                    type="text"
                    placeholder={form.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    {...fieldProps("name")}
                  />
                  {touched.name && errs.name && <div style={errStyle}>{errs.name}</div>}
                </div>
                <div>
                  <label style={labelStyle}>{form.emailLabel}</label>
                  <input
                    type="email"
                    placeholder={form.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    {...fieldProps("email")}
                  />
                  {touched.email && errs.email && <div style={errStyle}>{errs.email}</div>}
                </div>
              </div>
              <div>
                <label style={labelStyle}>{form.subjectLabel}</label>
                <input
                  type="text"
                  placeholder={form.subjectPlaceholder}
                  style={fieldStyle}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  {...focusProps}
                />
              </div>
              <div>
                <label style={labelStyle}>{form.messageLabel}</label>
                <textarea
                  placeholder={form.messagePlaceholder}
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={focusProps.onFocus}
                  onBlur={(e) => {
                    focusProps.onBlur(e);
                    setTouched((t) => ({ ...t, message: true }));
                  }}
                  style={{
                    ...fieldStyle,
                    resize: "vertical",
                    ...(touched.message && errs.message ? { borderColor: "#d9303e" } : {}),
                  }}
                ></textarea>
                {touched.message && errs.message && <div style={errStyle}>{errs.message}</div>}
              </div>
              {error && <div style={{ color: "#d9303e", fontSize: "13px" }}>{error}</div>}
              <Button
                style={{ alignSelf: "flex-start", padding: "13px 32px", opacity: sending ? 0.7 : 1 }}
                onClick={send}
                disabled={sending}
              >
                {sending ? "Sending…" : form.submitLabel}
              </Button>
            </div>
          )}
        </div>
      </section>
    </Page>
  );
}
