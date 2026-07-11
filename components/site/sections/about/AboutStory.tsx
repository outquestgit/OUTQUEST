import { getImageProps } from "next/image";
import { multiline } from "../../ui/multiline";
import type { AboutConfig } from "@/lib/site/data/about";

/** About "What we do" — split copy column + decorative polaroids. */
export function AboutStory({ whatWeDo }: { whatWeDo: AboutConfig["whatWeDo"] }) {
  return (
    <section className="about-split-section">
      <div className="about-split-left">
        <div className="label">{whatWeDo.label}</div>
        <h2 className="serif-h" style={{ marginBottom: "28px", lineHeight: 1.1 }}>
          {multiline(whatWeDo.heading)}
        </h2>
        {whatWeDo.paragraphs.map((para, i) => (
          <p
            key={i}
            style={{
              fontSize: "16px",
              lineHeight: 1.85,
              color: "var(--text2)",
              marginBottom: i < whatWeDo.paragraphs.length - 1 ? "20px" : undefined,
            }}
          >
            {para}
          </p>
        ))}
      </div>
      <div className="about-split-pol-wrap" style={{ position: "relative", height: "420px" }}>
        {whatWeDo.polaroids.map((p) => {
          // Resolve optimised src once per polaroid (AVIF/WebP served by /_next/image).
          const imgSrc = p.image
            ? getImageProps({ src: p.image, width: 400, height: 400, quality: 80, alt: "" }).props.src
            : undefined;

          return (
            <div className={`wbt3-pol ${p.cls}`} key={p.cls}>
              <div
                className="wbt3-pol-img"
                style={
                  imgSrc
                    ? { backgroundImage: `url(${imgSrc})`, backgroundSize: "cover", backgroundPosition: "center" }
                    : undefined
                }
              >
                {imgSrc ? "" : p.emoji}
              </div>
              <div className="wbt3-pol-cap">{p.caption}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}