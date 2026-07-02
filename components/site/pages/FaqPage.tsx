"use client";

import { Fragment, useState } from "react";
import { Page } from "../Page";
import { Breadcrumb } from "../cards/Breadcrumb";
import { FaqItem } from "../cards/FaqItem";
import { Button } from "../ui/Button";
import { DEFAULT_FAQ, type FaqPageConfig } from "@/lib/site/data/faq";
import { useOverlay } from "@/components/site/state/OverlayProvider";

/** Render a string with "\n" as <br/> line breaks. */
function multiline(s: string) {
  const lines = s.split("\n");
  return lines.map((line, i) => (
    <Fragment key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </Fragment>
  ));
}

/** FAQ page: hero + categorised accordions + a "still have questions" CTA.
 *  Content from CMS (`faq`), defaulting to the original copy. */
export function FaqPage({ faq = DEFAULT_FAQ }: { faq?: FaqPageConfig }) {
  const { openLeadModal } = useOverlay();
  // Page-wide single-open accordion (mirrors front.js togglePartnerFaq).
  const [openKey, setOpenKey] = useState<string | null>(null);
  const { hero, categories, stillBox } = faq;
  return (
    <Page id="faq">
      <Breadcrumb trail={[{ label: "Home", page: "home" }]} current="FAQ" />

      <section className="faq-page-hero">
        <div className="eyebrow">{hero.eyebrow}</div>
        <h1 className="serif-h">
          {hero.title}{" "}
          <em style={{ fontStyle: "normal", color: "var(--orange)" }}>{multiline(hero.em)}</em>
        </h1>
        <p className="sub">{hero.sub}</p>
      </section>

      <div className="faq-page-wrap">
        {categories.map((cat) => (
          <div className="faq-category" key={cat.title}>
            <div className="faq-category-header">
              <div className="faq-category-icon">{cat.icon}</div>
              <h2>{cat.title}</h2>
            </div>
            {cat.items.map((item) => {
              const key = `${cat.title}-${item.q}`;
              return (
                <FaqItem
                  q={item.q}
                  a={item.a}
                  key={key}
                  open={openKey === key}
                  onToggle={() => setOpenKey((k) => (k === key ? null : key))}
                />
              );
            })}
          </div>
        ))}

        <div className="faq-still-box">
          <h3>{stillBox.heading}</h3>
          <p>{stillBox.body}</p>
          <Button
            onClick={() =>
              openLeadModal({
                icon: stillBox.modalIcon,
                title: stillBox.modalTitle,
                desc: stillBox.modalDesc,
              })
            }
          >
            {stillBox.buttonLabel}
          </Button>
        </div>
      </div>
    </Page>
  );
}
