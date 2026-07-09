"use client";

import { PcmsSectionCard } from "./shared";
import { ImageField } from "./fields";
import type { PageSeoData } from "@/lib/types";

/**
 * Shared SEO section card for static page CMS editors (About, FAQ, Contact,
 * Legal, Partner, Homepage). Fully controlled — bind `data` to a PageSeoData
 * state slice and pipe changes through `onChange`.
 *
 * SERP preview and character counters are derived from state, so they update
 * live without any DOM manipulation.
 */
export function SeoPanel({
  data,
  pagePath,
  order,
  onChange,
}: {
  data: PageSeoData;
  /** Frontend path, e.g. "/about". Used in SERP breadcrumb + canonical placeholder. */
  pagePath: string;
  order: number;
  onChange: (patch: Partial<PageSeoData>) => void;
}) {
  const title = data.seo_title ?? "";
  const desc = data.meta_description ?? "";
  const titleLen = title.length;
  const descLen = desc.length;

  const titleBarColor =
    titleLen === 0
      ? "var(--border)"
      : titleLen < 30
      ? "var(--danger)"
      : titleLen <= 60
      ? "var(--accent2)"
      : "var(--accent)";

  const titleBarLabel =
    titleLen === 0
      ? ""
      : titleLen < 30
      ? `Too short (${titleLen})`
      : titleLen <= 60
      ? `Good (${titleLen})`
      : `Too long (${titleLen})`;

  const titleCountColor =
    titleLen > 60 ? "var(--danger)" : titleLen >= 51 ? "var(--accent)" : "var(--muted)";

  const descCountColor =
    descLen > 160 ? "var(--danger)" : descLen >= 140 ? "var(--accent)" : "var(--muted)";

  const breadcrumb = pagePath.replace(/^\//, "") || "";

  return (
    <PcmsSectionCard icon="🔍" name="SEO" order={order}>
      {/* SERP PREVIEW */}
      <div>
        <div
          style={{
            fontSize: "10.5px",
            fontWeight: 700,
            color: "var(--muted2)",
            textTransform: "uppercase",
            letterSpacing: ".07em",
            marginBottom: "8px",
          }}
        >
          Search Preview
        </div>
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "14px 16px",
            boxShadow: "0 1px 4px rgba(0,0,0,.05)",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#188038",
              marginBottom: "2px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span
              style={{
                width: "14px",
                height: "14px",
                background: "var(--surface3)",
                borderRadius: "50%",
                display: "inline-block",
                verticalAlign: "middle",
              }}
            ></span>
            joinoutquest.com{breadcrumb ? ` › ${breadcrumb}` : ""}
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "#1558d6",
              fontWeight: 400,
              marginBottom: "4px",
              lineHeight: 1.3,
              wordBreak: "break-word",
            }}
          >
            {title || "Your SEO title will appear here"}
          </div>
          <div style={{ fontSize: "13px", color: "#4d5156", lineHeight: 1.55 }}>
            {desc ||
              "Your meta description will appear here — write something compelling that makes people want to click."}
          </div>
        </div>
        <div style={{ marginTop: "7px", display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              height: "5px",
              borderRadius: "3px",
              background: titleBarColor,
              flex: 1,
              transition: "background .2s",
            }}
          ></div>
          <span
            style={{
              fontSize: "11px",
              color: titleLen === 0 ? "var(--muted)" : titleBarColor,
              whiteSpace: "nowrap",
              minWidth: "88px",
              textAlign: "right",
            }}
          >
            {titleBarLabel}
          </span>
        </div>
      </div>

      <div style={{ height: "1px", background: "var(--border)", margin: "10px 0 6px" }}></div>

      {/* SEO TITLE */}
      <div className="field">
        <label>SEO Title</label>
        <input
          type="text"
          value={title}
          placeholder="e.g. About OutQuest — We Help You Live Abroad"
          maxLength={60}
          onChange={(e) => onChange({ seo_title: e.target.value })}
        />
        <div className="field-hint" style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Recommended: 50–60 characters</span>
          <span style={{ fontWeight: 600, color: titleCountColor }}>{titleLen} / 60</span>
        </div>
      </div>

      {/* META DESCRIPTION */}
      <div className="field">
        <label>Meta Description</label>
        <textarea
          value={desc}
          placeholder="A short, compelling summary for search engines and social shares…"
          rows={3}
          maxLength={160}
          onChange={(e) => onChange({ meta_description: e.target.value })}
        ></textarea>
        <div className="field-hint" style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Recommended: 140–160 characters</span>
          <span style={{ fontWeight: 600, color: descCountColor }}>{descLen} / 160</span>
        </div>
      </div>

      {/* CANONICAL */}
      <div className="field">
        <label>
          Canonical URL <span className="opt">optional</span>
        </label>
        <input
          type="url"
          value={data.canonical_url ?? ""}
          placeholder={`https://joinoutquest.com${pagePath}`}
          onChange={(e) => onChange({ canonical_url: e.target.value })}
        />
        <div className="field-hint">Leave blank to use the default URL</div>
      </div>

      <div style={{ height: "1px", background: "var(--border)", margin: "6px 0 8px" }}></div>

      {/* OG SECTION */}
      <div
        style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "var(--muted2)",
          textTransform: "uppercase",
          letterSpacing: ".06em",
          marginBottom: "6px",
        }}
      >
        Open Graph / Social Share
      </div>

      <div className="field">
        <label>
          OG Title <span className="opt">optional — falls back to SEO Title</span>
        </label>
        <input
          type="text"
          value={data.og_title ?? ""}
          placeholder="Title as it appears when shared on social…"
          onChange={(e) => onChange({ og_title: e.target.value })}
        />
      </div>

      <div className="field">
        <label>
          OG Description <span className="opt">optional — falls back to Meta Description</span>
        </label>
        <textarea
          rows={2}
          value={data.og_description ?? ""}
          placeholder="Short hook for social previews…"
          onChange={(e) => onChange({ og_description: e.target.value })}
        ></textarea>
      </div>

      <ImageField
        label="OG Image (optional — 1200 × 630px recommended · JPG or PNG)"
        value={data.og_image_url ?? ""}
        onChange={(v) => onChange({ og_image_url: v })}
      />

      <div style={{ height: "1px", background: "var(--border)", margin: "8px 0" }}></div>

      {/* INDEXING */}
      <div
        style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "var(--muted2)",
          textTransform: "uppercase",
          letterSpacing: ".06em",
          marginBottom: "6px",
        }}
      >
        Indexing
      </div>

      <div
        className="field"
        style={{ flexDirection: "row", alignItems: "center", gap: "10px", paddingTop: "2px" }}
      >
        <label className="toggle">
          <input
            type="checkbox"
            checked={!data.noindex}
            onChange={(e) => onChange({ noindex: !e.target.checked })}
          />
          <span className="toggle-slider"></span>
        </label>
        <div>
          <div style={{ fontSize: "13px", color: "var(--text)", fontWeight: 500 }}>
            Index this page
          </div>
          <div style={{ fontSize: "11px", color: "var(--muted)" }}>
            Allow search engines to crawl and index
          </div>
        </div>
      </div>
    </PcmsSectionCard>
  );
}