import { multiline } from "../../ui/multiline";
import type { PartnerConfig } from "@/lib/site/data/partner";

/** Partner "What we do" — copy + pills with a decorative quest-card cluster. */
export function PartnerWhat({ whatWeDo }: { whatWeDo: PartnerConfig["whatWeDo"] }) {
  return (
    <section className="partner-what">
      <div className="partner-what-split">
        <div className="partner-what-text">
          <div className="label">{whatWeDo.label}</div>
          <h2 className="serif-h" style={{ marginBottom: "16px" }}>
            {multiline(whatWeDo.heading)}
          </h2>
          <p className="sub" style={{ fontSize: "16px", marginBottom: "20px" }}>
            {whatWeDo.sub}
          </p>
          <div className="partner-what-pills">
            {whatWeDo.pills.map((p, i) => (
              <span className="pw-pill" key={i}>
                {p}
              </span>
            ))}
          </div>
        </div>
        <div className="partner-what-visual">
          <div className="pwv-card pwv-card-1">
            <div className="pwv-icon">🏙️</div>
            <div className="pwv-body">
              <strong>Move to Bangkok</strong>
              <span>Long-term · Starter Quest</span>
            </div>
          </div>
          <div className="pwv-card pwv-card-2">
            <div className="pwv-icon">💻</div>
            <div className="pwv-body">
              <strong>Go freelance in 90 days</strong>
              <span>12 weeks · Remote</span>
            </div>
          </div>
          <div className="pwv-card pwv-card-3">
            <div className="pwv-icon">🏔️</div>
            <div className="pwv-body">
              <strong>Ski season in Japan</strong>
              <span>3–5 months · Epic Quest</span>
            </div>
          </div>
          <div className="pwv-badge">Your offer here</div>
        </div>
      </div>
    </section>
  );
}
