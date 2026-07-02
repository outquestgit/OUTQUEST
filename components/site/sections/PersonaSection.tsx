"use client";

import type { HomepageConfig } from "@/lib/site/data/homepage";
import { wusTogglePersona, wusKeyToggle } from "@/lib/site/runtime";

/** "Who uses us" — expandable persona polaroids (the runtime drives expansion). */
export function PersonaSection({ whoUsesUs }: { whoUsesUs: HomepageConfig["whoUsesUs"] }) {
  return (
    <section className="wus-section">
      <div className="wus-inner">
        <div className="wus-copy">
          <h2 className="wus-title">{whoUsesUs.title}</h2>
          <p className="wus-sub">{whoUsesUs.subtitle}</p>
        </div>

        <div className="wus-scene" aria-label="Who uses OutQuest">
          <div className="wus-line" aria-hidden="true">
            <svg viewBox="0 0 1440 220" preserveAspectRatio="none">
              <path d="M-80 72 C 240 178, 520 185, 760 158 S 1160 124, 1520 42" />
              <path d="M-80 72 C 240 178, 520 185, 760 158 S 1160 124, 1520 42" />
            </svg>
          </div>

          <div className="wus-polaroid-row">
            {whoUsesUs.personas.map((p) => (
              <article
                className={`wus-polaroid ${p.cls}`}
                tabIndex={0}
                role="button"
                aria-expanded="false"
                data-wus={p.key}
                key={p.key}
                onClick={() => wusTogglePersona(p.key)}
                onKeyDown={(e) => wusKeyToggle(e.nativeEvent, p.key)}
              >
                <span className="wus-clip" aria-hidden="true"></span>
                <div className="wus-photo">
                  <span className="wus-emoji">{p.emoji}</span>
                </div>
                <div className="wus-white-area">
                  <div className="wus-name">{p.name}</div>
                  <div className="wus-role">{p.role}</div>
                </div>
                <div className="wus-expand-hint">
                  <span className="wus-pull-word">{p.pull}</span>
                </div>
                <div className="wus-under-paper" aria-hidden="true">
                  <div className="wus-paper-handle">{p.pull}</div>
                  <div className="wus-paper-list">
                    <strong>{p.questsTitle}</strong>
                    {p.quests.map((q, qi) => (
                      <span key={qi}>{q}</span>
                    ))}
                  </div>
                  <div className="wus-paper-tuck">Tuck away ↑</div>
                </div>
              </article>
            ))}
          </div>

          <div className="wus-path-panel" id="wusPathPanel" aria-live="polite"></div>
        </div>
      </div>
    </section>
  );
}
