"use client";

import { Page } from "../Page";
import { Breadcrumb } from "../cards/Breadcrumb";
import { showPage } from "@/lib/site/runtime";
import type { LegalPageConfig } from "@/lib/site/data/legal";

/** Shared renderer for the legal pages (Privacy, Terms) — hero + a single rich
 *  HTML content body (authored as one box in the admin) + contact box. */
export function LegalPageView({
  pageId,
  current,
  config,
}: {
  pageId: string;
  current: string;
  config: LegalPageConfig;
}) {
  const { hero, body, contact } = config;
  return (
    <Page id={pageId} active>
      <Breadcrumb trail={[{ label: "Home", page: "home" }]} current={current} />
      <div className="legal-hero">
        <div className="label">{hero.label}</div>
        <h1 className="serif-h">{hero.heading}</h1>
        <p>{hero.sub}</p>
        <div className="legal-meta">🗓️ Last updated: {hero.lastUpdated}</div>
      </div>
      <div className="legal-wrap">
        <button className="legal-back-btn" onClick={() => showPage("home")}>
          Back to OutQuest
        </button>
        <br />
        <br />

        <div className="legal-body" dangerouslySetInnerHTML={{ __html: body }} />

        <div className="legal-contact-box">
          <h3>{contact.heading}</h3>
          <p>{contact.body}</p>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>
      </div>
    </Page>
  );
}
