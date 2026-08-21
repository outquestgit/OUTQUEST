"use client";

import { useState } from "react";
import { DEFAULT_QUIZ, type QuizConfig } from "@/lib/site/data/quiz";
import {
  handleQuizOverlayClick,
  closeQuiz,
  nextStep,
  showQuizResults,
  retakeQuiz,
  sqCompareQuizMatches,
  mqSaveAllQuizPaths,
  showPage,
} from "@/lib/site/runtime";
import { QuizOption } from "../cards/QuizOption";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Final quiz step — a real gate (when the admin's "Require before results" is
 * on). Results only render after a successful submit; a failed submit shows
 * an inline error and lets the visitor retry without ever seeing results
 * early. Matches are computed (via front.js's `_quizComputeMatches`) without
 * rendering, so they can be posted alongside the lead before the reveal.
 */
function QuizContactStep({
  stepId,
  backStep,
  headline,
  subline,
  ctaLabel,
}: {
  stepId: number;
  backStep: number;
  headline: string;
  subline: string;
  ctaLabel: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const nameErr = !name.trim() ? "Please enter your name." : "";
  const emailErr = !email.trim()
    ? "Please enter your email."
    : !EMAIL_RE.test(email.trim())
      ? "Enter a valid email address."
      : "";

  const submit = async () => {
    setTouched(true);
    if (nameErr || emailErr) return;
    setStatus("sending");
    setErrorMsg("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const answers: [string, string][] = Array.from(
      document.querySelectorAll<HTMLElement>("#quiz-overlay .quiz-opt.selected")
    ).map((el) => {
      const step = el.closest<HTMLElement>("[data-qstep]");
      const q = step?.querySelector(".quiz-q-text")?.textContent?.trim() || "Answer";
      const a = el.querySelector(".quiz-opt-label")?.textContent?.trim() || el.textContent?.trim() || "";
      return [q, a];
    });

    // Compute matches WITHOUT rendering — the gate only reveals results after
    // the submit succeeds.
    const w = window as unknown as { _quizComputeMatches?: () => { picks: { title?: string }[] } };
    const picks = w._quizComputeMatches?.().picks ?? [];
    const badges = ["Best match", "Strong match", "Worth exploring"];
    const matches: [string, string][] = picks
      .map((q, i): [string, string] | null => (q.title ? [badges[Math.min(i, 2)], q.title] : null))
      .filter((m): m is [string, string] => !!m);

    try {
      const { getRecaptchaToken } = await import("@/lib/recaptchaClient");
      const recaptchaToken = await getRecaptchaToken("quiz");
      const res = await fetch("/api/quiz-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail, answers, matches, recaptchaToken }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(out.error || "Could not submit — please try again.");
        setStatus("error");
        return;
      }
      showQuizResults();
      setStatus("idle");
    } catch {
      setErrorMsg("Network error — please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="quiz-step" id={`quiz-step-${stepId}`}>
      <div className="quiz-q-text">{headline}</div>
      <div className="quiz-q-sub">{subline}</div>
      <div className="quiz-contact-fields">
        <input
          type="text"
          placeholder="Your name"
          className="quiz-contact-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="you@email.com"
          className="quiz-contact-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {touched && (nameErr || emailErr) && <div className="quiz-contact-error">{nameErr || emailErr}</div>}
        {status === "error" && <div className="quiz-contact-error">{errorMsg}</div>}
      </div>
      <div className="quiz-nav">
        <button className="quiz-back-btn" onClick={() => nextStep(backStep)}>
          Back
        </button>
        <button className="quiz-next-btn" onClick={submit} disabled={status === "sending"}>
          {status === "sending" ? "Loading…" : ctaLabel}
        </button>
      </div>
    </div>
  );
}

/**
 * "Find My Path" quiz overlay, rendered from the admin-editable Quiz Builder
 * config: an optional intro screen, the builder's questions (each option votes
 * for a result path via `data-path`), and the results panel the runtime fills
 * with the winning path card(s). Navigation/scoring/results live in `front.js`;
 * this supplies the markup. The overlay's visual style is unchanged.
 *
 * When `quiz.settings.collectContact` is on, a final contact-capture step
 * (name + email) gates the results — see `QuizContactStep`.
 */
export function QuizModal({ quiz = DEFAULT_QUIZ }: { quiz?: QuizConfig }) {
  const intro = quiz.intro;
  const questions = quiz.questions.filter((q) => q.show !== false);
  const total = questions.length;
  // First visible screen is the intro (if shown), otherwise question 1.
  const introActive = intro.show;
  const { collectContact, contactHeadline, contactSubline, contactCta } = quiz.settings;

  return (
    <div className="quiz-overlay" id="quiz-overlay" onClick={(e) => handleQuizOverlayClick(e.nativeEvent)}>
      <div className="quiz-box" id="quiz-box">
        <div className="quiz-progress">
          <div className="quiz-progress-bar" id="quiz-progress-bar" style={{ width: "0%" }}></div>
        </div>
        <button className="quiz-close" onClick={() => closeQuiz()} aria-label="Close">
          ✕
        </button>
        <div className="quiz-inner">
          {/* INTRO (step 0) */}
          {intro.show && (
            <div className="quiz-step active" id="quiz-step-0">
              <div className="quiz-q-text">{intro.headline}</div>
              {intro.subline && <div className="quiz-q-sub">{intro.subline}</div>}
              <div className="quiz-nav">
                <button
                  className="quiz-next-btn"
                  data-requires-answer="0"
                  onClick={() => nextStep(1)}
                >
                  {intro.startCta || "Begin"}
                </button>
              </div>
            </div>
          )}

          {/* QUESTIONS (steps 1..N) */}
          {questions.map((q, i) => {
            const step = i + 1;
            const isLast = step === total;
            return (
              <div
                className={!introActive && step === 1 ? "quiz-step active" : "quiz-step"}
                id={`quiz-step-${step}`}
                data-qstep={step}
                key={step}
              >
                <div className="quiz-q-num">
                  Question {step} of {total}
                </div>
                <div className="quiz-q-text">{q.text}</div>
                <div className="quiz-options">
                  {q.options.map((opt, oi) => (
                    <QuizOption option={opt} qIndex={step} key={oi} />
                  ))}
                </div>
                <div className="quiz-nav">
                  {(step > 1 || introActive) && (
                    <button className="quiz-back-btn" onClick={() => nextStep(step - 1)}>
                      Back
                    </button>
                  )}
                  {/* Not `disabled` via React: front.js (retakeQuiz/selectOpt)
                      toggles the `disabled` attribute. A React-managed `disabled`
                      prop makes React's event system swallow the click even after
                      the attribute is removed externally. */}
                  <button
                    className="quiz-next-btn"
                    id={`q${step}-next`}
                    data-requires-answer="1"
                    onClick={() =>
                      isLast ? (collectContact ? nextStep(step + 1) : showQuizResults()) : nextStep(step + 1)
                    }
                  >
                    {isLast && !collectContact ? "See my result" : "Next"}
                  </button>
                </div>
              </div>
            );
          })}

          {/* CONTACT CAPTURE — final step, gates results when collectContact is on */}
          {collectContact && (
            <QuizContactStep
              stepId={total + 1}
              backStep={total}
              headline={contactHeadline}
              subline={contactSubline}
              ctaLabel={contactCta}
            />
          )}

          {/* Submit for the "all visible" / "scroll-snap" progression modes
              (hidden in one-at-a-time mode via CSS on `.quiz-box[data-prog]`). */}
          <div className="quiz-submit-all-wrap">
            <button
              className="quiz-next-btn"
              id="quiz-submit-all"
              data-requires-answer="0"
              onClick={() => (collectContact ? nextStep(total + 1) : showQuizResults())}
            >
              See my results
            </button>
          </div>

                   {/* RESULTS */}
          <div className="quiz-results" id="quiz-results">
            <div className="quiz-results-inner" id="quiz-results-inner">
              <div id="quiz-match-tags" className="quiz-match-tags" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }} />
              <div id="quiz-paths-container" className="quiz-paths-container" />
            </div>
            <div className="quiz-nav quiz-results-nav">
              <button className="quiz-back-btn" onClick={() => retakeQuiz()}>
                Retake
              </button>
              <button className="quiz-next-btn" onClick={() => { closeQuiz(); showPage("quests"); }}>
                Browse all quests
              </button>
            </div>
            <div className="quiz-compare-wrap" id="quiz-compare-wrap" style={{ display: "none" }}>
              <button className="quiz-next-btn" onClick={() => sqCompareQuizMatches()}>
                Compare these paths
              </button>
            </div>
            <div className="quiz-save-all-wrap" id="quiz-save-all-wrap" style={{ display: "none" }}>
              <button className="quiz-next-btn" onClick={() => mqSaveAllQuizPaths()}>
                Save all to My Quests
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
