import type { HomepageConfig } from "@/lib/site/data/homepage";

/** "Why OutQuest" — heading + a grid of emoji/title/body cells. */
export function WhySection({ why }: { why: HomepageConfig["why"] }) {
  return (
    <section className="why-section">
      <div
        className="home-why-head"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <h2 className="serif-h" style={{ maxWidth: "700px" }}>
          {why.heading}
        </h2>
      </div>
      <div className="why-grid">
        {why.cells.map((cell, i) => (
          <div className="why-cell" key={`${cell.title}-${i}`}>
            <span className="why-emoji">{cell.emoji}</span>
            <h3>{cell.title}</h3>
            <p>{cell.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
