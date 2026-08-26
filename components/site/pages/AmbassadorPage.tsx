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

const LOOKING_FOR = [
  "People who travel",
  "People taking a gap year",
  "People learning something new",
  "People changing direction",
  "People investing in themselves",
  "People looking for their next experience",
];

const WHO: { icon: string; title: string; hook: string; body: string; think: string }[] = [
  {
    icon: "👥",
    title: "Community Leaders",
    hook: "You run the rooms where people gather.",
    body: "You lead an established community, group, club, membership or online space — and people actually pay attention when you share something.",
    think: "Community organisers, group admins, club leaders, membership communities, event communities and online group leaders.",
  },
  {
    icon: "🧘",
    title: "Wellness & Fitness Pros",
    hook: "Your clients already trust your recommendations.",
    body: "You're a yoga teacher, Pilates instructor, trainer, coach or wellness professional with an established community around you.",
    think: "Instructors, studio owners, personal trainers, wellness practitioners and fitness professionals.",
  },
  {
    icon: "✈️",
    title: "Travel Connectors",
    hook: "You're the person people ask: \"Where should I go?\"",
    body: "You know people who travel, explore and look for interesting things to do — and you're naturally the person they turn to for ideas and recommendations.",
    think: "Frequent travellers, travel organisers, digital nomads, expat connectors and travel community members.",
  },
  {
    icon: "🎥",
    title: "Creators & Curators",
    hook: "You know what your audience will want next.",
    body: "You create content, run a newsletter, social channel, podcast, publication or community around travel, wellness, lifestyle, learning, careers or experiences. Your audience doesn't have to be huge — relevance and trust matter more than follower count.",
    think: "Newsletter writers, podcasters, social creators, publications and niche online communities.",
  },
  {
    icon: "🧭",
    title: "Coaches & Mentors",
    hook: "People come to you when they're figuring out what's next.",
    body: "You advise, coach or mentor people around their careers, education, personal development, health, business or life direction — and your recommendations carry weight.",
    think: "Career coaches, life coaches, business mentors, education advisors, professional mentors and personal development coaches.",
  },
];

const STEPS: { icon: string; title: string; body: string }[] = [
  { icon: "📝", title: "Apply", body: "Fill out a super-simple Ambassador application." },
  { icon: "🔗", title: "Share", body: "Send an eligible OutQuest Program to someone in your network." },
  { icon: "✅", title: "They Complete It", body: "They enquire, book within 10 months, and finish the Program." },
  { icon: "💸", title: "You Get Paid", body: "US$500 lands in your pocket. No cap on referrals." },
];

/**
 * "Become an Ambassador" page: photo hero + floating stat card, 4-step "how it
 * works" row, dark "who we want" section, and a simple application form.
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

  const scrollToForm = () => {
    document.getElementById("ambassador-form-anchor")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Page id="ambassador">
      <Breadcrumb trail={[{ label: "Home", page: "home" }]} current="Become an Ambassador" />

      {/* ── HERO: split layout, photo right + floating stat card ───────── */}
      <section
        className="sec"
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          paddingTop: "80px",
          paddingBottom: "40px",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "48px",
          alignItems: "center",
        }}
      >
        <div>
          <div className="label" style={{ marginBottom: "16px" }}>
            OutQuest Ambassador Program
          </div>
          <h1 className="serif-h" style={{ marginBottom: "20px", fontSize: "42px", lineHeight: 1.15 }}>
            Share OutQuest. Earn US$500 when someone you refer goes.
          </h1>
          <p className="sub" style={{ marginBottom: "16px", maxWidth: "480px" }}>
            You don&apos;t need to be an influencer. If you&apos;re part of a great community, have a
            strong personal network, or simply know people looking for their next adventure, skill or
            career move — you could become an OutQuest Ambassador.
          </p>
          <p className="sub" style={{ marginBottom: "32px", maxWidth: "480px" }}>
            No limit to how many qualifying referrals you can make.
          </p>
          <Button style={{ padding: "14px 32px" }} onClick={scrollToForm}>
            Apply Now
          </Button>
        </div>

        <div style={{ position: "relative" }}>
          <div
            style={{
              borderRadius: "24px",
              overflow: "hidden",
              aspectRatio: "4 / 5",
              boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ambassador/hero.jpg"
              alt="Friends celebrating together"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>

          {/* Floating stat card */}
          <div
            style={{
              position: "absolute",
              bottom: "-24px",
              left: "-28px",
              background: "var(--white)",
              borderRadius: "16px",
              padding: "18px 22px",
              boxShadow: "0 12px 32px rgba(0,0,0,0.16)",
              transform: "rotate(-4deg)",
              maxWidth: "220px",
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text2)", letterSpacing: "0.5px" }}>
              PER SUCCESSFUL REFERRAL
            </div>
            <div style={{ fontFamily: "var(--serif)", fontSize: "30px", color: "var(--orange)" }}>
              US$500 💸
            </div>
          </div>
        </div>
      </section>

      <section className="sec" style={{ maxWidth: "780px", margin: "0 auto", paddingTop: "60px" }}>
        {/* ── HOW IT WORKS: 4-step row ───────────────────────────────── */}
        <h3
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 400,
            letterSpacing: 0,
            lineHeight: 0.95,
            fontSize: "clamp(38px, 5vw, 68px)",
            marginBottom: "28px",
          }}
        >
          How it works
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "64px",
          }}
        >
          {STEPS.map((s, i) => (
            <div key={s.title} style={{ textAlign: "center", position: "relative" }}>
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  margin: "0 auto 12px",
                  position: "relative",
                }}
              >
                {s.icon}
                <div
                  style={{
                    position: "absolute",
                    bottom: "-6px",
                    right: "-6px",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "var(--orange)",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {i + 1}
                </div>
              </div>
              <h4 style={{ fontFamily: "var(--serif)", fontSize: "15px", fontWeight: 400, marginBottom: "4px" }}>
                {s.title}
              </h4>
              <p style={{ fontSize: "12px", color: "var(--text2)", lineHeight: 1.5, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>

        {/* ── WHO WE WANT: dark section ──────────────────────────────── */}
        <div
          style={{
            background: "#141414",
            borderRadius: "24px",
            padding: "48px 36px",
            marginBottom: "64px",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--serif)",
              fontSize: "26px",
              fontWeight: 400,
              color: "#fff",
              textAlign: "center",
              marginBottom: "6px",
            }}
          >
            Who we want as Ambassadors
          </h3>
          <p
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.6)",
              fontSize: "14px",
              maxWidth: "480px",
              margin: "0 auto 20px",
              lineHeight: 1.6,
            }}
          >
            We&apos;re looking for people who are already connected to curious, active, ambitious people
            looking for what&apos;s next.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "40px",
            }}
          >
            {LOOKING_FOR.map((tag) => (
              <span
                key={tag}
                style={{
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: "999px",
                  padding: "6px 14px",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            {WHO.map((w) => (
              <div
                key={w.title}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  padding: "22px 20px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: "rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    marginBottom: "14px",
                  }}
                >
                  {w.icon}
                </div>
                <h4 style={{ color: "#fff", fontSize: "15px", fontWeight: 700, marginBottom: "6px" }}>
                  {w.title}
                </h4>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px", fontStyle: "italic", marginBottom: "8px" }}>
                  {w.hook}
                </p>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "12.5px", lineHeight: 1.6, marginBottom: "10px" }}>
                  {w.body}
                </p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11.5px", lineHeight: 1.5, margin: 0 }}>
                  <strong style={{ color: "rgba(255,255,255,0.55)" }}>Think:</strong> {w.think}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── APPLICATION FORM ───────────────────────────────────────── */}
        <div
          id="ambassador-form-anchor"
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
                Thanks{name.split(" ")[0] ? `, ${name.split(" ")[0]}` : ""} — we review applications based
                on the relevance of your network. If you&apos;re selected, we&apos;ll be in touch with next
                steps.
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
