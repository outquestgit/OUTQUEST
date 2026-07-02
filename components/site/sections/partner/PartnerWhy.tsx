import type { PartnerConfig } from "@/lib/site/data/partner";

/** Partner "Why partner" — numbered benefit cards. */
export function PartnerWhy({ why }: { why: PartnerConfig["why"] }) {
  return (
    <section className="partner-why">
      <div className="partner-why-inner">
        <h2>{why.heading}</h2>
        <div className="partner-why-cards">
          {why.cards.map((c, i) => (
            <div className="partner-why-card" key={i}>
              <div className="partner-why-emoji">{c.emoji}</div>
              <div className="partner-why-num">{i + 1}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
