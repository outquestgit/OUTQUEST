"use client";

import { useState } from "react";
import { togglePwField } from "@/lib/admin/runtime";
import { ChangePassword } from "./ChangePassword";
import { ChangeEmail } from "./ChangeEmail";
import { SeoDefaultsEditor } from "./SeoDefaultsEditor";
import type { SeoDefaults } from "@/lib/site/data/seoDefaults";
import type { SiteGeneral, GlobalCopy } from "@/lib/site/data/siteConfig";
import type { AdminEmailConfig } from "@/lib/site/data/adminConfig";

/**
 * Settings (`#page-settings`). General + Global Copy are saved to the public
 * `site_settings.settings`; Email alerts to the admin-only `admin_config`. SEO
 * Defaults + Change Password keep their own save buttons. The bottom "Save
 * Settings" button persists everything else (two PUTs).
 */
export function SettingsPage({
  seo,
  general: generalProp,
  globalCopy: copyProp,
  email: emailProp,
  hasSmtpPass,
}: {
  seo: SeoDefaults;
  general: SiteGeneral;
  globalCopy: GlobalCopy;
  email: AdminEmailConfig;
  hasSmtpPass: boolean;
}) {
  const [general, setGeneral] = useState<SiteGeneral>(generalProp);
  const [email, setEmail] = useState<AdminEmailConfig>(emailProp);
  const [smtpPass, setSmtpPass] = useState("");
  const [copy, setCopy] = useState<GlobalCopy>(copyProp);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const gen = (k: keyof SiteGeneral) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setGeneral((s) => ({ ...s, [k]: e.target.value }));
  const eml = (k: keyof AdminEmailConfig) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail((s) => ({ ...s, [k]: e.target.value }));
  const cpy = (k: keyof GlobalCopy) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setCopy((s) => ({ ...s, [k]: e.target.value }));

  const save = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const [r1, r2] = await Promise.all([
        fetch("/api/admin/site-settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ settings: { general, globalCopy: copy } }),
        }),
        fetch("/api/admin/config", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: {
              recipients: email.recipients,
              sender: email.sender,
              smtpHost: email.smtpHost,
              smtpPort: email.smtpPort,
              smtpUser: email.smtpUser,
              smtpPass, // blank = keep existing (server-side)
            },
          }),
        }),
      ]);
      setMsg(
        r1.ok && r2.ok
          ? { ok: true, text: "Settings saved." }
          : { ok: false, text: "Some settings could not be saved — please try again." }
      );
    } catch {
      setMsg({ ok: false, text: "Network error — please try again." });
    }
    setBusy(false);
  };

  const discard = () => {
    setGeneral(generalProp);
    setEmail(emailProp);
    setSmtpPass("");
    setCopy(copyProp);
    setMsg(null);
  };

  return (
    <div className="page" id="page-settings" suppressHydrationWarning>
      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-icon">🌐</div>
          <div>
            <div className="settings-section-title">General</div>
            <div className="settings-section-desc">Site name, timezone, contact info</div>
          </div>
        </div>
        <div className="settings-section-body">
          <div className="field">
            <label>Site Name</label>
            <input type="text" value={general.siteName} onChange={gen("siteName")} />
          </div>
          <div className="field">
            <label>Site URL</label>
            <input type="url" value={general.siteUrl} onChange={gen("siteUrl")} />
          </div>
          <div className="field">
            <label>Timezone</label>
            <select value={general.timezone} onChange={gen("timezone")}>
              <option>Asia/Kuala_Lumpur</option>
              <option>UTC</option>
              <option>Europe/London</option>
              <option>America/New_York</option>
            </select>
          </div>
        </div>
      </div>
      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-icon">🔍</div>
          <div>
            <div className="settings-section-title">SEO Defaults</div>
            <div className="settings-section-desc">Meta title pattern, OG image, robots</div>
          </div>
        </div>
        <div className="settings-section-body">
          <SeoDefaultsEditor seo={seo} />
        </div>
      </div>
      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-icon">📧</div>
          <div>
            <div className="settings-section-title">Email / Notifications</div>
            <div className="settings-section-desc">Lead alert recipients + your SMTP mail server</div>
          </div>
        </div>
        <div className="settings-section-body">
          <div className="field" style={{ gridColumn: "span 2" }}>
            <label>
              Lead Alert Recipient(s){" "}
              <span style={{ fontWeight: 400, color: "var(--muted)" }}>
                (comma-separated — emailed on every new lead / contact / partner submission)
              </span>
            </label>
            <input
              type="text"
              placeholder="you@company.com, ops@company.com"
              value={email.recipients}
              onChange={eml("recipients")}
            />
          </div>
          <div className="field" style={{ gridColumn: "span 2" }}>
            <label>
              Sender Email{" "}
              <span style={{ fontWeight: 400, color: "var(--muted)" }}>
                (the &quot;from&quot; address — usually your SMTP account / mailbox)
              </span>
            </label>
            <input
              type="email"
              placeholder="alerts@yourdomain.com"
              value={email.sender}
              onChange={eml("sender")}
            />
          </div>
          <div className="field">
            <label>SMTP Host</label>
            <input type="text" placeholder="mail.yourhost.com" value={email.smtpHost} onChange={eml("smtpHost")} />
          </div>
          <div className="field">
            <label>SMTP Port</label>
            <input type="number" placeholder="587" value={email.smtpPort} onChange={eml("smtpPort")} />
          </div>
          <div className="field">
            <label>SMTP Username</label>
            <input type="text" placeholder="alerts@yourdomain.com" value={email.smtpUser} onChange={eml("smtpUser")} />
          </div>
          <div className="field">
            <label>SMTP Password</label>
            <div className="pw-wrap">
              <input
                type="password"
                id="smtp-pw"
                placeholder={hasSmtpPass ? "•••••••• (leave blank to keep current)" : "Your SMTP password"}
                value={smtpPass}
                onChange={(e) => setSmtpPass(e.target.value)}
              />
              <button className="pw-eye" onClick={(e) => togglePwField("smtp-pw", e.currentTarget)}>
                👁
              </button>
            </div>
          </div>
          <div className="field" style={{ gridColumn: "span 2" }}>
            <div style={{ fontSize: "11.5px", color: "var(--muted)", lineHeight: 1.5 }}>
              New lead / contact / partner submissions are emailed to the recipients above via this
              SMTP server. Port 465 uses SSL; 587 (and others) use STARTTLS. The password is stored
              securely server-side and never sent back to this page.
            </div>
          </div>
        </div>
      </div>
      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-icon">🔒</div>
          <div>
            <div className="settings-section-title">Security</div>
            <div className="settings-section-desc">Admin login email, password</div>
          </div>
        </div>
        <div className="settings-section-body">
          <ChangeEmail />
          <div className="field" style={{ gridColumn: "span 2", borderTop: "1px solid var(--border)", margin: "2px 0" }} />
          <ChangePassword />
        </div>
      </div>
      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-icon">💬</div>
          <div>
            <div className="settings-section-title">Global Copy — Modals &amp; Drawers</div>
            <div className="settings-section-desc">
              Quest modal, My Quests drawer, Compare Paths modal copy
            </div>
          </div>
        </div>
        <div className="settings-section-body">
          <div className="field" style={{ gridColumn: "span 2" }}>
            <label>
              Quest Modal — Default Heading{" "}
              <span style={{ fontWeight: 400, color: "var(--muted)" }}>
                (when no quest-specific override)
              </span>
            </label>
            <input type="text" value={copy.questModalHeading} onChange={cpy("questModalHeading")} />
          </div>
          <div className="field" style={{ gridColumn: "span 2" }}>
            <label>Quest Modal — Default Subtext</label>
            <input type="text" value={copy.questModalSubtext} onChange={cpy("questModalSubtext")} />
          </div>
          <div className="field" style={{ gridColumn: "span 2" }}>
            <label>My Quests Drawer — Empty State Heading</label>
            <input type="text" value={copy.mqEmptyHeading} onChange={cpy("mqEmptyHeading")} />
          </div>
          <div className="field" style={{ gridColumn: "span 2" }}>
            <label>My Quests Drawer — Empty State Body</label>
            <textarea rows={2} value={copy.mqEmptyBody} onChange={cpy("mqEmptyBody")} />
          </div>
          <div className="field" style={{ gridColumn: "span 2" }}>
            <label>My Quests Drawer — Empty State CTA Button</label>
            <input type="text" value={copy.mqEmptyCta} onChange={cpy("mqEmptyCta")} />
          </div>
          <div className="field" style={{ gridColumn: "span 2" }}>
            <label>My Quests Drawer — Footer Note</label>
            <input type="text" value={copy.mqFooter} onChange={cpy("mqFooter")} />
          </div>
          <div className="field" style={{ gridColumn: "span 2" }}>
            <label>Compare Paths Modal — Heading</label>
            <input type="text" value={copy.compareHeading} onChange={cpy("compareHeading")} />
          </div>
          <div className="field" style={{ gridColumn: "span 2" }}>
            <label>Compare Paths Modal — Subtext</label>
            <input type="text" value={copy.compareSubtext} onChange={cpy("compareSubtext")} />
          </div>
        </div>
      </div>
      <div style={{ marginTop: "4px", display: "flex", gap: "10px", alignItems: "center" }}>
        <button className="btn btn-primary" type="button" onClick={save} disabled={busy}>
          {busy ? "Saving…" : "Save Settings"}
        </button>
        <button className="btn btn-ghost" type="button" onClick={discard} disabled={busy}>
          Discard
        </button>
        {msg && (
          <span style={{ fontSize: "13px", color: msg.ok ? "#1a6b39" : "#c0341d" }}>{msg.text}</span>
        )}
      </div>
    </div>
  );
}
