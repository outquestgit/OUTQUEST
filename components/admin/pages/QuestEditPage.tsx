"use client";

import {
  switchTab,
  autoSlug,
  extFilterList,
  extToggleRel,
  extSwitchTab,
  extPreviewCardImg,
  extUpdateCardIcon,
  extUpdateCardBg,
  extSyncColorInput,
  fmt,
  removeItem,
  addUnlock,
  addFAQ,
  removeEmbarkStep,
  addEmbarkStep,
  updateSeoCounter,
  updateQuestSerpTitle,
  updateQuestSerpDesc,
  setStatus,
  updateFeaturedState,
  extToggleHideBadge,
} from "@/lib/admin/runtime";
import {
  termsOf,
  QUEST_ICON_FALLBACK,
} from "@/lib/admin/listFormat";
import type { QuestWithTerms } from "@/lib/quests";

/** Selectable meta chip (`.ms-chip`). Click toggling is handled by a single
 *  delegated listener in QuestEditorBridge (so React-rendered and DB-rendered
 *  chips behave identically and a click can never toggle twice). */
function Chip({ val, label }: { val?: string; label: string }) {
  return (
    <span className="ms-chip" data-val={val}>
      {label}
    </span>
  );
}

const BUDGET = ["Under $500", "$500–$1000", "$1000–$2000", "$2000+"];
const TIMELINE = ["Weekend (1–3d)", "Short (4–7d)", "Medium (8–14d)", "Long (15d+)"];
const DIFFICULTY: [string, string][] = [["easy", "Easy"], ["moderate", "Moderate"], ["hard", "Hard"]];
const DELIVERY: [string, string][] = [
  ["inperson", "In person"],
  ["remotefriendly", "Remote-friendly"],
  ["online", "Online"],
  ["hybrid", "Hybrid"],
];
const LIFE_DIR: [string, string][] = [
  ["abroad", "Move Abroad"],
  ["newlife", "Try a New Life"],
  ["upgrade", "Level Up / Upgrade"],
];
const OUTCOME_META = [
  "Learn a skill",
  "Build a portfolio",
  "Explore a path",
  "Gain experience",
  "Meet people",
  "Wellness",
  "Adventure",
];
const OUTCOME_GOALS: [string, string][] = [
  ["learn-skill", "Learn a skill"],
  ["gain-experience", "Gain experience"],
  ["meet-people", "Meet people"],
  ["wellness", "Wellness"],
  ["adventure", "Adventure"],
  ["relocate", "Relocate"],
  ["earn-income", "Earn income"],
  ["build-portfolio", "Build a portfolio"],
  ["career-change", "Career change"],
  ["explore-path", "Explore a path"],
];

/**
 * Quest editor (`#page-quests-edit`). Faithful transcription of the reference.
 * The `ext-rel-wrap` Similar Quests picker renders live DB rows (previously
 * injected by `relQuestRows`); `QuestEditorBridge` wires Save/Edit by id,
 * ms-chip `data-val`, and the picker chips. Inputs stay uncontrolled; inline
 * handlers call the runtime.
 */
export function QuestEditPage({
  quests,
}: {
  quests: QuestWithTerms[];
}) {
  return (
    <div className="page" id="page-quests-edit" suppressHydrationWarning>
      <div className="edit-layout">
        <div className="edit-main">
          {/* TAB SHELL */}
          <div className="section-card" style={{ overflow: "visible" }}>
            <div className="tabs" id="q-tabs">
              <span className="tab active" onClick={() => switchTab("q-tabs", "q-panels", 0)}>
                Content
              </span>
              <span className="tab" onClick={() => switchTab("q-tabs", "q-panels", 1)}>
                SEO
              </span>
            </div>
            <div id="q-panels">
              {/* TAB 0: CONTENT */}
              <div className="tab-panel active" style={{ gap: "14px" }}>
                {/* BASIC */}
                <div className="section-card">
                  <div className="section-card-header">Basic Info</div>
                  <div className="section-card-body">
                    <div className="field">
                      <label>Title</label>
                      <input type="text" id="q-title" placeholder="e.g. Bali Surf &amp; Yoga Pack" onInput={() => autoSlug("q-title", "q-slug")} />
                    </div>
                    <div className="field">
                      <label>Slug</label>
                      <div className="slug-wrap">
                        <span className="slug-prefix">/quests/</span>
                        <input type="text" id="q-slug" placeholder="bali-surf-yoga-pack" />
                      </div>
                    </div>
                    <div className="field-row">
                      <div className="field">
                        <label>Country</label>
                        <select>
                          <option value="">Select…</option>
                          <option>Indonesia</option>
                          <option>Japan</option>
                          <option>Nepal</option>
                          <option>Morocco</option>
                          <option>Thailand</option>
                          <option>Portugal</option>
                        </select>
                      </div>
                      <div className="field">
                        <label>Category</label>
                        <select>
                          <option value="">Select…</option>
                          <option>Move Abroad</option>
                          <option>Level Up</option>
                          <option>Try a New Life</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ height: "1px", background: "var(--border)", margin: "4px 0" }}></div>
                    <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "2px" }}>
                      Quest Meta
                    </div>
                    <div className="field">
                      <label>Budget</label>
                      <div className="multi-options">
                        {BUDGET.map((l) => (
                          <Chip key={l} label={l} />
                        ))}
                      </div>
                    </div>
                    <div className="field">
                      <label>Timeline</label>
                      <div className="multi-options">
                        {TIMELINE.map((l) => (
                          <Chip key={l} label={l} />
                        ))}
                      </div>
                    </div>
                    <div className="field">
                      <label>Effort</label>
                      <div className="multi-options">
                        {DIFFICULTY.map(([v, l]) => (
                          <Chip key={v} val={v} label={l} />
                        ))}
                      </div>
                    </div>
                    <div className="field">
                      <label>Delivery Mode</label>
                      <div className="multi-options">
                        {DELIVERY.map(([v, l]) => (
                          <Chip key={v} val={v} label={l} />
                        ))}
                      </div>
                    </div>
                    <div style={{ height: "1px", background: "var(--border)", margin: "2px 0" }}></div>
                    <div className="field">
                      <label>Life Direction</label>
                      <div className="field-hint">Which life reset does this quest speak to?</div>
                      <div className="multi-options" style={{ marginTop: "6px" }}>
                        {LIFE_DIR.map(([v, l]) => (
                          <Chip key={v} val={v} label={l} />
                        ))}
                      </div>
                    </div>
                    <div className="field">
                      <label>Outcome Goal</label>
                      <div className="field-hint">What can the quester achieve or experience?</div>
                      <div className="multi-options" style={{ marginTop: "6px" }}>
                        {OUTCOME_META.map((l) => (
                          <Chip key={l} label={l} />
                        ))}
                      </div>
                    </div>
                    <div style={{ height: "1px", background: "var(--border)", margin: "2px 0" }}></div>
                    <div className="field">
                      <label>Best Time to Go</label>
                      <div className="field-hint">Shown in the hero info strip on the quest page. e.g. &quot;Nov – Mar&quot;</div>
                      <input type="text" id="q-best-time" placeholder="e.g. Nov – Mar" style={{ marginTop: "6px" }} />
                    </div>
                  </div>
                </div>

                {/* RELATED QUESTS (Similar Quests) — live DB rows */}
                <div className="section-card">
                  <div className="section-card-header">
                    Similar Quests (similar[]){" "}
                    <span style={{ fontSize: "10px", fontWeight: 400, color: "var(--muted)", textTransform: "none", letterSpacing: 0 }}>
                      {" "}— shown at the bottom of the quest page as &quot;More like this&quot;
                    </span>
                  </div>
                  <div className="section-card-body">
                    <div className="field-hint" style={{ marginBottom: "8px" }}>
                      Pick the quests to surface at the bottom of this quest page as &quot;Similar OutQuests&quot;. Only these are shown — leave empty to hide the section.
                    </div>
                    <div className="ext-search-bar">
                      <input type="text" placeholder="Search quests…" onInput={(e) => extFilterList(e.currentTarget, "d-rel-quests-list", "ext-rel-row")} />
                    </div>
                    <div className="ext-rel-wrap" id="d-rel-quests-list">
                      {quests.map((q) => {
                        const meta =
                          [termsOf(q, "category"), termsOf(q, "country")].filter((m) => m !== "—").join(" · ") || "—";
                        return (
                          <div className="ext-rel-row" data-rel-quest={q.slug} onClick={(e) => extToggleRel(e.currentTarget, "d-rel-quests-chips")} key={q.id}>
                            <input type="checkbox" />
                            <span className="ext-rel-icon">{q.card_icon || QUEST_ICON_FALLBACK}</span>
                            <div className="ext-rel-info">
                              <div className="ext-rel-name">{q.title}</div>
                              <div className="ext-rel-meta">{meta}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="ext-rel-chips" id="d-rel-quests-chips"></div>
                  </div>
                </div>

                {/* MEDIA */}
                <div className="section-card">
                  <div className="section-card-header">Media</div>
                  <div className="section-card-body">
                    <div className="field">
                      <label>Featured Image</label>
                      <div className="img-upload">
                        <input type="file" accept="image/*" />
                        <div className="img-upload-icon">🖼</div>
                        <div className="img-upload-label">Click to upload featured image</div>
                        <div className="img-upload-hint">JPG, PNG or WEBP · max 5MB</div>
                      </div>
                    </div>
                    <div className="field">
                      <label>Gallery Images</label>
                      <div className="img-upload">
                        <input type="file" accept="image/*" multiple />
                        <div className="img-upload-icon">🗂</div>
                        <div className="img-upload-label">Click to upload gallery images</div>
                        <div className="img-upload-hint">Multiple files allowed</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD IMAGE / ICON */}
                <div className="section-card">
                  <div className="section-card-header">
                    Card Image &amp; Icon{" "}
                    <span style={{ fontSize: "10px", fontWeight: 400, color: "var(--muted)", textTransform: "none", letterSpacing: 0 }}>
                      {" "}— how this quest appears in listing cards
                    </span>
                  </div>
                  <div className="section-card-body">
                    <div className="ext-tab-strip" id="q-card-tabs">
                      <div className="ext-tab active" onClick={() => extSwitchTab("q-card-tabs", "q-card-panels", 0)}>
                        Image
                      </div>
                      <div className="ext-tab" onClick={() => extSwitchTab("q-card-tabs", "q-card-panels", 1)}>
                        Icon
                      </div>
                    </div>
                    <div id="q-card-panels">
                      <div className="ext-tab-panel active">
                        <div className="field" style={{ margin: 0 }}>
                          <label>
                            Card Thumbnail <span className="opt">overrides featured image on listing cards</span>
                          </label>
                          <div className="img-upload" style={{ padding: "13px" }}>
                            <input type="file" accept="image/*" onChange={(e) => extPreviewCardImg(e.currentTarget, "q-card-mock-img")} />
                            <div className="img-upload-icon">🖼</div>
                            <div className="img-upload-label">Upload card thumbnail</div>
                            <div className="img-upload-hint">Recommended 600×400px · JPG or WEBP</div>
                          </div>
                        </div>
                      </div>
                      <div className="ext-tab-panel">
                        <div className="field" style={{ margin: "0 0 10px" }}>
                          <label>Card Icon / Emoji</label>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <input
                              type="text"
                              maxLength={4}
                              id="q-card-icon"
                              placeholder="🌍"
                              style={{ fontSize: "28px", textAlign: "center", padding: "8px", width: "60px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--surface)" }}
                              onInput={(e) => extUpdateCardIcon(e.currentTarget, "q-card-mock-icon")}
                            />
                            <div style={{ flex: 1, fontSize: "12px", color: "var(--muted)", lineHeight: 1.5 }}>
                              Paste any emoji. Shown in the card when no image is uploaded, and as the quest&apos;s identity icon throughout the site.
                            </div>
                          </div>
                        </div>
                        <div className="field" style={{ margin: 0 }}>
                          <label>
                            Background colour <span className="opt">optional</span>
                          </label>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input
                              type="color"
                              id="q-card-color"
                              defaultValue="#f0ede8"
                              style={{ width: "38px", height: "32px", border: "1px solid var(--border)", borderRadius: "6px", padding: "2px", cursor: "pointer", background: "none" }}
                              onInput={(e) => extUpdateCardBg(e.currentTarget, "q-card-mock-img")}
                            />
                            <input
                              type="text"
                              placeholder="e.g. #f0ede8"
                              style={{ flex: 1, padding: "7px 10px", border: "1px solid var(--border)", borderRadius: "7px", fontSize: "13px" }}
                              onInput={(e) => extSyncColorInput(e.currentTarget, "q-card-color", "q-card-mock-img")}
                            />
                            <span style={{ fontSize: "11px", color: "var(--muted)" }}>Card bg</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ext-divider" style={{ marginTop: "4px" }}></div>
                    <div className="ext-card-preview">
                      <div className="ext-card-preview-hd">Card preview</div>
                      <div className="ext-card-mock">
                        <div className="ext-card-mock-img" id="q-card-mock-img">
                          <span id="q-card-mock-icon">🌍</span>
                        </div>
                        <div className="ext-card-mock-tag">Quest</div>
                        <div className="ext-card-mock-title"></div>
                        <div className="ext-card-mock-sub"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* HERO */}
                <div className="section-card">
                  <div className="section-card-header">Hero Section</div>
                  <div className="section-card-body">
                    <div className="field">
                      <label>Tagline</label>
                      <input type="text" placeholder="Short punchy headline for the hero…" />
                    </div>
                    <div className="field">
                      <label>Short Intro</label>
                      <textarea placeholder="2–3 sentence intro shown below the hero…" rows={3}></textarea>
                    </div>
                  </div>
                </div>

                {/* OUTCOME GOALS */}
                

                {/* QUEST IDENTITY & DISPLAY: the section card was removed, but its
                    values are still preserved on save via these hidden inputs — so
                    existing quests keep their level / monthly budget / duration and
                    saves never blank them (the editor bridge reads/writes these ids).
                    Life Direction lives in the Quest Meta section above. */}
                <input type="hidden" id="q-level" />
                <input type="hidden" id="q-monthly-budget" />
                <input type="hidden" id="q-duration-display" />

                

                {/* CONTENT SECTIONS */}
                <div className="section-card">
                  <div className="section-card-header">Content Sections</div>
                  <div className="section-card-body" style={{ gap: "18px" }}>
                    {/* IMMERSIVE NARRATIVE */}
                    <div className="field">
                      <label>What This Quest Looks Like</label>
                      <div className="rte">
                        <div className="rte-toolbar">
                          <button className="rte-btn" onClick={() => fmt("bold")}>
                            <b>B</b>
                          </button>
                          <button className="rte-btn" onClick={() => fmt("italic")}>
                            <i>I</i>
                          </button>
                          <button className="rte-btn" onClick={() => fmt("underline")}>
                            <u>U</u>
                          </button>
                          <div className="rte-sep"></div>
                          <button className="rte-btn" onClick={() => fmt("insertUnorderedList")}>
                            ≡
                          </button>
                          <button className="rte-btn" onClick={() => fmt("insertOrderedList")}>
                            1.
                          </button>
                          <div className="rte-sep"></div>
                          <button className="rte-btn" onClick={() => fmt("formatBlock", "h2")}>
                            H2
                          </button>
                          <button className="rte-btn" onClick={() => fmt("formatBlock", "h3")}>
                            H3
                          </button>
                          <button className="rte-btn" onClick={() => fmt("formatBlock", "p")}>
                            ¶
                          </button>
                        </div>
                        <div className="rte-area" contentEditable="true" suppressContentEditableWarning data-placeholder="Write in second person, present tense. e.g. 'You wake up at 6am in a staff dorm that smells like pine and last night's ramen. The mountain opens at 8:30…'"></div>
                      </div>
                      <div className="field-hint">
                        The &quot;day in the life&quot; opening shown at the top of the quest page. Write in
                        second person, present tense. Keep it visceral and specific — no marketing language.
                      </div>
                    </div>

                    {/* UNLOCKS */}
                    <div className="end-cta-block" style={{ borderColor: "var(--accent)", background: "#fef8f5" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                        <span style={{ fontSize: "13px" }}>🔓</span>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".05em" }}>
                          What This OutQuest Unlocks
                        </span>
                      </div>
                      <div style={{ fontSize: "11.5px", color: "var(--muted)", marginBottom: "8px" }}>
                        Manually add each unlock item — not auto-generated. Each item appears as a card on the front end.
                      </div>
                      <div className="field">
                        <label>
                          Intro Line <span className="opt">optional</span>
                        </label>
                        <input type="text" placeholder="e.g. This quest is designed to help you…" />
                      </div>
                      <div className="repeater" id="unlocks-repeater">
                        <div className="repeater-item">
                          <div className="repeater-item-header">
                            <span className="repeater-drag">⠿</span>
                            <span className="repeater-item-title">Unlock 1</span>
                            <button className="repeater-remove" onClick={(e) => removeItem(e.currentTarget)}>
                              ×
                            </button>
                          </div>
                          <div className="field-row">
                            <div className="field" style={{ flex: "0 0 56px", minWidth: 0 }}>
                              <label>Icon</label>
                              <input type="text" placeholder="🌍" style={{ fontSize: "18px", textAlign: "center", padding: "6px 4px" }} maxLength={8} title="Paste an emoji" />
                            </div>
                            <div className="field" style={{ flex: 1 }}>
                              <label>Unlock Title</label>
                              <input type="text" placeholder="e.g. A new professional skill" />
                            </div>
                          </div>
                          <div className="field">
                            <label>
                              Detail <span className="opt">optional</span>
                            </label>
                            <input type="text" placeholder="Short supporting line…" />
                          </div>
                        </div>
                      </div>
                      <button className="add-repeater-btn" onClick={() => addUnlock()} style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
                        ＋ Add Unlock
                      </button>
                    </div>

{/* EMBARK STEPS */}
                    <div className="end-cta-block" style={{ borderColor: "rgba(232,68,10,.35)", background: "#fef8f5", padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "15px" }}>🧭</span>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".06em" }}>
                          Embark on this OutQuest
                        </span>
                      </div>
                      <div style={{ fontSize: "11.5px", color: "var(--muted)", marginBottom: "10px", lineHeight: 1.55 }}>
                        Add the step-by-step action path shown on the quest page under the &quot;Embark on this OutQuest&quot; heading. Steps are numbered automatically by order — drag to reorder.
                      </div>
                      <div className="repeater" id="embark-repeater">
                        {[1, 2].map((n) => (
                          <div className="repeater-item" style={{ background: "var(--surface)", borderColor: "rgba(232,68,10,.18)" }} key={n}>
                            <div className="repeater-item-header">
                              <span className="repeater-drag" style={{ color: "var(--accent)", opacity: 0.6 }}>⠿</span>
                              <span className="repeater-item-title" style={{ color: "var(--accent)" }}>Step {n}</span>
                              <button className="repeater-remove" onClick={(e) => removeEmbarkStep(e.currentTarget)}>
                                ×
                              </button>
                            </div>
                            <div className="field">
                              <label>Title</label>
                              <input type="text" placeholder={n === 1 ? "e.g. Book your visa appointment" : "e.g. Secure your accommodation"} />
                            </div>
                            <div className="field">
                              <label>Short Description</label>
                              <input type="text" placeholder="One sentence supporting line — what happens or why it matters." />
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="add-repeater-btn" onClick={() => addEmbarkStep()} style={{ borderColor: "var(--accent)", color: "var(--accent)", marginTop: "6px" }}>
                        ＋ Add Step
                      </button>
                      <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "8px" }}>
                        Step numbers are generated automatically. No limit — add as many steps as the quest needs.
                      </div>
                    </div>
                    {/* FAQ */}
                    <div className="field">
                      <label>FAQ</label>
                      <div className="repeater" id="faq-repeater">
                        <div className="repeater-item">
                          <div className="repeater-item-header">
                            <span className="repeater-drag">⠿</span>
                            <span className="repeater-item-title">FAQ 1</span>
                            <button className="repeater-remove" onClick={(e) => removeItem(e.currentTarget)}>
                              ×
                            </button>
                          </div>
                          <div className="field">
                            <label>Question</label>
                            <input type="text" placeholder="e.g. What skill level do I need?" />
                          </div>
                          <div className="field">
                            <label>Answer</label>
                            <textarea rows={3} placeholder="Clear, helpful answer…"></textarea>
                          </div>
                        </div>
                      </div>
                      <button className="add-repeater-btn" onClick={() => addFAQ()}>
                        ＋ Add FAQ
                      </button>
                    </div>

                    {/* SHARE / COMPANION CTA */}
                    <div className="end-cta-block" style={{ borderColor: "rgba(74,108,247,.3)", background: "rgba(74,108,247,.04)", padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "15px" }}>👥</span>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent3)", textTransform: "uppercase", letterSpacing: ".06em" }}>
                          Better with a Companion — Share CTA
                        </span>
                      </div>
                      <div style={{ fontSize: "11.5px", color: "var(--muted)", marginBottom: "10px", lineHeight: 1.55 }}>
                        Shown on the quest page below the FAQ. Prompts the user to share the quest with someone who needs a nudge.
                      </div>
                      <div className="field">
                        <label>Heading</label>
                        <input type="text" defaultValue="Better with a companion" placeholder="e.g. Better with a companion" />
                      </div>
                      <div className="field">
                        <label>Body Copy</label>
                        <textarea rows={2} placeholder="Supporting line…" defaultValue="Half the people on this quest showed up solo. But if you've got someone who needs a nudge — send them this." />
                      </div>
                      <div className="field">
                        <label>Button Label</label>
                        <input type="text" defaultValue="Send this quest to a friend" placeholder="e.g. Send this quest to a friend" />
                      </div>
                      <div className="toggle-wrap" style={{ marginTop: "6px" }}>
                        <label className="toggle">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                        </label>
                        <span className="toggle-label" style={{ fontSize: "12px" }}>Show on this quest</span>
                      </div>
                    </div>

                    
                  </div>
                </div>
              </div>

              {/* TAB 1: SEO */}
              <div className="tab-panel" style={{ gap: "14px" }}>
                <div className="section-card">
                  <div className="section-card-header">SEO</div>
                  <div className="section-card-body">
                    {/* SERP PREVIEW */}
                    <div>
                      <div style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--muted2)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "8px" }}>
                        Search Preview
                      </div>
                      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px", boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
                        <div style={{ fontSize: "12px", color: "#188038", marginBottom: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <span style={{ width: "14px", height: "14px", background: "var(--surface3)", borderRadius: "50%", display: "inline-block", verticalAlign: "middle" }}></span>
                          joinoutquest.com › quests › <span id="serp-slug" style={{ color: "#188038" }}>your-quest-slug</span>
                        </div>
                        <div id="serp-title" style={{ fontSize: "18px", color: "#1558d6", fontWeight: 400, marginBottom: "4px", lineHeight: 1.3, wordBreak: "break-word" }}>
                          Your SEO title will appear here
                        </div>
                        <div id="serp-desc" style={{ fontSize: "13px", color: "#4d5156", lineHeight: 1.55 }}>
                          Your meta description will appear here — write something compelling that makes people want to click.
                        </div>
                      </div>
                      <div style={{ marginTop: "7px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <div id="q-seo-bar" style={{ height: "5px", borderRadius: "3px", background: "var(--border)", flex: 1, transition: "background .2s" }}></div>
                        <span id="q-seo-bar-label" style={{ fontSize: "11px", color: "var(--muted)", whiteSpace: "nowrap", minWidth: "88px", textAlign: "right" }}></span>
                      </div>
                    </div>

                    <div style={{ height: "1px", background: "var(--border)", margin: "2px 0" }}></div>

                    <div className="field">
                      <label>SEO Title</label>
                      <input
                        type="text"
                        id="q-seo-title"
                        placeholder="e.g. Bali Surf &amp; Yoga Pack — OutQuest"
                        maxLength={60}
                        onInput={(e) => {
                          updateSeoCounter(e.currentTarget, "q-seo-title-count", 60);
                          updateQuestSerpTitle();
                        }}
                      />
                      <div className="field-hint" style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Recommended: 50–60 characters</span>
                        <span id="q-seo-title-count" style={{ fontWeight: 600, color: "var(--muted)" }}>0 / 60</span>
                      </div>
                    </div>

                    <div className="field">
                      <label>Meta Description</label>
                      <textarea
                        id="q-meta-desc"
                        placeholder="A short, compelling summary for search engines and social shares…"
                        rows={3}
                        maxLength={160}
                        onInput={(e) => {
                          updateSeoCounter(e.currentTarget, "q-meta-count", 160);
                          updateQuestSerpDesc();
                        }}
                      ></textarea>
                      <div className="field-hint" style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Recommended: 140–160 characters</span>
                        <span id="q-meta-count" style={{ fontWeight: 600, color: "var(--muted)" }}>0 / 160</span>
                      </div>
                    </div>

                    <div className="field">
                      <label>
                        Focus Keyword <span className="opt">optional</span>
                      </label>
                      <input type="text" placeholder="e.g. bali surf yoga retreat" />
                      <div className="field-hint">Primary keyword this page should rank for</div>
                    </div>

                    <div className="field">
                      <label>
                        Canonical URL <span className="opt">optional</span>
                      </label>
                      <input type="url" placeholder="https://joinoutquest.com/quests/…" />
                      <div className="field-hint">Leave blank to use the default slug URL</div>
                    </div>

                    <div style={{ height: "1px", background: "var(--border)", margin: "2px 0" }}></div>

                    <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted2)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "6px" }}>
                      Open Graph / Social Share
                    </div>

                    <div className="field">
                      <label>
                        OG Title <span className="opt">optional — falls back to SEO Title</span>
                      </label>
                      <input type="text" placeholder="Title as it appears when shared on social…" />
                    </div>

                    <div className="field">
                      <label>
                        OG Description <span className="opt">optional — falls back to Meta Description</span>
                      </label>
                      <textarea rows={2} placeholder="Short hook for social previews…"></textarea>
                    </div>

                    <div className="field">
                      <label>
                        OG Image <span className="opt">optional — falls back to Featured Image</span>
                      </label>
                      <div className="img-upload">
                        <input type="file" accept="image/*" />
                        <div className="img-upload-icon">🌐</div>
                        <div className="img-upload-label">Upload social share image</div>
                        <div className="img-upload-hint">1200 × 630px recommended · JPG or PNG</div>
                      </div>
                    </div>

                    <div style={{ height: "1px", background: "var(--border)", margin: "2px 0" }}></div>

                    <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted2)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "6px" }}>
                      Indexing
                    </div>

                    <div className="field-row">
                      <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: "10px", paddingTop: "4px" }}>
                        <label className="toggle">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                        </label>
                        <div>
                          <div style={{ fontSize: "13px", color: "var(--text)", fontWeight: 500 }}>Index this page</div>
                          <div style={{ fontSize: "11px", color: "var(--muted)" }}>Allow search engines to crawl and index</div>
                        </div>
                      </div>
                      <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: "10px", paddingTop: "4px" }}>
                        <label className="toggle">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                        </label>
                        <div>
                          <div style={{ fontSize: "13px", color: "var(--text)", fontWeight: 500 }}>Follow links</div>
                          <div style={{ fontSize: "11px", color: "var(--muted)" }}>Pass link equity to outbound links</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="edit-sidebar">
          {/* STATUS */}
          <div className="section-card">
            <div className="section-card-header">Status</div>
            <div className="section-card-body">
              <div className="status-toggle" id="q-status">
                <button className="active-draft" onClick={(e) => setStatus("q-status", "draft", e.currentTarget)}>
                  Draft
                </button>
                <button onClick={(e) => setStatus("q-status", "published", e.currentTarget)}>Published</button>
              </div>
              <button id="q-save-publish" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                Save &amp; Publish
              </button>
              <button id="q-save-draft" className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
                Save Draft
              </button>
              <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
                👁 Preview
              </button>
            </div>
          </div>

          {/* FEATURED */}
          <div className="section-card">
            <div className="section-card-header" style={{ gap: "8px" }}>
              <span>⭐ Featured</span>
            </div>
            <div className="section-card-body">
              <div style={{ display: "flex", alignItems: "flex-start", gap: "11px" }}>
                <label className="toggle" style={{ marginTop: "2px", flexShrink: 0 }}>
                  <input
                    type="checkbox"
                    id="q-featured"
                    onChange={(e) => {
                      updateFeaturedState(e.currentTarget);
                      // Keep the "Homepage — Popular Quests" toggle in sync (same flag).
                      const p = document.getElementById("q-popular") as HTMLInputElement | null;
                      if (p) p.checked = e.currentTarget.checked;
                    }}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", marginBottom: "2px" }}>Feature on Homepage</div>
                  <div style={{ fontSize: "11.5px", color: "var(--muted)", lineHeight: 1.5 }}>
                    Pin this quest to the homepage Featured section. Up to 6 quests can be featured at a time.
                  </div>
                </div>
              </div>
              <div id="featured-warning" style={{ display: "none", background: "rgba(232,68,10,.07)", border: "1px solid rgba(232,68,10,.2)", borderRadius: "7px", padding: "9px 11px", fontSize: "11.5px", color: "var(--accent)", lineHeight: 1.5 }}>
                ⚠ 6 quests are already featured. Remove another to feature this one.
              </div>
              <div id="featured-badge" style={{ display: "none", background: "rgba(42,157,111,.08)", border: "1px solid rgba(42,157,111,.25)", borderRadius: "7px", padding: "9px 11px", fontSize: "11.5px", color: "var(--accent2)", lineHeight: 1.5, alignItems: "center", gap: "6px" }}>
                <span>✓</span> This quest will appear in the homepage Featured section.
              </div>
            </div>
          </div>

          {/* BROKEN QUEST IDs ALERT */}
          <div style={{ padding: "10px 12px", background: "rgba(232,70,30,.07)", border: "1px solid rgba(232,70,30,.25)", borderRadius: "10px", fontSize: "12px", color: "#8a2010", lineHeight: 1.5 }}>
            <strong>⚠️ Missing quest IDs on frontend:</strong>
            <br />
            <code style={{ background: "rgba(232,70,30,.1)", padding: "1px 5px", borderRadius: "4px", fontSize: "11px" }}>income</code> and{" "}
            <code style={{ background: "rgba(232,70,30,.1)", padding: "1px 5px", borderRadius: "4px", fontSize: "11px" }}>remote</code> are referenced on the Level Up category page but have no quest data. Create these as published quests.
          </div>

          {/* PLACEMENT & VISIBILITY */}
          <div className="ext-sidebar-card">
            <div className="ext-sidebar-hd">⊟ Placement &amp; Visibility</div>
            <div className="ext-sidebar-bd">
              <div className="ext-placement-row">
                <div className="ext-placement-label">
                  <span>Homepage — Popular Quests</span>
                  <small>Adds this quest to the homepage grid</small>
                </div>
                <label className="toggle">
                  {/* Same "featured" flag as the ⭐ Featured toggle above — kept in
                      sync so either one features the quest (badge + homepage). */}
                  <input
                    type="checkbox"
                    id="q-popular"
                    onChange={(e) => {
                      const f = document.getElementById("q-featured") as HTMLInputElement | null;
                      if (f) {
                        f.checked = e.currentTarget.checked;
                        updateFeaturedState(f);
                      }
                    }}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="ext-placement-row">
                <div className="ext-placement-label">
                  <span>Hide on Frontend</span>
                  <small>Remove from all listing pages</small>
                </div>
                <label className="toggle">
                  <input type="checkbox" id="q-hide-frontend" onChange={(e) => extToggleHideBadge(e.currentTarget, "q-hide-badge")} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div id="q-hide-badge" style={{ display: "none", padding: "8px 11px", background: "rgba(217,48,37,.07)", border: "1px solid rgba(217,48,37,.2)", borderRadius: "7px", fontSize: "11.5px", color: "var(--danger)", lineHeight: 1.5 }}>
                🚫 Hidden — this quest will not appear on any listing page or homepage section.
              </div>
              <div className="ext-divider"></div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "var(--muted)", marginBottom: "7px" }}>
                  Display Order
                </div>
                <div className="ext-order-row">
                  <input className="ext-order-input" type="number" min="1" defaultValue="1" id="q-display-order" />
                  <div className="ext-order-hint">Lower number = shown earlier in listing grids. Set to 1 to pin to top.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
