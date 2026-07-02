import type { HomepageConfig } from "@/lib/site/data/homepage";

/** Social-proof strip — outcome/quote testimonial cards. */
export function SocialProofSection({ socialProof }: { socialProof: HomepageConfig["socialProof"] }) {
  return (
    <section className="sq-proof-section">
      <div className="sq-proof-head">
        <h2 style={{ textWrap: "balance" }}>{socialProof.title}</h2>
        <p>{socialProof.subtitle}</p>
      </div>
      <div className="sq-proof-grid">
        {socialProof.cards.map((card, i) => (
          <div className="sq-proof-card" key={`${card.name}-${i}`}>
            <div className="sq-proof-outcome">
              <span className="sq-proof-outcome-dot"></span>
              {card.outcome}
            </div>
            <p className="sq-proof-quote">{card.quote}</p>
            <div className="sq-proof-meta">
              <div className="sq-proof-avatar" style={{ background: card.avatarBg }}>
                {card.avatarEmoji}
              </div>
              <div className="sq-proof-person">
                <div className="sq-proof-name">{card.name}</div>
                <div className="sq-proof-detail">{card.detail}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
