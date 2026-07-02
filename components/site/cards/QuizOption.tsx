"use client";

import { resolveQuizOptionFilter, type QuizBuilderOption } from "@/lib/site/data/quiz";
import { selectOpt } from "@/lib/site/runtime";

/**
 * One selectable quiz answer. `data-q` is the question index; `data-fkind` +
 * `data-fslug` are the single taxonomy filter (Category / Budget / Duration +
 * term slug) this answer narrows the matched quests by (AND across answers). The
 * runtime (`selectOpt` / `showQuizResults`) reads them and toggles selection.
 */
export function QuizOption({ option, qIndex }: { option: QuizBuilderOption; qIndex: number }) {
  const { kind, slug } = resolveQuizOptionFilter(option);
  return (
    <div
      className="quiz-opt"
      data-q={qIndex}
      data-fkind={slug ? kind : undefined}
      data-fslug={slug || undefined}
      onClick={(e) => selectOpt(e.currentTarget)}
    >
      <span className="quiz-opt-icon">{option.icon}</span>
      <div>
        <div className="quiz-opt-label">{option.label}</div>
        {option.subtext && <div className="quiz-opt-desc">{option.subtext}</div>}
      </div>
    </div>
  );
}
