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

const STRIP: { emoji: string; tag: string; title: string; desc: string }[] = [
  { emoji: "✈️", tag: "WORK ABROAD", title: "Work Abroad", desc: "Jobs, seasonal work & international opportunities." },
  { emoji: "🌍", tag: "MOVE ABROAD", title: "Move Abroad", desc: "Cities, relocation & life overseas." },
  { emoji: "🎓", tag: "GET CERTIFIED", title: "Get Certified", desc: "Credentials, courses & career-changing skills." },
  { emoji: "🚀", tag: "BUILD SOMETHING", title: "Build Something", desc: "Business ideas, income streams & entrepreneurship." },
];

const WHO: { photo: string; label: string; rotate: number; title: string; hook: string; body: string }[] = [
  {
    photo: "/ambassador/who%20community.jpg",
    label: "Community",
    rotate: -3,
    title: "Community Leaders",
    hook: "You bring people together.",
    body: "You run a community, club, membership, group, event series or online space — and people actually listen when you share something.",
  },
  {
    photo: "/ambassador/who%20wellness.jpg",
    label: "Wellness",
    rotate: 2,
    title: "Wellness & Fitness Pros",
    hook: "Your clients already trust your recommendations.",
    body: "You're a yoga teacher, Pilates instructor, trainer, coach, wellness practitioner or fitness professional with a community around you.",
  },
  {
    photo: "/ambassador/who%20travel.jpg",
    label: "Travel",
    rotate: -2,
    title: "Travel Connectors",
    hook: "You're the person people ask where to go.",
    body: "You travel often, organise trips, know interesting places or naturally become the person friends turn to for ideas.",
  },
  {
    photo: "/ambassador/who%20creators.jpg",
    label: "Creators",
    rotate: 3,
    title: "Creators & Curators",
    hook: "You know what's worth discovering.",
    body: "You create content, run a newsletter, curate recommendations or have built an audience around interesting places, people, ideas or experiences.",
  },
  {
    photo: "/ambassador/who%20coaches.jpg",
    label: "Coaches",
    rotate: -2,
    title: "Coaches & Mentors",
    hook: "People come to you when they're figuring out what's next.",
    body: "You help people make decisions, change direction, build confidence or navigate their next chapter.",
  },
  {
    photo: "/ambassador/who%20students.jpg",
    label: "Students",
    rotate: 2,
    title: "Students & Campus Leaders",
    hook: "You're already at the center of a campus network.",
    body: "You lead a club, society, student org or peer group — and your recommendations carry weight with people figuring out what's next.",
  },
];

const WHY: { icon: string; title: string; body: string }[] = [
  {
    icon: "💸",
    title: "Earn US$500 per successful referral",
    body: "Recommend an OutQuest experience to the right person. When they join and qualify, you earn US$500. There's no cap on how many qualifying referrals you can make.",
  },
  {
    icon: "🎁",
    title: "Give your community something genuinely useful",
    body: "Instead of recommending the same trips, courses or generic travel options, give people access to immersive experiences designed around learning, travel and personal growth.",
  },
  {
    icon: "🔄",
    title: "It's easy to fit around what you already do",
    body: "No events to organise, no products to sell and no content quota. Share OutQuest when you genuinely know someone it could be right for.",
  },
];

const HOW: { icon: string; title: string; body: string }[] = [
  { icon: "📝", title: "Apply", body: "Tell us about yourself and your network." },
  { icon: "✅", title: "Get Approved", body: "We review and select the right fit." },
  { icon: "🚀", title: "Start Sharing", body: "Get access to programs to recommend." },
  { icon: "💸", title: "Earn", body: "US$500 per qualifying referral." },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Do I need a large following?",
    a: "No. We care much more about the quality of your relationships and whether people trust your recommendations.",
  },
  {
    q: "Do I need to be an influencer?",
    a: "Absolutely not. You can be a community leader, professional, connector, creator, traveller, coach, organiser — or simply someone with a strong network.",
  },
  {
    q: "How much do I earn?",
    a: "You earn US$500 for every qualifying referral who joins an eligible OutQuest experience.",
  },
  {
    q: "Is there a limit?",
    a: "No. There is no limit to the number of qualifying referrals you can make.",
  },
  {
    q: "Do I have to post on social media?",
    a: "No. OutQuest is built around genuine recommendations. Share however you naturally communicate with your people.",
  },
  {
    q: "What counts as a referral?",
    a: "A referral is someone who discovers OutQuest through your referral mechanism and subsequently completes a qualifying purchase.",
  },
  {
    q: "Can I refer friends and people I know personally?",
    a: "Yes. In fact, that's exactly the kind of recommendation we're looking for — provided the referral meets the program's qualifying criteria.",
  },
  {
    q: "What happens after I apply?",
    a: "We'll review your application and, if there's a fit, invite you to join the Ambassador program with everything you need to get started.",
  },
];

const ROLE_OPTIONS = [
  "Creator / Content Creator",
  "Community Leader / Organizer",
  "Business Owner / Entrepreneur",
  "Coach / Consultant",
  "Educator / Instructor",
  "Fitness / Wellness Professional",
  "Travel Professional",
  "Event Organizer",
  "Student / Alumni Leader",
  "Sales / Business Development Professional",
  "HR / People & Culture Professional",
  "Founder / Startup Community Member",
  "Other",
];
const SHARE_OPTIONS = ["Personal recommendations", "Community / group", "Social media", "Events / classes", "Newsletter / email", "Other"];

/**
 * "Become an Ambassador" page — identity-led rebuild: leads with who the
 * ambassador is, not the payout. Hero keeps the existing photo; sections use
 * icon-based cards and a numbered/arrow step flow rather than photography
 * (no second photo uploaded yet — see the final CTA section comment for
 * where one would slot in). Self-contained (not CMS-driven). Posts to
 * /api/ambassador; leads land in the admin Leads dashboard (Ambassadors tab)
 * and are emailed to Settings → Email recipients.
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
        
          <div className="label" style={{ marginBottom: "12px" }}>LEAD THE ADVENTURE</div>
          <h1 style={{ ...sectionHeading, fontSize: "clamp(36px, 4.5vw, 54px)", marginBottom: "20px" }}>
            {/* ── YOU KNOW THE PEOPLE ─────────────────────────────────────────── */}
      <section className="sec" style={{ maxWidth: "780px", margin: "0 auto", paddingBottom: "72px", textAlign: "center" }}>
          <p className="sub" style={{ marginBottom: "16px", maxWidth: "480px" }}>
            OutQuest Ambassadors are the curious ones, the connectors, the people who are always
            finding the next great thing — and bringing others along with them.
          </p>
          <p className="sub" style={{ marginBottom: "20px", maxWidth: "480px" }}>
            Turn your influence into inspiration. Discover new opportunities, share what excites
            you and help your people make their next move.
          </p>
          <Button style={{ padding: "14px 32px", marginBottom: "14px" }} onClick={scrollToForm}>
            Become an Ambassador
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
        
<h2 style={sectionHeading}>
          Some people send memes.
          <br />
          You send life-changing links.
        </h2>
        <p className="sub" style={{ maxWidth: "540px", margin: "0 auto 20px" }}>
          You&apos;re not the person they call when they want another opinion. You&apos;re the
          person they call when they&apos;re ready to do something about it.
        </p>
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "18px", color: "var(--text)", margin: "0 0 6px" }}>
            &ldquo;I want to move.&rdquo;
          </p>
          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "18px", color: "var(--text)", margin: "0 0 6px" }}>
            &ldquo;I want to change careers.&rdquo;
          </p>
          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "18px", color: "var(--text)", margin: "0 0 6px" }}>
            &ldquo;I want to build something.&rdquo;
          </p>
          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "18px", color: "var(--text)", margin: 0 }}>
            &ldquo;I want to go somewhere.&rdquo;
          </p>
        </div>
        <p className="sub" style={{ maxWidth: "480px", margin: "0 auto 20px" }}>
          And you&apos;re already thinking, <em>I know exactly where to send you.</em>
        </p>
        <p className="sub" style={{ maxWidth: "560px", margin: "0 auto 32px" }}>
          OutQuest gives you the links, opportunities and experiences worth sending — so you can
          be the person who helps someone go from &ldquo;someday&rdquo; to &ldquo;let&apos;s
          go.&rdquo;
        </p>
        <Button style={{ padding: "14px 32px", marginBottom: "48px" }} onClick={scrollToForm}>
          Become an Ambassador
        </Button>
     <div className="about-paths-grid" style={{ maxWidth: "1140px", gridTemplateColumns: "repeat(4, 1fr)", gap: "28px" }}>
          {STRIP.map((s) => (
            <div className="about-path-card" key={s.title}>
              <div>
                <div className="about-path-emoji">{s.emoji}</div>
            
                <h3 className="about-path-title">{s.title}</h3>
                <p className="about-path-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO WE'RE LOOKING FOR: polaroid + full copy ─────────────────── */}
      <section className="sec" style={{ maxWidth: "780px", margin: "0 auto", paddingBottom: "72px" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');
          .polaroid { transition: transform 0.25s ease; cursor: default; }
          .polaroid:hover { transform: scale(1.05) rotate(0deg) !important; z-index: 2; }
        `}</style>
        <h2 style={{ ...sectionHeading, textAlign: "center" }}>Who we&apos;re looking for</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "28px", marginTop: "40px" }}>
          {WHO.map((w) => (
            <div key={w.title}>
              <div
                className="polaroid"
                style={{
                  background: "#fff",
                  padding: "10px 10px 28px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                  transform: `rotate(${w.rotate}deg)`,
                  marginBottom: "20px",
                }}
              >
                <div style={{ aspectRatio: "1 / 1", overflow: "hidden", background: "var(--bg)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={w.photo}
                    alt={w.label}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
                <div
                  style={{
                    fontFamily: "'Caveat', cursive",
                    fontSize: "26px",
                    color: "#222",
                    textAlign: "center",
                    marginTop: "8px",
                  }}
                >
                  {w.label}
                </div>
              </div>
              <h4 style={{ fontFamily: "var(--serif)", fontSize: "16px", fontWeight: 400, marginBottom: "6px", textAlign: "center" }}>
                {w.title}
              </h4>
              <p style={{ fontSize: "13px", color: "var(--orange)", fontStyle: "italic", marginBottom: "8px", textAlign: "center" }}>
                {w.hook}
              </p>
              <p style={{ fontSize: "12.5px", color: "var(--text2)", lineHeight: 1.6, margin: 0, textAlign: "center" }}>
                {w.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY BECOME AN AMBASSADOR: icons + horizontal benefits ──────── */}
      <section className="sec" style={{ maxWidth: "700px", margin: "0 auto", paddingBottom: "72px" }}>
        <h2 style={{ ...sectionHeading, textAlign: "center" }}>Why become an Ambassador?</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "32px", marginTop: "40px" }}>
          {WHY.map((w) => (
            <div key={w.title} style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  minWidth: "52px",
                  borderRadius: "14px",
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                }}
              >
                {w.icon}
              </div>
              <div>
                <h4 style={{ fontFamily: "var(--serif)", fontSize: "18px", fontWeight: 400, marginBottom: "6px" }}>
                  {w.title}
                </h4>
                <p style={{ fontSize: "13.5px", color: "var(--text2)", lineHeight: 1.65, margin: 0 }}>{w.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS: numbered circles + connecting arrows ─────────── */}
      <section className="sec" style={{ maxWidth: "900px", margin: "0 auto", paddingBottom: "72px", textAlign: "center" }}>
        <h2 style={sectionHeading}>How it works</h2>
        <p className="sub" style={{ marginBottom: "44px" }}>Apply. Get approved. Start sharing.</p>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
          {HOW.map((h, i) => (
            <div key={h.title} style={{ display: "flex", alignItems: "flex-start" }}>
              <div style={{ width: "150px" }}>
                <div
                  style={{
                    width: "68px",
                    height: "68px",
                    borderRadius: "50%",
                    background: "var(--bg)",
                    border: "2px solid var(--orange)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px",
                    margin: "0 auto 14px",
                    position: "relative",
                  }}
                >
                  {h.icon}
                  <div
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
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
                  {h.title}
                </h4>
                <p style={{ fontSize: "12px", color: "var(--text2)", lineHeight: 1.5, margin: 0, padding: "0 6px" }}>
                  {h.body}
                </p>
              </div>
              {i < HOW.length - 1 && (
                <div style={{ fontSize: "22px", color: "var(--border)", marginTop: "22px", padding: "0 6px" }}>
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>


      {/* ── FINAL BIG IMAGE, full width, overlay CTA ───────────────────── */}
      {/* NOTE: reuses hero.jpg since it's the only photo uploaded so far.
          If you upload a second photo (e.g. /ambassador/final.jpg), swap
          the src below — a different image here would land better than
          repeating the hero shot. */}
      <section
        style={{
          position: "relative",
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
          height: "480px",
          marginBottom: "0",
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

      {/* ── READY-TO-APPLY CTA + FAQ ────────────────────────────────────── */}
      <section className="sec" style={{ maxWidth: "700px", margin: "0 auto", padding: "72px 0", textAlign: "center" }}>
        <h2 style={sectionHeading}>Ready to become an OutQuest Ambassador?</h2>
        <p style={{ fontFamily: "var(--serif)", fontSize: "19px", marginBottom: "8px" }}>
          You already know interesting people.
        </p>
        <p className="sub" style={{ maxWidth: "460px", margin: "0 auto 24px" }}>
          Now you can get rewarded for connecting them with something worth doing.
        </p>
        <Button style={{ padding: "14px 32px", marginBottom: "14px" }} onClick={scrollToForm}>
          Apply to become an Ambassador
        </Button>
        <p style={{ fontSize: "12.5px", color: "var(--text2)", marginBottom: "56px" }}>
          US$500 per qualifying referral · No follower minimum · No limit on referrals
        </p>

        <h3 style={{ fontFamily: "var(--serif)", fontSize: "24px", fontWeight: 400, marginBottom: "24px" }}>
          Frequently asked questions
        </h3>
        <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "10px" }}>
          {FAQS.map((f, i) => {
            const open = openFaq === i;
            return (
              <div
                key={f.q}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  overflow: "hidden",
                  background: "var(--white)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 20px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--serif)",
                    fontSize: "15px",
                    color: "var(--text)",
                    textAlign: "left",
                  }}
                >
                  {f.q}
                  <span style={{ fontSize: "16px", color: "var(--orange)", marginLeft: "12px" }}>
                    {open ? "−" : "+"}
                  </span>
                </button>
                {open && (
                  <div style={{ padding: "0 20px 18px", fontSize: "13.5px", color: "var(--text2)", lineHeight: 1.65 }}>
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
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
