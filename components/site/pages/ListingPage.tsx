"use client";

import { Page } from "../Page";
import { Button } from "../ui/Button";
import {
  showPage,
  openLightbox,
  handleLbBg,
  closeLightbox,
  lbNav,
  openShareSheet,
} from "@/lib/site/runtime";

/**
 * Quest listing detail. Almost every block is a container the runtime fills
 * when a listing is opened (gallery, stats, unlocks, path, FAQ, similar…), so
 * this is mostly the static shell + the inline lightbox and the wired buttons.
 */
export function ListingPage() {
  return (
    <Page id="listing">
      <nav className="bc-nav" id="bc-listing">
        <span onClick={() => showPage("home")}>Home</span>
        <span className="bc-sep">›</span>
        <span onClick={() => showPage("quests")}>Quests</span>
        <span className="bc-sep">›</span>
        <span className="bc-current" id="bc-listing-title">
          Quest
        </span>
      </nav>

      {/* PHOTO GRID GALLERY */}
      <div className="gallery">
        <div className="g-photo-grid" id="g-photo-grid">
          <div className="g-photo-main" id="gp-main" onClick={() => openLightbox(0)}>
            <div className="g-photo-inner" id="gp-main-inner"></div>
            <div className="g-photo-hover-ov">
              <div className="g-zoom-icon">⤢</div>
            </div>
            <div className="g-content">
              <div className="g-badges" id="gbadges"></div>
              <h1 id="g-title"></h1>
              <p className="g-tagline" id="g-tagline"></p>
            </div>
            <button
              className="g-all-btn"
              onClick={(e) => {
                e.stopPropagation();
                openLightbox(0);
              }}
            >
              🖼 View all photos
            </button>
          </div>
          <div className="g-photo-thumb" id="gp-t1" onClick={() => openLightbox(1)}>
            <div className="g-photo-inner" id="gp-t1-inner"></div>
            <div className="g-photo-hover-ov">
              <div className="g-zoom-icon">⤢</div>
            </div>
          </div>
          <div className="g-photo-thumb" id="gp-t2" onClick={() => openLightbox(2)}>
            <div className="g-photo-inner" id="gp-t2-inner"></div>
            <div className="g-photo-hover-ov">
              <div className="g-zoom-icon">⤢</div>
            </div>
          </div>
        </div>
        {/* Hidden legacy elements for JS compat */}
        <div style={{ display: "none" }}>
          <div className="g-track" id="gtrack">
            <div className="g-slide" id="gs0"></div>
            <div className="g-slide" id="gs1"></div>
            <div className="g-slide" id="gs2"></div>
            <div className="g-slide" id="gs3"></div>
          </div>
          <div id="gdots"></div>
          <div id="gctr"></div>
        </div>
      </div>

      {/* LIGHTBOX */}
      <div className="lightbox-wrap" id="lightbox-wrap" onClick={(e) => handleLbBg(e.nativeEvent)}>
        <div className="lightbox-inner">
          <button className="lightbox-close" onClick={() => closeLightbox()}>
            ✕
          </button>
          <div className="lightbox-img" id="lb-img">
            <div className="lightbox-img-bg" id="lb-bg"></div>
            <div className="lightbox-img-emoji" id="lb-emoji"></div>
          </div>
          <div className="lightbox-nav">
            <button className="lb-arr" onClick={() => lbNav(-1)}>
              ←
            </button>
            <div className="lb-dots" id="lb-dots"></div>
            <span className="lb-counter" id="lb-counter">
              1 / 4
            </span>
            <button className="lb-arr" onClick={() => lbNav(1)}>
              →
            </button>
          </div>
          <div className="lb-caption" id="lb-caption"></div>
        </div>
      </div>

      <div className="listing-body">
        <div id="listing-save-bar" className="listing-save-bar"></div>
        <div id="l-stats-bar" className="quest-stats-bar" style={{ marginBottom: "48px" }}></div>
        <div id="l-tags-block" style={{ marginBottom: "40px" }}></div>
        <div style={{ marginBottom: "48px" }}>
          <div className="label">What you gain</div>
          <h2 className="serif-h" style={{ marginBottom: "20px" }}>
            What this OutQuest unlocks
          </h2>
          <div className="unlock-grid" id="l-unlocks"></div>
        </div>
        <div style={{ marginBottom: "48px" }}>
          <div className="label">The experience</div>
          <h2 className="serif-h" style={{ marginBottom: "16px" }}>
            What This Quest Looks Like
          </h2>
          <div className="immersive" id="l-immersive"></div>
        </div>
        <div id="l-resource-kit" style={{ marginBottom: "48px", display: "none" }}></div>
        <div style={{ marginBottom: "48px" }}>
          <div className="label">Take action</div>
          <h2 className="serif-h" style={{ marginBottom: "16px" }}>
            Embark On This OutQuest
          </h2>
          <div className="embark-list" id="l-embark"></div>
        </div>
        <div style={{ marginBottom: "48px" }}>
          <h2 className="serif-h" style={{ marginBottom: "32px" }}>
            Everything else you&apos;ll need
          </h2>
          <div id="l-prep-rows"></div>
        </div>
        <div className="cta-band">
          <h3>Better with a companion</h3>
          <p>
            Half the people on this quest showed up solo. But if you&apos;ve got someone who needs a
            nudge — send them this.
          </p>
          <Button
            style={{ fontSize: "15px", padding: "16px 36px" }}
            onClick={() => openShareSheet()}
          >
            Send this quest to a friend
          </Button>
        </div>
        <div style={{ marginBottom: "48px" }}>
          <div className="label">Common questions</div>
          <h2 className="serif-h" style={{ marginBottom: "4px" }}>
            FAQ
          </h2>
          <div className="faq-wrap" id="l-faq"></div>
        </div>
        <div id="l-quest-sequence" style={{ display: "none", marginBottom: 0 }}></div>
        <div style={{ marginBottom: "20px" }}>
          <div className="label">Keep exploring</div>
          <h2 className="serif-h" style={{ marginBottom: "20px" }}>
            Similar OutQuests
          </h2>
          <div className="pq-grid" id="l-similar"></div>
        </div>
      </div>
    </Page>
  );
}
