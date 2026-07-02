"use client";

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

/**
 * "Find My Path" quiz overlay, rendered from the admin-editable Quiz Builder
 * config: an optional intro screen, the builder's questions (each option votes
 * for a result path via `data-path`), and the results panel the runtime fills
 * with the winning path card(s). Navigation/scoring/results live in `front.js`;
 * this supplies the markup. The overlay's visual style is unchanged.
 */
export function QuizModal({ quiz = DEFAULT_QUIZ }: { quiz?: QuizConfig }) {
  const intro = quiz.intro;
  const questions = quiz.questions.filter((q) => q.show !== false);
  const total = questions.length;
  // First visible screen is the intro (if shown), otherwise question 1.
  const introActive = intro.show;

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
                    onClick={() => (isLast ? showQuizResults() : nextStep(step + 1))}
                  >
                    {isLast ? "See my result" : "Next"}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Submit for the "all visible" / "scroll-snap" progression modes
              (hidden in one-at-a-time mode via CSS on `.quiz-box[data-prog]`). */}
          <div className="quiz-submit-all-wrap">
            <button
              className="quiz-next-btn"
              id="quiz-submit-all"
              data-requires-answer="0"
              onClick={() => showQuizResults()}
            >
              See my results
            </button>
          </div>

          {/* RESULTS */}
          <div className="quiz-results" id="quiz-results">
            <div className="quiz-results-header">
              <div className="quiz-results-eyebrow">Your Next Chapter</div>
              <div className="quiz-results-title" id="results-title">
                Quests worth exploring
              </div>
              <div className="quiz-results-sub" id="results-sub">
                Based on what matters most to you right now.
              </div>
            </div>
            <div
              id="quiz-match-tags"
              style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "18px" }}
            ></div>
            <div className="quiz-paths" id="quiz-paths-container"></div>
            <div className="quiz-results-cta">
              <div className="sq-quiz-compare-block">
                <div className="sq-quiz-compare-title">Can&apos;t decide?</div>
                <div className="sq-quiz-compare-copy">
                  Compare your top matches side by side before choosing a direction.
                </div>
                <button className="sq-quiz-compare-btn" onClick={() => sqCompareQuizMatches()}>
                  Compare all 3 paths
                </button>
              </div>
              <button
                className="btn-orange"
                onClick={() => {
                  closeQuiz();
                  showPage("quests");
                }}
              >
                Browse all quests
              </button>
              <div className="quiz-save-all" id="quiz-save-all">
                <button
                  className="quiz-save-all-btn"
                  id="quiz-save-all-btn"
                  onClick={() => mqSaveAllQuizPaths()}
                >
                  🔖 Save these to My Quests
                </button>
              </div>
              <br />
              <button className="quiz-retake" onClick={() => retakeQuiz()}>
                Retake the quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
