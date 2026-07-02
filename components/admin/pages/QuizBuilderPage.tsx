"use client";

import { qbUpdatePreview, qbAddQuestion, setStatus, qbPreviewNav, qbSave, qbReset } from "@/lib/admin/runtime";
import type { QuizConfig } from "@/lib/site/data/quiz";

/** A taxonomy term an answer option can filter program results by. */
export interface QuizTaxTerm {
  kind: string;
  slug: string;
  name: string;
}

/**
 * Quiz Builder (`#page-quiz-builder`). The original markup is preserved; the
 * `admin.js` `qb*` functions render the questions/preview into the empty
 * containers, seed from the saved config (`quiz-builder-data`), tag answers with
 * taxonomy filters, and save/publish to `site_settings.quiz`. Results are the
 * matching programs (Deals), filtered by the answers — no result paths.
 */
export function QuizBuilderPage({ quiz, taxonomy = [] }: { quiz?: QuizConfig; taxonomy?: QuizTaxTerm[] }) {
  return (
    <div className="page" id="page-quiz-builder" suppressHydrationWarning>
      {/* Saved quiz config + page-generating taxonomy terms for admin.js (qbInit). */}
      <script
        id="quiz-builder-data"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ quiz: quiz ?? null, taxonomy }).replace(/</g, "\\u003c"),
        }}
      />
      <div style={{ marginBottom: "16px", padding: "12px 15px", background: "rgba(74,108,247,.06)", border: "1px solid rgba(74,108,247,.2)", borderRadius: "10px", fontSize: "12px", color: "var(--muted2)", lineHeight: 1.6 }}>
        <strong style={{ color: "var(--accent3)" }}>✓ Connected to the live quiz</strong>
        <br />
        Questions &amp; answer options here power the live quiz at <code>/quiz</code> on save. Tag each answer with a single <strong>filter</strong> — pick a type (Budget, Duration, or Category) and a term — and results show the matching <strong>Quests</strong> for the visitor&apos;s choices (matched on all chosen filters).
      </div>
      <div className="qb-layout">
        {/* LEFT: EDITOR */}
        <div className="qb-main">
          {/* Intro Section */}
          <div className="qb-intro-card">
            <div className="qb-card-hd">
              Quiz Intro
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div className="toggle-wrap" style={{ margin: 0 }}>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked id="qb-intro-visible" />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label" style={{ fontSize: "11.5px" }}>Show</span>
                </div>
              </div>
            </div>
            <div className="qb-card-bd">
              <div className="qb-field-row2">
                <div className="field" style={{ margin: 0 }}>
                  <label>Headline</label>
                  <input type="text" id="qb-headline" placeholder="e.g. Find Your Quest" onInput={() => qbUpdatePreview()} defaultValue="Find Your Quest" />
                </div>
                <div className="field" style={{ margin: 0 }}>
                  <label>Sub-headline</label>
                  <input type="text" id="qb-subline" placeholder="e.g. Answer 4 quick questions" onInput={() => qbUpdatePreview()} defaultValue="Answer 4 quick questions to find your path." />
                </div>
              </div>
              <div className="qb-field-row2">
                <div className="field" style={{ margin: 0 }}>
                  <label>Start CTA Label</label>
                  <input type="text" id="qb-start-cta" placeholder="e.g. Begin" onInput={() => qbUpdatePreview()} defaultValue="Begin" />
                </div>
                <div className="field" style={{ margin: 0 }}>
                  <label>Quiz Slug</label>
                  <div className="slug-wrap">
                    <span className="slug-prefix">/</span>
                    <input type="text" placeholder="quiz" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div>
            <div className="qb-section-label">Questions</div>
            <div id="qb-questions" style={{ display: "flex", flexDirection: "column", gap: "10px" }}></div>
            <button className="qb-add-section-btn" style={{ marginTop: "10px" }} onClick={() => qbAddQuestion()}>
              ＋ Add Question
            </button>
          </div>

          {/* Save bar */}
          <div style={{ display: "flex", gap: "9px", paddingTop: "4px", borderTop: "1px solid var(--border)", marginTop: "4px" }}>
            <button className="btn btn-primary" onClick={() => qbSave("published")}>
              Save &amp; Publish
            </button>
            <button className="btn btn-ghost" onClick={() => qbSave("draft")}>
              Save Draft
            </button>
            <button className="btn btn-ghost" style={{ marginLeft: "auto" }} onClick={() => qbReset()}>
              Reset
            </button>
          </div>
        </div>

        {/* RIGHT: SIDEBAR */}
        <div className="qb-side">
          {/* Status card */}
          <div className="qb-status-card">
            <div className="qb-card-hd">Status &amp; Settings</div>
            <div className="qb-card-bd">
              <div className="status-toggle" id="qb-pub-status">
                <button className="active-draft" onClick={(e) => setStatus("qb-pub-status", "draft", e.currentTarget)}>
                  Draft
                </button>
                <button onClick={(e) => setStatus("qb-pub-status", "published", e.currentTarget)}>Published</button>
              </div>
              <div className="toggle-wrap">
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
                <span className="toggle-label" style={{ fontSize: "12.5px" }}>Show quiz on Homepage</span>
              </div>
              <div className="toggle-wrap">
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
                <span className="toggle-label" style={{ fontSize: "12.5px" }}>Show quiz on Quests page</span>
              </div>
              <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />
              <div className="field" style={{ margin: 0 }}>
                <label>Progression style</label>
                <select style={{ width: "100%", padding: "7px 10px", border: "1px solid var(--border)", borderRadius: "7px", fontSize: "13px", background: "var(--surface)", fontFamily: "'DM Sans',sans-serif", color: "var(--text)" }}>
                  <option>One question at a time</option>
                  <option>All questions visible</option>
                  <option>Scroll-snap</option>
                </select>
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Results display</label>
                <select style={{ width: "100%", padding: "7px 10px", border: "1px solid var(--border)", borderRadius: "7px", fontSize: "13px", background: "var(--surface)", fontFamily: "'DM Sans',sans-serif", color: "var(--text)" }}>
                  <option>Top match only</option>
                  <option>Top 3 matches</option>
                  <option>All matching paths</option>
                </select>
              </div>
              <div className="qb-meta-row">
                <span>Questions</span>
                <strong id="qb-meta-qcount">0</strong>
              </div>
              <div className="qb-meta-row">
                <span>Last saved</span>
                <strong>—</strong>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="qb-preview-shell">
            <div className="qb-preview-hd">
              Live Preview
              <div style={{ display: "flex", gap: "6px" }}>
                <button id="qb-prev-btn-intro" className="btn btn-ghost btn-sm" onClick={() => qbPreviewNav("intro")} style={{ padding: "3px 9px", fontSize: "11px" }}>
                  Intro
                </button>
                <button id="qb-prev-btn-q" className="btn btn-ghost btn-sm" onClick={() => qbPreviewNav("q")} style={{ padding: "3px 9px", fontSize: "11px" }}>
                  Q1
                </button>
                <button id="qb-prev-btn-result" className="btn btn-ghost btn-sm" onClick={() => qbPreviewNav("result")} style={{ padding: "3px 9px", fontSize: "11px" }}>
                  Result
                </button>
              </div>
            </div>
            <div className="qb-preview-screen" id="qb-preview-area">
              {/* filled by JS */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
