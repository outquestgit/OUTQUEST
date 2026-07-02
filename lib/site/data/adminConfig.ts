/**
 * PRIVATE admin config (client-safe types + defaults). The values live in the
 * admin-only `admin_config` table (never publicly readable) — see
 * `lib/adminConfig.ts` for the server reader. Holds the lead-alert email
 * settings. Types are imported into the (client) Settings form; the actual
 * values only ever travel from the admin server page → that form.
 */

export interface AdminEmailConfig {
  /** Comma-separated recipient addresses for new lead / contact / partner alerts. */
  recipients: string;
  /** "From" address for alert emails (your SMTP account's from/sender). */
  sender: string;
  /** SMTP transport — your hosting mail server. Used to actually send alerts. */
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  /** SMTP password — stored only in the admin-only table; never sent to the client. */
  smtpPass: string;
}

export interface AdminConfig {
  email: AdminEmailConfig;
}

export const DEFAULT_ADMIN_CONFIG: AdminConfig = {
  email: { recipients: "", sender: "", smtpHost: "", smtpPort: "", smtpUser: "", smtpPass: "" },
};
