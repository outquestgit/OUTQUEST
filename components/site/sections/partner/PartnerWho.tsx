import type { PartnerConfig } from "@/lib/site/data/partner";

/** Partner "Who we partner with" — coloured category cards. */
export function PartnerWho({ partnerWith }: { partnerWith: PartnerConfig["partnerWith"] }) {
  return (
    <section className="pwp-section">
      <div className="pwp-inner">
        <h2 className="pwp-heading">{partnerWith.heading}</h2>
        <div className="pwp-grid">
          {partnerWith.cards.map((c, i) => (
            <div className="pwp-card" style={{ background: c.bg, color: c.color }} key={i}>
              <div className="pwp-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
