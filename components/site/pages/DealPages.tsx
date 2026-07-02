"use client";

import { Page } from "../Page";
import { showPage, closeDealPage, openLink } from "@/lib/site/runtime";

/** Dynamic deal page — breadcrumb + empty shells the runtime fills per deal. */
export function DealDynamicPage() {
  return (
    <Page id="deal-dynamic">
      <nav className="bc-nav">
        <span onClick={() => showPage("home")}>Home</span>
        <span className="bc-sep">›</span>
        <span onClick={() => showPage("quests")}>Quests</span>
        <span className="bc-sep">›</span>
        <span className="bc-current" id="bc-deal-title">
          Deal
        </span>
      </nav>
      <div className="deal-back-bar"></div>
      <div className="deal-page-wrap"></div>
    </Page>
  );
}

/** Static HUBBA co-working deal page. */
export function DealHubbaPage() {
  return (
    <Page id="deal-hubba">
      <nav className="bc-nav">
        <span onClick={() => showPage("home")}>Home</span>
        <span className="bc-sep">›</span>
        <span onClick={() => showPage("quests")}>Quests</span>
        <span className="bc-sep">›</span>
        <span className="bc-current">HUBBA Co-Working</span>
      </nav>
      <div className="deal-back-bar">
        <button className="deal-back-btn" onClick={() => closeDealPage()}>
          Back to quest
        </button>
      </div>
      <div className="deal-page-wrap">
        <div className="dp-hero-img" style={{ marginTop: "20px" }}>
          🏢
          <div className="dp-hero-label">Hubba Bangkok</div>
        </div>

        <div className="dp-badge">Popular</div>
        <h1 className="dp-title">Hubba Co-working 3-Month Membership</h1>
        <p className="dp-desc">
          Bangkok&apos;s most vibrant co-working network. 12 locations across the city, daily hot
          desks, private rooms, and a community of 3,000+ founders, designers, and remote workers.
        </p>

        <div className="dp-offer-box">
          <div>
            <div className="dp-offer-label">OutQuest exclusive</div>
            <div className="dp-offer-price">3 months for $189</div>
            <div className="dp-offer-saving">Save 30% vs. walk-in rate</div>
          </div>
          <button className="dp-claim-btn" onClick={() => openLink("https://hubba.co")}>
            Claim offer
          </button>
        </div>

        <div className="dp-section">
          <h2>What this is</h2>
          <p>
            Hubba is Bangkok&apos;s largest co-working network with 12 locations spread across
            Sukhumvit, Silom, Ari, and Ekkamai. This 3-month membership gives you unlimited hot desk
            access at any location, 8 hours of private room credits per month, and free event access
            including weekly startup and nomad meetups.
          </p>
        </div>

        <div className="dp-section">
          <h2>Who it&apos;s for</h2>
          <p>
            Remote workers, freelancers, and digital nomads who want a reliable workspace and
            instant community. If you hate working alone in a café, this is your base.
          </p>
        </div>

        <div className="dp-section req-section">
          <h2>Requirements</h2>
          <ul className="dp-req-list">
            <li className="dp-req-item">
              <span className="dp-req-dot"></span>
              <span className="dp-req-text">Valid passport or Thai ID for registration</span>
            </li>
            <li className="dp-req-item">
              <span className="dp-req-dot"></span>
              <span className="dp-req-text">Payment method (card or bank transfer accepted)</span>
            </li>
            <li className="dp-req-item">
              <span className="dp-req-dot"></span>
              <span className="dp-req-text">No prior co-working experience needed</span>
            </li>
          </ul>
        </div>

        <div className="dp-section">
          <h2>What you get</h2>
          <ul className="dp-checklist">
            <li>Unlimited hot desk at 12 Bangkok locations</li>
            <li>8 hrs/month private room credits</li>
            <li>Free weekly nomad and founder meetups</li>
            <li>Fast WiFi (1Gbps), printing, free coffee</li>
            <li>Locker storage and dedicated phone booths</li>
            <li>24/7 access at select locations</li>
          </ul>
        </div>

        <div className="dp-section">
          <h2>Why this is useful</h2>
          <p>
            When you first arrive in Bangkok, your workspace is one of the biggest unknowns. Café
            WiFi is unreliable, serviced apartments are hit-or-miss, and hunting for a desk while
            sorting your visa and SIM card is exhausting. A Hubba membership solves that on day one —
            professional setup, fast internet, a built-in community, and a home base to return to
            every day. Most long-term Bangkok nomads credit Hubba as where they found their footing,
            and their first clients.
          </p>
        </div>

        <div className="dp-end-cta">
          <h3>Your desk in Bangkok is waiting.</h3>
          <p>Join 3,000+ members already building in Bangkok.</p>
          <button className="dp-claim-btn" onClick={() => openLink("https://hubba.co")}>
            Claim offer
          </button>
        </div>
      </div>
    </Page>
  );
}
