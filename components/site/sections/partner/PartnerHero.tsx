"use client";

import { Button } from "../../ui/Button";
import type { PartnerConfig } from "@/lib/site/data/partner";

/** Partner hero: headline/CTA + decorative quest-need card and notifications. */
export function PartnerHero({ hero }: { hero: PartnerConfig["hero"] }) {
  return (
    <section className="ph2-hero">
      <div className="ph2-left">
        <h1 className="ph2-headline">{hero.headline}</h1>
        <p className="ph2-sub">{hero.sub}</p>
        <Button
          style={{ fontSize: "15px", padding: "15px 34px", borderRadius: "50px" }}
          onClick={() => document.getElementById("partner-form-anchor")?.scrollIntoView({ behavior: "smooth" })}
        >
          {hero.ctaLabel}
        </Button>
      </div>

      <div className="ph2-right">
        <div className="ph2-card ph2-card-back" style={{ background: "#E8451A" }}></div>
        <div className="ph2-card ph2-card-mid" style={{ background: "#B8D8F0" }}></div>
        <div className="ph2-card ph2-card-front">
          <div className="ph2-card-inner">
            <div style={{ fontSize: "13px", fontWeight: 400, color: "var(--text2)", marginBottom: "16px" }}>
              🏔️ Ski Season in Japan
            </div>
            <div style={{ fontSize: "11px", color: "var(--text3)", marginBottom: "10px" }}>WHAT THEY NEED</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div className="ph2-need-row">
                <span>🏠</span> Short-term housing in Hokkaido
              </div>
              <div className="ph2-need-row">
                <span>🛡️</span> Winter sports insurance
              </div>
              <div className="ph2-need-row ph2-need-highlight">
                <span>✦</span> Your offer here
              </div>
              <div className="ph2-need-row">
                <span>🎿</span> Gear hire &amp; equipment
              </div>
            </div>
          </div>
        </div>

        <div className="ph2-notif ph2-notif-1">
          <div className="ph2-notif-dot" style={{ background: "#E8451A" }}></div>
          <div>
            <div className="ph2-notif-title">New lead confirmed</div>
            <div className="ph2-notif-sub">via OutQuest · Bali</div>
          </div>
        </div>

        <div className="ph2-notif ph2-notif-2">
          <div className="ph2-notif-icon">✦</div>
          <div>
            <div className="ph2-notif-title">New booking confirmed</div>
            <div className="ph2-notif-sub">Coworking · 3 days</div>
          </div>
        </div>

        <div className="ph2-notif ph2-notif-3">
          <div className="ph2-notif-dot" style={{ background: "#1AAF7A" }}></div>
          <div>
            <div className="ph2-notif-title">Deal claimed</div>
            <div className="ph2-notif-sub">Insurance · Bangkok quest</div>
          </div>
        </div>
      </div>
    </section>
  );
}
