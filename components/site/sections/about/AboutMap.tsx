import Image from "next/image";
import type { AboutConfig } from "@/lib/site/data/about";

/** About world map — positioned persona cards + location dots over the map image. */
export function AboutMap({ map }: { map: AboutConfig["map"] }) {
  return (
    <section className="wif-section">
      <div className="wif-heading">{map.heading}</div>
      <div className="wif-map-wrap">
        <Image
          src="/about-map.webp"
          className="wif-map-img"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          quality={82}
          priority={false}
          loading="lazy"
        />

        {map.cards.map((c) => (
          <div className="wif-card" style={{ left: c.left, top: c.top, background: c.bg, color: c.color }} key={c.name}>
            <div className="wif-card-top">
              <div className="wif-avatar" style={{ background: c.avatarBg }}>
                {c.emoji}
              </div>
              <div>
                <div className="wif-name">{c.name}</div>
                <div className="wif-role">{c.role}</div>
              </div>
            </div>
            <p className="wif-desc">{c.desc}</p>
            <div className="wif-tag" style={c.tagStyle}>
              {c.tag}
            </div>
          </div>
        ))}

        {map.dots.map((d, i) => (
          <div className="wif-loc-dot" style={{ left: d.left, top: d.top, background: d.bg }} key={i}></div>
        ))}
      </div>
    </section>
  );
}