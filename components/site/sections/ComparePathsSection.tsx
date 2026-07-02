"use client";

import type { HomepageConfig } from "@/lib/site/data/homepage";
import { sqClearCompare, openQuiz } from "@/lib/site/runtime";

/** Interactive "compare paths" — the select grid + board are runtime-rendered. */
export function ComparePathsSection({ comparePaths }: { comparePaths: HomepageConfig["comparePaths"] }) {
  return (
    <section className="sq-compare-section" id="compare-paths">
      <div className="sq-compare-wrap">
        <div className="sq-compare-head">
          <div className="sq-compare-head-left">
            <div className="sq-compare-kicker">{comparePaths.kicker}</div>
            <h2 className="sq-compare-title">{comparePaths.title}</h2>
            <p className="sq-compare-copy">{comparePaths.copy}</p>
          </div>
          <div className="sq-compare-count" id="sqCompareCount">
            0 / 3 selected
          </div>
        </div>

        <div className="sq-compare-select-grid" id="sqCompareSelectGrid" aria-label="Choose up to three paths to compare"></div>

        <div className="sq-compare-board">
          <div id="sqCompareOutput">
            <div className="sq-compare-empty">
              <div>
                <strong>No paths selected yet.</strong>
                <p>Choose one, two, or three cards above to build a side-by-side comparison.</p>
              </div>
            </div>
          </div>
          <div className="sq-compare-actions">
            <button className="sq-compare-clear" onClick={() => sqClearCompare()}>
              {comparePaths.clearLabel}
            </button>
            <button className="sq-compare-quiz" onClick={() => openQuiz()}>
              {comparePaths.quizLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
