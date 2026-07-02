"use client";

import { useState } from "react";
import type { SeoDefaults } from "@/lib/site/data/seoDefaults";

/**
 * Settings → SEO Defaults: site-wide meta title pattern, default OG/social image
 * (URL or upload), and a site-wide noindex toggle. Saves to `site_settings.seo`;
 * applied by `lib/seo.ts` buildMetadata as fallbacks across every page.
 */
export function SeoDefaultsEditor({ seo }: { seo: SeoDefaults }) {
  const [titlePattern, setTitlePattern] = useState(seo.titlePattern);
  const [metaDescription, setMetaDescription] = useState(seo.metaDescription);
  const [defaultOgImage, setDefaultOgImage] = useState(seo.defaultOgImage);
  const [noindex, setNoindex] = useState(seo.noindex);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const save = async () => {
    setMsg(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seo: { titlePattern, metaDescription, defaultOgImage, noindex } }),
      });
      const out = await res.json().catch(() => ({}));
      setMsg(res.ok ? { ok: true, text: "SEO defaults saved." } : { ok: false, text: out.error || "Could not save." });
    } catch {
      setMsg({ ok: false, text: "Network error — please try again." });
    }
    setBusy(false);
  };

  const upload = async (file: File) => {
    setUploading(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/quests/upload", { method: "POST", body: fd });
      const out = await res.json().catch(() => ({}));
      if (res.ok && out.url) setDefaultOgImage(out.url);
      else setMsg({ ok: false, text: out.error || "Upload failed." });
    } catch {
      setMsg({ ok: false, text: "Upload failed." });
    }
    setUploading(false);
  };

  return (
    <>
      <div className="field" style={{ gridColumn: "span 2" }}>
        <label>Meta Title Pattern</label>
        <input
          type="text"
          value={titlePattern}
          placeholder="{title} | OutQuest"
          onChange={(e) => setTitlePattern(e.target.value)}
        />
        <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>
          Use <code>{"{title}"}</code> where the page title goes. Leave blank for no pattern.
        </div>
      </div>
      <div className="field" style={{ gridColumn: "span 2" }}>
        <label>Default Meta Description</label>
        <textarea
          rows={2}
          value={metaDescription}
          maxLength={320}
          placeholder="One or two sentences describing the site — used on the homepage and any page without its own description."
          onChange={(e) => setMetaDescription(e.target.value)}
        />
        <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>
          Shown as the homepage description and the fallback for pages with no SEO description. ~150–160 characters recommended.
        </div>
      </div>
      <div className="field" style={{ gridColumn: "span 2" }}>
        <label>Default OG Image (fallback social image)</label>
        <input
          type="url"
          value={defaultOgImage}
          placeholder="https://…"
          onChange={(e) => setDefaultOgImage(e.target.value)}
        />
        <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
          <label className="btn btn-ghost btn-sm" style={{ cursor: "pointer" }}>
            {uploading ? "Uploading…" : "Upload image"}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) upload(f);
              }}
            />
          </label>
          {defaultOgImage && <span style={{ fontSize: "11px", color: "var(--muted)" }}>✓ image set</span>}
        </div>
      </div>
      <div className="field" style={{ gridColumn: "span 2" }}>
        <div className="toggle-wrap">
          <label className="toggle">
            <input type="checkbox" checked={noindex} onChange={(e) => setNoindex(e.target.checked)} />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Discourage search engines (site-wide noindex)</span>
        </div>
      </div>
      <div className="field" style={{ gridColumn: "span 2", display: "flex", alignItems: "center", gap: "12px" }}>
        <button className="btn btn-primary btn-sm" type="button" onClick={save} disabled={busy}>
          {busy ? "Saving…" : "Save SEO Defaults"}
        </button>
        {msg && <span style={{ fontSize: "13px", color: msg.ok ? "#1a6b39" : "#c0341d" }}>{msg.text}</span>}
      </div>
    </>
  );
}
