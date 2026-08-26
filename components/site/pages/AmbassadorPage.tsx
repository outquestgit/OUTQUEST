"use client";

import { useState, type CSSProperties } from "react";
import { Page } from "../Page";
import { Breadcrumb } from "../cards/Breadcrumb";
import { Button } from "../ui/Button";
import { getRecaptchaToken } from "@/lib/recaptchaClient";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const errStyle: CSSProperties = { color: "#d9303e", fontSize: "12px", marginTop: "4px" };

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
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--orange)";
  },
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--border)";
  },
};

const sectionHeading: CSSProperties = {
  fontFamily: "var(--serif)",
  fontWeight: 400,
  letterSpacing: 0,
  lineHeight: 1.1,
  fontSize: "clamp(30px, 4vw, 46px)",
  marginBottom: "16px",
};

const STRIP: { emoji: string; title: string; sub: string }[] = [
  { emoji: "🧭", title: "Go Somewhere", sub: "Travel & adventure" },
  { emoji: "📚", title: "Learn Something", sub: "Courses & certifications" },
  { emoji: "🌿", title: "Feel Something", sub: "Wellness & experiences" },
  { emoji: "✨", title: "Try Something New", sub: "Activities & opportunities" },
];

const COLLAGE: { emoji: string; label: string }[] = [
  { emoji: "👥", label: "Community" },
  { emoji: "✈️", label: "Travel" },
  { emoji: "🌿", label: "Wellness" },
  { emoji: "🎥", label: "Creators" },
  { emoji: "🧭", label: "Coaches" },
  { emoji: "🔗", label: "Connectors" },
];

const HOW: { title: string; body: string }[] = [
  { title: "Apply", body: "Tell us a little about yourself, your network and the kinds of people you know." },
  { title: "Get Approved", body: "We review applications and select ambassadors who are a good fit for OutQuest." },
  { title: "Start Sharing", body: "Once you're approved, you'll get access to OutQuest programs and ambassador resources you can share." },
  { title: "Earn", body: "When someone you refer books and completes a qualifying program, you earn US$500." },
];

const ROLE_OPTIONS = ["Creator", "Community leader", "Travel", "Wellness", "Coach / Mentor", "Professional", "Other"];
const SHARE_OPTIONS = ["Personal recommendations", "Community / group", "Social media", "Events / classes", "Newsletter / email", "Other"];

/**
 * "Become an Ambassador" page — identity-led rebuild: leads with who the
 * ambassador is, not the payout. Hero keeps the existing photo; everything
 * else favours photography/whitespace over cards and copy. Self-contained
 * (not CMS-driven). Posts to /api/ambassador; leads land in the admin Leads
 * dashboard (Ambassadors tab) and are emailed to Settings → Email recipients.
 */
export function AmbassadorPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("");
  const [network, setNetwork] = useState("");
  const [shareMethods, setShareMethods] = useState<string[]>([]);
  const [whyFit, setWhyFit] = useState("");
  const [extra, setExtra] = useState("");
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

  const toggleShare = (opt: string) => {
    setShareMethods((prev) => (prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]));
  };

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
        body: JSON.stringify({
          name,
          email,
          location,
          role,
          network,
          shareMethods,
          whyFit,
          extra,
          recaptchaToken,
        }),
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

  const scrollToForm = () => {
    document.getElementById("ambassador-form-anchor")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Page id="ambassador">
      <Breadcrumb trail={[{ label: "Home", page: "home" }]} current="Become an Ambassador" />

      {/* ── HERO: identity-led headline, $500 as a small line, not a card ── */}
      <section
        className="sec"
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          paddingTop: "80px",
          paddingBottom: "60px",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "48px",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ ...sectionHeading, fontSize: "clamp(36px, 4.5vw, 54px)", marginBottom: "20px" }}>
            Be the one who knows what&apos;s next.
          </h1>
          <p className="sub" style={{ marginBottom: "20px", maxWidth: "480px" }}>
            You know the people who are always looking for somewhere new to go, something new to
            learn, or their next adventure. Become an OutQuest Ambassador and get rewarded for
            introducing them to something they&apos;ll love.
          </p>
          <Button style={{ padding: "14px 32px", marginBottom: "14px" }} onClick={scrollToForm}>
            Apply to Become an Ambassador
          </Button>
          <p style={{ fontSize: "13px", color: "var(--text2)", maxWidth: "440px", margin: 0 }}>
            Selected ambassadors earn US$500 for every qualifying referral that books and completes
            an eligible program.
          </p>
        </div>

        <div style={{ borderRadius: "24px", overflow: "hidden", aspectRatio: "4 / 5", boxShadow: "0 20px 50px rgba(0,0,0,0.18)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ambassador/hero.jpg"
            alt="Friends celebrating together"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      </section>

      {/* ── YOU KNOW THE PEOPLE ─────────────────────────────────────────── */}
      <section className="sec" style={{ maxWidth: "780px", margin: "0 auto", paddingBottom: "72px", textAlign: "center" }}>
        <h2 style={sectionHeading}>
          You know the people.
          <br />
          And you know what they&apos;d love.
        </h2>
        <p className="sub" style={{ maxWidth: "520px", margin: "0 auto 8px" }}>
          You&apos;re the friend who sends the link. The person who knows where to go. The one who
          hears about someone&apos;s plans and immediately thinks —
        </p>
        <p style={{ fontFamily: "var(--serif)", fontSize: "20px", color: "var(--text)", margin: "0 0 24px" }}>
          &ldquo;Wait — I know something perfect for you.&rdquo;
        </p>
        <p className="sub" style={{ maxWidth: "480px", margin: "0 auto 48px" }}>
          OutQuest gives you more things worth sharing.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          {STRIP.map((s) => (
            <div key={s.title}>
              <div
                style={{
                  aspectRatio: "1 / 1",
                  borderRadius: "16px",
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  marginBottom: "10px",
                }}
              >
                {s.emoji}
              </div>
              <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "2px" }}>
                {s.title.toUpperCase()}
              </div>
              <div style={{ fontSize: "11.5px", color: "var(--text2)" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO WE'RE LOOKING FOR ───────────────────────────────────────── */}
      <section className="sec" style={{ maxWidth: "780px", margin: "0 auto", paddingBottom: "72px", textAlign: "center" }}>
        <h2 style={sectionHeading}>Who we&apos;re looking for</h2>
        <p className="sub" style={{ maxWidth: "480px", margin: "0 auto 8px" }}>
          People who love connecting others with great things.
        </p>
        <p className="sub" style={{ maxWidth: "540px", margin: "0 auto 8px" }}>
          You might be a creator, community leader, travel lover, wellness professional, coach,
          entrepreneur — or simply someone with a great network. You don&apos;t need to be famous.
        </p>
        <p className="sub" style={{ maxWidth: "540px", margin: "0 auto 40px" }}>
          What matters is that you know people, understand what they&apos;re looking for, and have a
          genuine reason to recommend something.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {COLLAGE.map((c) => (
            <div
              key={c.label}
              style={{
                aspectRatio: "1 / 1",
                borderRadius: "16px",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <div style={{ fontSize: "28px" }}>{c.emoji}</div>
              <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}>{c.label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY BECOME AN AMBASSADOR: sparse, 3 horizontal pieces ──────── */}
      <section className="sec" style={{ maxWidth: "780px", margin: "0 auto", paddingBottom: "72px", textAlign: "center" }}>
        <h2 style={sectionHeading}>Why become an Ambassador?</h2>
        <p style={{ fontFamily: "var(--serif)", fontSize: "22px", color: "var(--text2)", marginBottom: "48px" }}>
          Discover more. Share more. Earn more.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "36px", textAlign: "left", maxWidth: "560px", margin: "0 auto" }}>
          <div>
            <div style={{ fontFamily: "var(--serif)", fontSize: "28px", color: "var(--orange)", marginBottom: "6px" }}>
              US$500
            </div>
            <p style={{ fontSize: "14px", color: "var(--text2)", margin: 0 }}>
              For every qualifying referral that books and completes an eligible program.
            </p>
          </div>
          <div>
            <div style={{ fontFamily: "var(--serif)", fontSize: "18px", marginBottom: "6px" }}>
              Something worth sharing
            </div>
            <p style={{ fontSize: "14px", color: "var(--text2)", margin: 0 }}>
              Access to OutQuest programs, experiences and opportunities you can recommend to your
              network.
            </p>
          </div>
          <div>
            <div style={{ fontFamily: "var(--serif)", fontSize: "18px", marginBottom: "6px" }}>
              A place in the network
            </div>
            <p style={{ fontSize: "14px", color: "var(--text2)", margin: 0 }}>
              Join a selected community of people helping others discover what&apos;s next.
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section className="sec" style={{ maxWidth: "560px", margin: "0 auto", paddingBottom: "72px", textAlign: "center" }}>
        <h2 style={sectionHeading}>How it works</h2>
        <p className="sub" style={{ marginBottom: "40px" }}>Apply. Get approved. Start sharing.</p>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {HOW.map((h, i) => (
            <div key={h.title} style={{ width: "100%" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "1px", color: "var(--orange)", marginBottom: "6px" }}>
                {h.title.toUpperCase()}
              </div>
              <p style={{ fontSize: "14px", color: "var(--text2)", lineHeight: 1.6, marginBottom: i < HOW.length - 1 ? "20px" : "0" }}>
                {h.body}
              </p>
              {i < HOW.length - 1 && (
                <div style={{ fontSize: "18px", color: "var(--border)", marginBottom: "20px" }}>↓</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── THE IMPORTANT PART: selective, not "anyone can join" ───────── */}
      <section className="sec" style={{ maxWidth: "700px", margin: "0 auto", paddingBottom: "72px" }}>
        <div
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: "20px",
            padding: "40px 36px",
            textAlign: "center",
          }}
        >
          <p style={{ fontFamily: "var(--serif)", fontSize: "20px", marginBottom: "18px" }}>
            You don&apos;t become an ambassador just by signing up.
          </p>
          <p style={{ fontSize: "14px", color: "var(--text2)", lineHeight: 1.7, marginBottom: "14px" }}>
            We review every application. We&apos;re building a network of people who genuinely connect
            others with interesting experiences, opportunities and things worth doing.
          </p>
          <p style={{ fontSize: "14px", color: "var(--text2)", lineHeight: 1.7, margin: 0 }}>
            If you&apos;re selected, we&apos;ll invite you in.
          </p>
        </div>
      </section>

      {/* ── FINAL BIG IMAGE, full width, overlay CTA ───────────────────── */}
      <section
        style={{
          position: "relative",
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
          height: "520px",
          marginBottom: "72px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ambassador/hero.jpg"
          alt="Friends on an adventure"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 24px",
          }}
        >
          <h2 style={{ ...sectionHeading, color: "#fff", fontSize: "clamp(28px, 4vw, 44px)", marginBottom: "20px" }}>
            Know what&apos;s next for someone?
            <br />
            You could be the reason they go.
          </h2>
          <Button style={{ padding: "14px 32px", marginBottom: "12px" }} onClick={scrollToForm}>
            Apply to Become an Ambassador
          </Button>
          <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.75)", margin: 0 }}>
            Applications are reviewed individually.
          </p>
        </div>
      </section>

      {/* ── APPLICATION FORM ────────────────────────────────────────────── */}
      <section className="sec" style={{ maxWidth: "700px", margin: "0 auto", paddingBottom: "100px" }}>
        <div
          id="ambassador-form-anchor"
          style={{
            background: "var(--white)",
            border: "1px solid var(--border)",
            borderRadius: "20px",
            padding: "40px 36px",
          }}
        >
          <h3 style={{ fontFamily: "var(--serif)", fontSize: "24px", fontWeight: 400, marginBottom: "6px", textAlign: "center" }}>
            Tell us about yourself.
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text2)", marginBottom: "28px", textAlign: "center", maxWidth: "460px", margin: "0 auto 28px" }}>
            We&apos;re looking for people with great networks, genuine influence and a love for
            discovering what&apos;s worth doing.
          </p>

          {sent ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "8px 0", textAlign: "center" }}>
              <div style={{ fontSize: "40px" }}>🎉</div>
              <h4 style={{ fontFamily: "var(--serif)", fontSize: "18px", fontWeight: 400 }}>
                Application received.
              </h4>
              <p style={{ fontSize: "14px", color: "var(--text2)", lineHeight: 1.6, margin: "0 auto", maxWidth: "400px" }}>
                Thanks for applying to become an OutQuest Ambassador. We&apos;ll review your
                application and be in touch if you&apos;re selected.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
                  <label style={labelStyle}>Email</label>
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
                <label style={labelStyle}>Which best describes you?</label>
                <select
                  style={fieldStyle}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  {...focusProps}
                >
                  <option value="">Select one…</option>
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Tell us about your network</label>
                <textarea
                  placeholder="Who are the people, communities or groups you could introduce to OutQuest?"
                  rows={4}
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

              <div>
                <label style={labelStyle}>How would you share OutQuest?</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {SHARE_OPTIONS.map((opt) => {
                    const active = shareMethods.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleShare(opt)}
                        style={{
                          padding: "8px 14px",
                          borderRadius: "999px",
                          fontSize: "12.5px",
                          border: `1px solid ${active ? "var(--orange)" : "var(--border)"}`,
                          background: active ? "var(--orange)" : "var(--bg)",
                          color: active ? "#fff" : "var(--text2)",
                          cursor: "pointer",
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Why would OutQuest be a good fit for your network?</label>
                <textarea
                  placeholder="Optional — but it helps us understand the fit."
                  rows={3}
                  value={whyFit}
                  onChange={(e) => setWhyFit(e.target.value)}
                  style={fieldStyle}
                  {...focusProps}
                ></textarea>
              </div>

              <div>
                <label style={labelStyle}>Anything else you&apos;d like us to know?</label>
                <textarea
                  placeholder="Optional"
                  rows={2}
                  value={extra}
                  onChange={(e) => setExtra(e.target.value)}
                  style={fieldStyle}
                  {...focusProps}
                ></textarea>
              </div>

              {error && <div style={{ color: "#d9303e", fontSize: "13px" }}>{error}</div>}
              <Button
                style={{ alignSelf: "center", padding: "14px 40px", opacity: sending ? 0.7 : 1 }}
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
