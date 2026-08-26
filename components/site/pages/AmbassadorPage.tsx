"use client";

import { useState, type CSSProperties } from "react";
import { Page } from "../Page";
import { Breadcrumb } from "../cards/Breadcrumb";
import { Button } from "../ui/Button";
import { getRecaptchaToken } from "@/lib/recaptchaClient";

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

const focusProps = {
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "var(--orange)";
  },
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "var(--border)";
  },
};

const WHO: { icon: string; title: string; body: string }[] = [
  { icon: "🧘", title: "A yoga, Pilates or wellness pro", body: "With a community of clients and students." },
  { icon: "✈️", title: "A travel enthusiast", body: "With friends who are always planning their next trip." },
  { icon: "👥", title: "A community leader", body: "Running a group, club, society or online community." },
  { icon: "🎥", title: "A creator", body: "With an audience that trusts your recommendations." },
  { icon: "💼", title: "A professional or entrepreneur", body: "With a strong network of ambitious, curious people." },
  { icon: "🎓", title: "A student or alumni leader", body: "Connected to people looking for international opportunities." },
];

const STEPS: { title: string; body: string }[] = [
  { title: "Join", body: "Apply to become an OutQuest Ambassador. We review applications individually." },
  { title: "Share something worth going for", body: "Find an eligible OutQuest Program that makes sense for someone in your network." },
  { title: "They enquire, book & complete", body: "They submit their details through the OutQuest listing, book within 10 months, and complete the Program." },
  { title: "You earn US$500", body: "Per qualifying completed booking — no limit on how many referrals you can make." },
];

/**
 * "Become an Ambassador" page: program pitch + a simple application form.
 * Self-contained (not CMS-driven) — copy lives here rather than in Settings.
 * Posts to /api/ambassador; leads land in the admin Leads dashboard
 * (Ambassadors tab) and are emailed to the Settings → Email recipients.
 */
export function AmbassadorPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [network, setNetwork] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errs = {
    name: !name.trim() ? "Please enter your name." : "",
    email: !email.trim()
      ? "Please enter your email."
      : !EMAIL_RE.test(email.trim())
        ? "Enter a valid email address."
        : "",
    network: !network.trim() ? "Tell us a little about your network." : "",
  };
  const isValid = !errs.name && !errs.email && !errs.network;
  const fieldProps = (f: keyof typeof errs) => ({
    onFocus: focusProps.onFocus,
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      focusProps.onBlur(e);
      setTouched((t) => ({ ...t, [f]: true }));
    },
    style: touched[f] && errs[f] ? { ...fieldStyle, borderColor: "#d9303e" } : fieldStyle,
  });

  const send = async () => {
    setTouched({ name: true, email: true, network: true });
    if (!isValid) {
      setError("");
      return;
    }
    setSending(true);
    setError("");
    try {
      const recaptchaToken = await getRecaptchaToken("ambassador");
      const res = await fetch("/api/ambassador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, location, socialLink, network, recaptchaToken }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(out.error || "Could not submit — please try again.");
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
    <Page id="ambassador">
      <Breadcrumb trail={[{ label: "Home", page: "home" }]} current="Become an Ambassador" />
      <section className="sec" style={{ maxWidth: "780px", margin: "0 auto", paddingTop: "100px" }}>
        <div className="label">OutQuest Ambassador Program</div>
        <h1 className="serif-h" style={{ marginBottom: "16px" }}>
          Share OutQuest. Earn US$500 when someone you refer goes.
        </h1>
        <p className="sub" style={{ marginBottom: "16px", maxWidth: "560px" }}>
          You don&apos;t need to be an influencer. If you&apos;re part of a great community, have a
          strong personal network, or simply know people looking for their next adventure, skill
          or career move — you could become an OutQuest Ambassador.
        </p>
        <p className="sub" style={{ marginBottom: "52px", maxWidth: "560px" }}>
          Refer someone to an eligible OutQuest Program. If they book and complete it, you earn
          US$500. There&apos;s no limit to how many qualifying referrals you can make.
        </p>

        <h3 style={{ fontFamily: "var(--serif)", fontSize: "20px", fontWeight: 400, marginBottom: "20px" }}>
          This isn&apos;t about followers. It&apos;s about who you know.
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "52px",
          }}
        >
          {WHO.map((w) => (
            <div style={cardStyle} key={w.title}>
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>{w.icon}</div>
              <h4 style={{ fontFamily: "var(--serif)", fontSize: "16px", fontWeight: 400, marginBottom: "6px" }}>
                {w.title}
              </h4>
              <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.5, margin: 0 }}>{w.body}</p>
            </div>
          ))}
        </div>
        <p className="sub" style={{ marginBottom: "52px", maxWidth: "560px" }}>
          A trusted network of 200 people can be more valuable than a large audience that doesn&apos;t
          care. We care more about relevance than reach.
        </p>

        <h3 style={{ fontFamily: "var(--serif)", fontSize: "20px", fontWeight: 400, marginBottom: "20px" }}>
          How it works
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "52px" }}>
          {STEPS.map((s, i) => (
            <div key={s.title} style={{ ...cardStyle, display: "flex", gap: "18px", alignItems: "flex-start" }}>
              <div
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: "22px",
                  color: "var(--orange)",
                  minWidth: "28px",
                }}
              >
                {i + 1}
              </div>
              <div>
                <h4 style={{ fontFamily: "var(--serif)", fontSize: "16px", fontWeight: 400, marginBottom: "4px" }}>
                  {s.title}
                </h4>
                <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.5, margin: 0 }}>{s.body}</p>
              </div>
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
          <h3 style={{ fontFamily: "var(--serif)", fontSize: "20px", fontWeight: 400, marginBottom: "6px" }}>
            Apply to Become an Ambassador
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text2)", marginBottom: "24px" }}>
            Applications are reviewed individually. Not every applicant will be accepted.
          </p>
          {sent ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "8px 0" }}>
              <div style={{ fontSize: "40px" }}>🎉</div>
              <h4 style={{ fontFamily: "var(--serif)", fontSize: "18px", fontWeight: 400 }}>
                Application received
              </h4>
              <p style={{ fontSize: "14px", color: "var(--text2)", lineHeight: 1.6, margin: 0 }}>
                Thanks{name.split(" ")[0] ? `, ${name.split(" ")[0]}` : ""} — we review applications
                based on the relevance of your network. If you&apos;re selected, we&apos;ll be in
                touch with next steps.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Jamie Tan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    {...fieldProps("name")}
                  />
                  {touched.name && errs.name && <div style={errStyle}>{errs.name}</div>}
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    {...fieldProps("email")}
                  />
                  {touched.email && errs.email && <div style={errStyle}>{errs.email}</div>}
                </div>
              </div>
              <div>
                <label style={labelStyle}>City / Country</label>
                <input
                  type="text"
                  placeholder="e.g. Kuala Lumpur, Malaysia"
                  style={fieldStyle}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  {...focusProps}
                />
              </div>
              <div>
                <label style={labelStyle}>Social profile / community link (optional)</label>
                <input
                  type="text"
                  placeholder="Instagram, TikTok, LinkedIn, WhatsApp group, website…"
                  style={fieldStyle}
                  value={socialLink}
                  onChange={(e) => setSocialLink(e.target.value)}
                  {...focusProps}
                />
              </div>
              <div>
                <label style={labelStyle}>Tell us about your network</label>
                <textarea
                  placeholder="Who do you know, and why would OutQuest be relevant to them?"
                  rows={5}
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  onFocus={focusProps.onFocus}
                  onBlur={(e) => {
                    focusProps.onBlur(e);
                    setTouched((t) => ({ ...t, network: true }));
                  }}
                  style={{
                    ...fieldStyle,
                    resize: "vertical",
                    ...(touched.network && errs.network ? { borderColor: "#d9303e" } : {}),
                  }}
                ></textarea>
                {touched.network && errs.network && <div style={errStyle}>{errs.network}</div>}
              </div>
              {error && <div style={{ color: "#d9303e", fontSize: "13px" }}>{error}</div>}
              <Button
                style={{ alignSelf: "flex-start", padding: "13px 32px", opacity: sending ? 0.7 : 1 }}
                onClick={send}
                disabled={sending}
              >
                {sending ? "Submitting…" : "Submit Application"}
              </Button>
            </div>
          )}
        </div>
      </section>
    </Page>
  );
}
