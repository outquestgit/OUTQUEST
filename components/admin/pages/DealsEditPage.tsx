"use client";

import {
  switchTab,
  autoSlug,
  setDealCategory,
  filterQuestSelector,
  selectAllFilteredQuests,
  extSwitchTab,
  extPreviewCardImg,
  extUpdateCardIcon,
  extUpdateCardBg,
  extSyncColorInput,
  fmt,
  removeItem,
  addRequirement,
  addIncluded,
  updateDealBtnPreview,
  updateFinalCtaPreview,
  switchActionTypeCard,
  switchBookingPayType,
  updateBookingPreview,
  addBKFField,
  addLCFField,
  updateSeoCounter,
  syncDealSerp,
  syncDealIndexBadge,
  setStatus,
  extToggleFeaturedBadge,
  extToggleHideBadge,
} from "@/lib/admin/runtime";

const CHECK_STYLE: React.CSSProperties = {
  marginLeft: "auto",
  width: "18px",
  height: "18px",
  borderRadius: "50%",
  border: "2px solid var(--border)",
  background: "var(--surface)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  fontSize: "10px",
  color: "#fff",
  transition: "all .13s",
};

const DEAL_CATS: { cat: string; icon: string; title: string; desc: string; border: boolean }[] = [
  { cat: "programs", icon: "🎯", title: "Programs & Experiences", desc: "Courses, bootcamps, immersive programs", border: true },
  { cat: "setup", icon: "⚙️", title: "Get Set Up", desc: "Banking, SIMs, admin, visas, essentials", border: true },
  { cat: "tools", icon: "🧰", title: "Tools & Essentials", desc: "Gear, subscriptions, apps, kit", border: false },
];

/** A compact `fmt`-based RTE block used by the deal content fields. */
function SimpleRte({ placeholder, withHeadings, h3Only }: { placeholder: string; withHeadings?: boolean; h3Only?: boolean }) {
  return (
    <div className="rte">
      <div className="rte-toolbar">
        <button className="rte-btn" onClick={() => fmt("bold")}>
          <b>B</b>
        </button>
        <button className="rte-btn" onClick={() => fmt("italic")}>
          <i>I</i>
        </button>
        {withHeadings && (
          <button className="rte-btn" onClick={() => fmt("underline")}>
            <u>U</u>
          </button>
        )}
        <div className="rte-sep"></div>
        <button className="rte-btn" onClick={() => fmt("insertUnorderedList")}>
          ≡
        </button>
        <button className="rte-btn" onClick={() => fmt("insertOrderedList")}>
          1.
        </button>
        <div className="rte-sep"></div>
        {h3Only && (
          <button className="rte-btn" onClick={() => fmt("formatBlock", "h3")}>
            H3
          </button>
        )}
        <button className="rte-btn" onClick={() => fmt("formatBlock", "p")}>
          ¶
        </button>
      </div>
      <div className="rte-area" contentEditable="true" suppressContentEditableWarning data-placeholder={placeholder}></div>
    </div>
  );
}

/**
 * Deal editor (`#page-deals-edit`). Faithful transcription of the reference
 * (tabbed Content/SEO editor, deal-category radio group, connected-quests
 * selector, card image/icon editor, action-type panels for booking/direct/
 * affiliate/lead-gen, SEO SERP preview, placement sidebar). `DealsBridge` wires
 * everything by id; inline handlers call the runtime; inputs stay uncontrolled.
 * Note: `d-featured` appears twice (direct panel + sidebar) — preserved as in
 * the source. The connected-quest rows are JS-rendered into `#d-quests-group`.
 */
export function DealsEditPage() {
  return (
    <div className="page" id="page-deals-edit" suppressHydrationWarning>
      <div className="edit-layout">
        <div className="edit-main">
          {/* TAB SHELL */}
          <div className="section-card" style={{ overflow: "visible" }}>
            <div className="tabs" id="d-tabs">
              <span className="tab active" onClick={() => switchTab("d-tabs", "d-panels", 0)}>
                Content
              </span>
              <span className="tab" onClick={() => switchTab("d-tabs", "d-panels", 1)}>
                SEO
              </span>
            </div>
            <div id="d-panels">
              {/* TAB 0: CONTENT */}
              <div className="tab-panel active" style={{ gap: "14px", padding: "16px", flexDirection: "column" }}>
                <div className="section-card">
                  <div className="section-card-header">Basic Info</div>
                  <div className="section-card-body">
                    <div className="field">
                      <label>Title</label>
                      <input type="text" id="d-title" placeholder="e.g. Monsoon Escape — Chiang Mai" onInput={() => autoSlug("d-title", "d-slug")} />
                    </div>
                    <div className="field">
                      <label>Slug</label>
                      <div className="slug-wrap">
                        <span className="slug-prefix">/deals/</span>
                        <input type="text" id="d-slug" placeholder="monsoon-escape-chiang-mai" />
                      </div>
                    </div>

                    {/* DEAL CATEGORY */}
                    <div className="field">
                      <label>
                        Deal Category <span style={{ color: "var(--danger)", fontSize: "11px", marginLeft: "3px" }}>required</span>
                      </label>
                      <div className="field-hint" style={{ marginBottom: "6px" }}>
                        This determines how this deal is grouped on the Quest page and sets the top tag on the deal listing card.
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }} id="d-category-group">
                        {DEAL_CATS.map((c) => (
                          <label
                            key={c.cat}
                            onClick={(e) => setDealCategory(e.currentTarget)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              padding: "11px 14px",
                              cursor: "pointer",
                              borderBottom: c.border ? "1px solid var(--border)" : undefined,
                              background: "var(--surface2)",
                              transition: "background .12s",
                            }}
                            data-cat={c.cat}
                          >
                            <span style={{ fontSize: "16px" }}>{c.icon}</span>
                            <span>
                              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", display: "block" }}>{c.title}</span>
                              <span style={{ fontSize: "11px", color: "var(--muted)" }}>{c.desc}</span>
                            </span>
                            <span className="deal-cat-check" style={CHECK_STYLE}></span>
                          </label>
                        ))}
                      </div>
                      <input type="hidden" id="d-category-value" />
                      <div id="d-category-preview" style={{ display: "none", marginTop: "8px", alignItems: "center", gap: "7px" }}>
                        <span style={{ fontSize: "11px", color: "var(--muted2)" }}>Top tag on deal page:</span>
                        <span id="d-category-tag" style={{ display: "inline-block", background: "var(--accent)", color: "#fff", fontSize: "10px", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "20px" }}></span>
                      </div>
                    </div>

                    {/* CONNECTED QUESTS */}
                    <div className="field">
                      <label>Connected Quests</label>
                      <div className="field-hint" style={{ marginBottom: "9px" }}>
                        Select all quests this deal should appear in. Use filters to narrow the list. Max 6 deals per category shown per quest on the frontend.
                      </div>
                      <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginBottom: "9px", alignItems: "center" }}>
                        <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--muted2)", whiteSpace: "nowrap" }}>Filter:</span>
                        <select id="dq-filter-location" onChange={() => filterQuestSelector()} style={{ fontSize: "12px", padding: "5px 10px", borderRadius: "7px", flex: 1, minWidth: "110px", maxWidth: "160px" }}>
                          <option value="">All Locations</option>
                          <option value="Asia">Asia</option>
                          <option value="Europe">Europe</option>
                          <option value="Middle East & Africa">Middle East &amp; Africa</option>
                          <option value="Americas">Americas</option>
                        </select>
                        <select id="dq-filter-type" onChange={() => filterQuestSelector()} style={{ fontSize: "12px", padding: "5px 10px", borderRadius: "7px", flex: 1, minWidth: "120px", maxWidth: "180px" }}>
                          <option value="">All Quest Types</option>
                          <option value="Move Abroad">Move Abroad</option>
                          <option value="Try a New Life">Try a New Life</option>
                          <option value="Level Up">Level Up</option>
                        </select>
                        <button
                          onClick={() => selectAllFilteredQuests()}
                          style={{ fontSize: "11.5px", padding: "5px 11px", background: "transparent", border: "1px solid var(--border)", borderRadius: "7px", color: "var(--muted2)", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'DM Sans',sans-serif", transition: "all .13s" }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = "var(--accent)";
                            e.currentTarget.style.color = "var(--accent)";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = "var(--border)";
                            e.currentTarget.style.color = "var(--muted2)";
                          }}
                        >
                          Select all filtered
                        </button>
                      </div>
                      <div id="d-quests-group" style={{ border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", maxHeight: "220px", overflowY: "auto" }}>
                        {/* JS-rendered rows */}
                      </div>
                      <div id="dq-empty" style={{ display: "none", padding: "10px 14px", fontSize: "12px", color: "var(--muted)", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "8px", marginTop: "4px" }}>
                        No quests match the current filters.
                      </div>
                      <div id="d-quests-chips" style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "9px", minHeight: 0 }}></div>
                      <div id="d-quests-selected" style={{ marginTop: "5px", fontSize: "11.5px", color: "var(--muted)" }}>
                        No quests selected — this deal won&apos;t appear on any Quest page.
                      </div>
                    </div>
                  </div>
                </div>

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
                  </div>
                </div>

                
                <div className="section-card">
                  <div className="section-card-header">Details</div>
                  <div className="section-card-body">
                    <div className="field">
                      <label>Short Description</label>
                      <textarea placeholder="2–3 sentences summarising this deal…" rows={3}></textarea>
                    </div>
                    <div className="field">
                      <label>Partner Name</label>
                      <input type="text" placeholder="e.g. Surf Bali Co." />
                      <div className="field-hint">Displayed under the product image on the frontend</div>
                    </div>
                  </div>
                </div>

                <div className="section-card">
                  <div className="section-card-header">Content</div>
                  <div className="section-card-body" style={{ gap: "18px" }}>
                    <div className="field">
                      <label>What this is</label>
                      <SimpleRte placeholder="Describe what this product or program actually is…" withHeadings h3Only />
                    </div>
                    <div className="field">
                      <label>Who it&apos;s for</label>
                      <SimpleRte placeholder="Describe the ideal person this deal or offer is suited for…" />
                    </div>
                    <div className="field">
                      <label>
                        Requirements <span className="opt">optional — hidden on frontend if empty</span>
                      </label>
                      <div className="repeater" id="req-repeater">
                        <div className="repeater-item">
                          <div className="repeater-item-header">
                            <span className="repeater-drag">⠿</span>
                            <span className="repeater-item-title">Requirement 1</span>
                            <button className="repeater-remove" onClick={(e) => removeItem(e.currentTarget)}>
                              ×
                            </button>
                          </div>
                          <div className="field">
                            <label>Requirement</label>
                            <input type="text" placeholder="e.g. Valid passport with 6+ months validity" />
                          </div>
                        </div>
                      </div>
                      <button className="add-repeater-btn" onClick={() => addRequirement()}>
                        ＋ Add Requirement
                      </button>
                    </div>
                    <div className="field">
                      <label>What you get</label>
                      <div className="repeater" id="incl-repeater">
                        <div className="repeater-item">
                          <div className="repeater-item-header">
                            <span className="repeater-drag">⠿</span>
                            <span className="repeater-item-title">Item 1</span>
                            <button className="repeater-remove" onClick={(e) => removeItem(e.currentTarget)}>
                              ×
                            </button>
                          </div>
                          <div className="field">
                            <label>Item</label>
                            <input type="text" placeholder="e.g. 5 nights accommodation with breakfast" />
                          </div>
                        </div>
                      </div>
                      <button className="add-repeater-btn" onClick={() => addIncluded()}>
                        ＋ Add Item
                      </button>
                    </div>
                    <div className="field">
                      <label>Why this is useful</label>
                      <SimpleRte placeholder="Explain why this is worth it — context, relevance to the quest, real benefit…" />
                    </div>
                  </div>
                </div>

                {/* CTA & ACTION TYPE */}
                <div className="section-card" id="cta-action-card">
                  <div className="section-card-header">Booking</div>
                  <div className="section-card-body">
                    {/* Offer box copy — the orange box on the deal page that holds
                        the booking button (label, price, note around the button). */}
                    <div className="field">
                      <label>Offer Label</label>
                      <input type="text" id="d-offer-label" placeholder="e.g. Limited offer, Special price, Member deal" />
                      <div className="field-hint">Small orange eyebrow above the price in the offer box.</div>
                    </div>
                    <div className="field">
                      <label>
                        Offer Price <span className="opt">optional</span>
                      </label>
                      <input type="text" id="d-offer-price" placeholder="e.g. From $890 · $1,200 · Free" />
                      <div className="field-hint">The large price text in the offer box. Leave blank to use the program price.</div>
                    </div>
                    <div className="field">
                      <label>
                        Offer Note <span className="opt">optional</span>
                      </label>
                      <input type="text" id="d-outcome-text" placeholder="e.g. Save $200 vs booking direct" />
                      <div className="field-hint">Small note beneath the price in the offer box.</div>
                    </div>
                    <div className="field">
                      <label>CTA Button Label</label>
                      <input
                        type="text"
                        id="d-btn-text"
                        placeholder="e.g. Book Now, Enrol, Apply, Claim Spot"
                        defaultValue="Claim offer"
                        onInput={(e) => {
                          updateDealBtnPreview(e.currentTarget);
                          updateFinalCtaPreview();
                        }}
                      />
                      <div className="field-hint">
                        Appears on the booking button — match the action (Book Now, Enrol, Apply, Claim Spot, Join Programme…)
                      </div>
                      <div style={{ marginTop: "10px" }}>
                        <div style={{ fontSize: "10.5px", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--muted2)", marginBottom: "7px" }}>
                          Button Preview
                        </div>
                        <button id="d-btn-preview" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#e8440a", color: "#fff", border: "none", borderRadius: "50px", padding: "13px 28px", fontFamily: "'DM Sans',sans-serif", fontSize: "15px", fontWeight: 700, cursor: "default", letterSpacing: ".01em", boxShadow: "0 4px 16px rgba(232,68,10,.28)", pointerEvents: "none" }}>
                          Claim offer
                        </button>
                      </div>
                    </div>

                    <div className="field">
                      <label>Action Type</label>
                      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "6px" }} id="d-action-type-cards">
                        {([
                          ["leadform", "📋", "Lead Gen", "User fills a form — you capture the lead and follow up", false],
                          ["booking", "🗓️", "Book", "User books through OutQuest — program details, dates, and a deposit", false],
                          ["direct", "🔗", "Direct Link", "Sends user straight to the partner's own booking page", true],
                        ] as [string, string, string, string, boolean][]).map(([val, icon, name, desc, sel]) => (
                          <div className={sel ? "book-type-card selected" : "book-type-card"} data-val={val} onClick={(e) => switchActionTypeCard(e.currentTarget, val)} key={val}>
                            <div className="btc-icon">{icon}</div>
                            <div className="btc-name">{name}</div>
                            <div className="btc-desc">{desc}</div>
                          </div>
                        ))}
                      </div>
                      <input type="hidden" id="d-action-type" defaultValue="direct" />
                    </div>

                    {/* BOOKING */}
                    <div id="cta-panel-booking" className="cta-panel" style={{ display: "none" }}>
                      <div style={{ height: "1px", background: "var(--border-thin)", margin: "2px 0 18px" }}></div>
                      <div className="infobox" style={{ marginBottom: "18px" }}>
                        <span className="ib-icon">🗓️</span>User books through OutQuest. Step 1 collects their details via the form you build below. Step 2 takes payment — either a deposit to hold their place, or the full amount upfront.
                      </div>
                      <div className="field-group" style={{ marginBottom: "18px" }}>
                        <label className="field-label">Payment Type</label>
                        <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                          <div id="bk-pay-card-deposit" onClick={() => switchBookingPayType("deposit")} style={{ flex: 1, border: "2px solid var(--coral)", background: "#FEF2EE", borderRadius: "10px", padding: "14px 16px", cursor: "pointer", transition: "all .18s" }}>
                            <div style={{ fontSize: "12px", fontWeight: 800, color: "var(--coral)", marginBottom: "3px" }}>DEPOSIT</div>
                            <div style={{ fontSize: "12px", color: "var(--muted2)", lineHeight: 1.4 }}>Charge a deposit now — balance collected later before program start</div>
                          </div>
                          <div id="bk-pay-card-full" onClick={() => switchBookingPayType("full")} style={{ flex: 1, border: "1.5px solid var(--border)", background: "var(--white)", borderRadius: "10px", padding: "14px 16px", cursor: "pointer", transition: "all .18s" }}>
                            <div style={{ fontSize: "12px", fontWeight: 800, color: "var(--muted2)", marginBottom: "3px" }}>FULL AMOUNT</div>
                            <div style={{ fontSize: "12px", color: "var(--muted2)", lineHeight: 1.4 }}>Charge the complete program price upfront at booking</div>
                          </div>
                        </div>
                        <input type="hidden" id="d-pay-type" defaultValue="deposit" />
                      </div>
                      <div className="grid-2" style={{ marginBottom: "14px" }}>
                        <div className="field-group">
                          <label className="field-label">Total Program Price ($)</label>
                          <input type="number" id="d-total-price" min="0" placeholder="e.g. 890" onInput={() => updateBookingPreview()} />
                          <div className="field-hint">Full cost of the program.</div>
                        </div>
                        <div className="field-group">
                          <label className="field-label">Billing Unit</label>
                          <select id="d-bk-billing-unit" onChange={() => updateBookingPreview()} defaultValue="per_program">
                            <option value="per_program">Per Program</option>
                            <option value="per_month">Per Month</option>
                            <option value="per_week">Per Week</option>
                            <option value="per_session">Per Session</option>
                            <option value="on_request">On Request</option>
                          </select>
                        </div>
                      </div>
                      <div id="bk-deposit-fields" style={{ marginBottom: "14px" }}>
                        <div className="field-group">
                          <label className="field-label">Deposit Amount ($)</label>
                          <input type="number" id="d-deposit-amount" min="0" placeholder="e.g. 150" onInput={() => updateBookingPreview()} />
                          <div className="field-hint">Charged now to hold the booking. Remainder due before program start.</div>
                        </div>
                      </div>
                      <div className="field-group" style={{ marginBottom: "18px" }}>
                        <label className="field-label">Refund / Cancellation Policy</label>
                        <input type="text" id="d-refund-policy" placeholder="e.g. Refundable if cancelled 14+ days before start date" onInput={() => updateBookingPreview()} />
                        <div className="field-hint">Shown beneath the payment amount on the booking form.</div>
                      </div>
                      <div style={{ marginBottom: "22px" }}>
                        <div style={{ fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--muted2)", marginBottom: "8px" }}>
                          Payment Step Preview <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: "10px" }}>(how it appears on the booking form)</span>
                        </div>
                        <div id="d-booking-preview" style={{ background: "var(--surface2)", border: "1.5px solid var(--border)", borderRadius: "12px", padding: "16px 18px" }}>
                          <div style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--muted)", marginBottom: "8px" }} id="bp-box-label">
                            Deposit to secure your place
                          </div>
                          <div id="bp-amount" style={{ fontFamily: "'Syne',sans-serif", fontSize: "24px", fontWeight: 700, color: "var(--text)" }}>$—</div>
                          <div id="bp-policy" style={{ fontSize: "12px", color: "var(--muted2)", marginTop: "4px", lineHeight: 1.5 }}>Refund policy will appear here</div>
                          <div id="bp-breakdown" style={{ borderTop: "1px solid var(--border)", marginTop: "10px", paddingTop: "10px", display: "flex", flexDirection: "column", gap: "5px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--muted2)" }}>
                              <span>Total program price</span>
                              <span id="bp-total">$—</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                              <span style={{ color: "var(--muted2)" }} id="bp-due-label">Deposit due now</span>
                              <strong id="bp-due" style={{ color: "var(--text)" }}>$—</strong>
                            </div>
                            <div id="bp-balance-row" style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--muted2)" }}>
                              <span>Balance due later</span>
                              <span id="bp-balance">$—</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ height: "1px", background: "var(--border)", marginBottom: "18px" }}></div>
                      <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".09em", color: "var(--muted2)", marginBottom: "6px" }}>
                        Booking Form Fields (Step 1)
                      </div>
                      <div className="infobox" style={{ marginBottom: "14px" }}>
                        <span className="ib-icon">📋</span>First name, last name, email, and WhatsApp/phone are always collected automatically. Add the program-specific questions below.
                      </div>
                      <div id="bkf-repeater" style={{ display: "flex", flexDirection: "column", gap: "10px" }}></div>
                      <button className="add-repeater-btn" onClick={() => addBKFField()} style={{ marginTop: "8px" }}>
                        ＋ Add Field
                      </button>
                    </div>

                    {/* DIRECT */}
                    <div id="cta-panel-direct" className="cta-panel">
                      <div style={{ height: "1px", background: "rgba(26,23,20,.1)", margin: "4px 0 18px" }}></div>
                      <div className="field-group" style={{ marginBottom: "16px" }}>
                        <label className="field-label">Book URL</label>
                        <input type="url" id="d-book-url" placeholder="https://partner.com/book — or your booking/intake form URL" />
                        <div className="field-hint">Where users go to book, enrol, or apply — a partner page, Typeform, Calendly, or any intake flow.</div>
                      </div>
                      <div className="toggle-wrap" style={{ marginBottom: "22px" }}>
                        <label className="toggle">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                        </label>
                        <span className="toggle-label">Open in new tab</span>
                      </div>
                      <div style={{ height: "1px", background: "rgba(26,23,20,.08)", marginBottom: "18px" }}></div>
                     
                     
                     
                    </div>

                    {/* LEAD CAPTURE */}
                    <div id="cta-panel-leadform" className="cta-panel" style={{ display: "none" }}>
                      <div style={{ height: "1px", background: "var(--border-thin)", margin: "2px 0 14px" }}></div>
                      <div className="infobox" style={{ marginBottom: "14px" }}>
                        <span className="ib-icon">📋</span>Build the form users fill in to enquire about this deal. Name + Email are always included automatically.
                      </div>
                      <div id="lcf-repeater" style={{ display: "flex", flexDirection: "column", gap: "10px" }}></div>
                      <button className="add-repeater-btn" onClick={() => addLCFField()} style={{ marginTop: "6px" }}>
                        ＋ Add Field
                      </button>
                    </div>
                  </div>
                </div>

                {/* Final CTA copy */}
                <div className="section-card">
                  <div className="section-card-header">Final CTA Copy</div>
                  <div className="section-card-body">
                    <div className="field">
                      <label>Final CTA Heading</label>
                      <input type="text" id="d-cta-heading" placeholder="e.g. Gear up before the season starts." onInput={() => updateFinalCtaPreview()} />
                      <div className="field-hint">Large heading shown in the bottom CTA black section</div>
                    </div>
                    <div className="field">
                      <label>
                        Final CTA Subtext <span className="opt">optional</span>
                      </label>
                      <input type="text" id="d-cta-subtext" placeholder="e.g. Stock sells out fast. Don't miss out." onInput={() => updateFinalCtaPreview()} />
                      <div className="field-hint">Supporting line beneath the CTA heading</div>
                    </div>
                    
                    <div className="field">
                      <label>
                        Final CTA Button Text <span className="opt">optional</span>
                      </label>
                      <input type="text" id="d-cta-btn-text" placeholder="e.g. Buy Now, Book Now, Claim Spot" onInput={() => updateFinalCtaPreview()} />
                      <div className="field-hint">Text on the bottom CTA button. Leave blank to reuse the main CTA Button Label.</div>
                    </div>
                    <div style={{ marginTop: "4px" }}>
                      <div style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--muted2)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "8px" }}>
                        Offering Preview
                      </div>
                      <div id="d-final-cta-preview" style={{ background: "#111", borderRadius: "10px", padding: "22px 20px", display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start", boxShadow: "0 4px 18px rgba(0,0,0,.18)" }}>
                        <div id="d-cta-preview-heading" style={{ fontFamily: "'Syne',sans-serif", fontSize: "18px", fontWeight: 700, color: "#fff", lineHeight: 1.3, wordBreak: "break-word" }}>
                          Gear up before the season starts.
                        </div>
                        <div id="d-cta-preview-subtext" style={{ fontSize: "13px", color: "rgba(255,255,255,.6)", lineHeight: 1.5, display: "none" }}></div>
                        <button id="d-cta-preview-btn" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#e8440a", color: "#fff", border: "none", borderRadius: "50px", padding: "11px 24px", fontFamily: "'DM Sans',sans-serif", fontSize: "14px", fontWeight: 700, cursor: "default", letterSpacing: ".01em", boxShadow: "0 4px 14px rgba(232,68,10,.32)", pointerEvents: "none", marginTop: "2px" }}>
                          Claim offer 
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TAB 1: SEO */}
              <div className="tab-panel" style={{ gap: "14px", padding: "16px", flexDirection: "column" }}>
                <div className="section-card">
                  <div className="section-card-header">SEO</div>
                  <div className="section-card-body">
                    <div>
                      <div style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--muted2)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "8px" }}>
                        Search Preview
                      </div>
                      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px", boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
                        <div style={{ fontSize: "12px", color: "#188038", marginBottom: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <span style={{ width: "14px", height: "14px", background: "var(--surface3)", borderRadius: "50%", display: "inline-block", verticalAlign: "middle" }}></span>
                          outquest.com › deals › <span id="d-serp-slug" style={{ color: "#188038" }}>your-deal-slug</span>
                        </div>
                        <div id="d-serp-title" style={{ fontSize: "18px", color: "#1558d6", fontWeight: 400, marginBottom: "4px", lineHeight: 1.3, wordBreak: "break-word" }}>
                          Deal Title — OutQuest
                        </div>
                        <div id="d-serp-desc" style={{ fontSize: "13px", color: "#4d5156", lineHeight: 1.55 }}>
                          Your meta description will appear here — write something compelling that makes people want to click.
                        </div>
                      </div>
                      <div style={{ marginTop: "7px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <div id="d-seo-bar" style={{ height: "5px", borderRadius: "3px", background: "var(--border)", flex: 1, transition: "background .25s" }}></div>
                        <span id="d-seo-bar-label" style={{ fontSize: "11px", color: "var(--muted)", whiteSpace: "nowrap", minWidth: "90px", textAlign: "right" }}></span>
                      </div>
                    </div>

                    <div style={{ height: "1px", background: "var(--border)", margin: "2px 0" }}></div>

                    <div className="field">
                      <label>Title Tag</label>
                      <input
                        type="text"
                        id="d-seo-title"
                        placeholder="e.g. Monsoon Escape — Chiang Mai — OutQuest"
                        maxLength={60}
                        onInput={(e) => {
                          updateSeoCounter(e.currentTarget, "d-seo-title-count", 60);
                          syncDealSerp();
                        }}
                      />
                      <div className="field-hint" style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Auto-filled from deal title + brand name. Recommended: 50–60 chars.</span>
                        <span id="d-seo-title-count" style={{ fontWeight: 600, color: "var(--muted)", whiteSpace: "nowrap", marginLeft: "12px" }}>0 / 60</span>
                      </div>
                    </div>

                    <div className="field">
                      <label>Meta Description</label>
                      <textarea
                        id="d-meta-desc"
                        placeholder="Auto-filled from Short Description. Edit to write a compelling search snippet…"
                        rows={3}
                        maxLength={160}
                        onInput={(e) => {
                          updateSeoCounter(e.currentTarget, "d-meta-count", 160);
                          syncDealSerp();
                        }}
                      ></textarea>
                      <div className="field-hint" style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Recommended: 140–160 characters</span>
                        <span id="d-meta-count" style={{ fontWeight: 600, color: "var(--muted)", whiteSpace: "nowrap", marginLeft: "12px" }}>0 / 160</span>
                      </div>
                    </div>

                    <div className="field">
                      <label>
                        Focus Keyword <span className="opt">optional</span>
                      </label>
                      <input type="text" id="d-focus-kw" placeholder="e.g. chiang mai monsoon deal" />
                      <div className="field-hint">Primary keyword this page should rank for</div>
                    </div>

                    <div className="field">
                      <label>
                        Canonical URL <span className="opt">optional</span>
                      </label>
                      <input type="url" id="d-canonical" placeholder="https://outquest.com/deals/…" onInput={() => syncDealSerp()} />
                      <div className="field-hint">Leave blank — canonical defaults to the deal&apos;s slug URL</div>
                    </div>

                    <div style={{ height: "1px", background: "var(--border)", margin: "2px 0" }}></div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted2)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "6px" }}>
                      Open Graph / Social Share
                    </div>

                    <div className="field">
                      <label>
                        OG Title <span className="opt">optional — falls back to Title Tag</span>
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
                          <input type="checkbox" id="d-index-toggle" defaultChecked onChange={() => syncDealIndexBadge()} />
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

                    <div id="d-index-badge" style={{ display: "flex", alignItems: "center", gap: "7px", padding: "9px 12px", background: "rgba(42,157,111,.07)", border: "1px solid rgba(42,157,111,.22)", borderRadius: "8px", fontSize: "12px" }}>
                      <span style={{ fontSize: "14px" }}>✅</span>
                      <span style={{ color: "var(--accent2)", fontWeight: 600 }}>This page is indexable</span>
                      <span style={{ color: "var(--muted)", marginLeft: "2px" }}>— Google can discover and rank it</span>
                    </div>
                    <div id="d-noindex-badge" style={{ display: "none", alignItems: "center", gap: "7px", padding: "9px 12px", background: "rgba(217,48,37,.07)", border: "1px solid rgba(217,48,37,.22)", borderRadius: "8px", fontSize: "12px" }}>
                      <span style={{ fontSize: "14px" }}>🚫</span>
                      <span style={{ color: "var(--danger)", fontWeight: 600 }}>Noindex is on</span>
                      <span style={{ color: "var(--muted)", marginLeft: "2px" }}>— search engines will skip this page</span>
                    </div>

                    <div style={{ padding: "10px 13px", background: "rgba(74,108,247,.06)", border: "1px solid rgba(74,108,247,.18)", borderRadius: "8px", fontSize: "11.5px", color: "var(--muted2)", lineHeight: 1.55 }}>
                      💡 <strong style={{ color: "var(--accent3)" }}>Structured data</strong> — This deal page automatically outputs{" "}
                      <code style={{ fontSize: "11px", background: "rgba(74,108,247,.1)", padding: "1px 5px", borderRadius: "4px" }}>Product</code> and{" "}
                      <code style={{ fontSize: "11px", background: "rgba(74,108,247,.1)", padding: "1px 5px", borderRadius: "4px" }}>Offer</code> JSON-LD schema using the price, partner name, and slug fields. No extra configuration needed.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="edit-sidebar">
          <div className="section-card">
            <div className="section-card-header">Status</div>
            <div className="section-card-body">
              <div className="status-toggle" id="d-status">
                <button className="active-draft" onClick={(e) => setStatus("d-status", "draft", e.currentTarget)}>
                  Draft
                </button>
                <button onClick={(e) => setStatus("d-status", "published", e.currentTarget)}>Published</button>
              </div>
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                Save &amp; Publish
              </button>
              <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
                Save Draft
              </button>
              <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
                👁 Preview
              </button>
            </div>
          </div>

          {/* FEATURED */}
          <div className="ext-sidebar-card">
            <div className="ext-sidebar-hd">⭐ Featured</div>
            <div className="ext-sidebar-bd">
              <div style={{ display: "flex", alignItems: "flex-start", gap: "11px" }}>
                <label className="toggle" style={{ marginTop: "2px", flexShrink: 0 }}>
                  <input type="checkbox" id="d-featured" onChange={(e) => extToggleFeaturedBadge(e.currentTarget, "d-featured-badge")} />
                  <span className="toggle-slider"></span>
                </label>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", marginBottom: "2px" }}>Feature this on the homepage</div>
                  <div style={{ fontSize: "11.5px", color: "var(--muted)", lineHeight: 1.5 }}>
                    Shows this deal in the Popular Programs section on the homepage. Maximum 6 deals can be featured at a time.
                  </div>
                </div>
              </div>
              <div id="d-featured-badge" style={{ display: "none", padding: "8px 11px", background: "rgba(42,157,111,.08)", border: "1px solid rgba(42,157,111,.25)", borderRadius: "7px", fontSize: "11.5px", color: "var(--accent2)", lineHeight: 1.5 }}>
                ✓ This deal is featured on the homepage. Make sure no more than 6 deals are featured at once.
              </div>
            </div>
          </div>

          {/* MARKETPLACE PLACEMENT */}
          <div className="ext-sidebar-card">
            <div className="ext-sidebar-hd">⊟ Placement &amp; Visibility</div>
            <div className="ext-sidebar-bd">
              <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "var(--muted)", marginBottom: "5px" }}>
                Marketplace sections
              </div>
              <div className="ext-placement-row">
                <div className="ext-placement-label">
                  <span>Deals Homepage Hero</span>
                  <small>Show in the top featured slot</small>
                </div>
                <label className="toggle">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="ext-placement-row">
                <div className="ext-placement-label">
                  <span>Hide on Frontend</span>
                  <small>Remove from all listing pages</small>
                </div>
                <label className="toggle">
                  <input type="checkbox" id="d-hide-frontend" onChange={(e) => extToggleHideBadge(e.currentTarget, "d-hide-badge")} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div id="d-hide-badge" style={{ display: "none", padding: "8px 11px", background: "rgba(217,48,37,.07)", border: "1px solid rgba(217,48,37,.2)", borderRadius: "7px", fontSize: "11.5px", color: "var(--danger)", lineHeight: 1.5 }}>
                🚫 Hidden — this deal will not appear on any listing or quest page.
              </div>
              {/* Display Order control was removed from the UI; the value is kept on
                  save via this hidden input so existing ordering isn't blanked
                  (DealsBridge still reads/writes `d-display-order`). */}
              <input type="hidden" id="d-display-order" defaultValue="1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
