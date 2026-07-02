import { Fragment } from "react";
import type { AboutConfig } from "@/lib/site/data/about";

/** About "How it works" — numbered steps with connectors. */
export function AboutHowItWorks({ howItWorks }: { howItWorks: AboutConfig["howItWorks"] }) {
  return (
    <section className="about-hiw-section">
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 5%" }}>
        <h2
          className="serif-h"
          style={{ marginBottom: "48px", fontSize: "clamp(32px,5vw,56px)", letterSpacing: "0.04em", textTransform: "uppercase" }}
        >
          {howItWorks.heading}
        </h2>
        <div className="about-hiw-row">
          {howItWorks.steps.map((s, i) => (
            <Fragment key={s.title}>
              {i > 0 && <div className="about-hiw-connector"></div>}
              <div className="about-hiw-step">
                <div className="about-hiw-icon-wrap">{s.icon}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
