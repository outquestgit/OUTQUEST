import type { AboutConfig } from "@/lib/site/data/about";

/** About "Why OutQuest" — badge + title + desc items. */
export function AboutWhy({ why }: { why: AboutConfig["why"] }) {
  return (
    <section className="about-why-section">
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 5%" }}>
        <div className="label">{why.label}</div>
        <h2 className="serif-h" style={{ marginBottom: "40px" }}>
          {why.heading}
        </h2>
        <div className="about-why-grid">
          {why.items.map((item) => (
            <div className="about-why-item" key={item.title}>
              <div className="about-why-badge">{item.badge}</div>
              <div>
                <strong>{item.title}</strong>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
