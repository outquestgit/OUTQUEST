import "server-only";
import { getAdminConfig } from "./adminConfig";
import { brevoSendTransactional } from "./brevo";
import { smtpConfigured, smtpSend } from "./smtp";
import { getSiteSettings } from "./siteSettings";

const LABELS: Record<string, string> = {
  lead: "lead",
  contact: "contact message",
  partner: "partner application",
};

const escapeHtml = (s: string) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const looksLikeEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/**
 * The visitor-facing confirmation copy for each form. Sent to the address the
 * visitor entered, so they know the submission went through. `brand` is the
 * public site name, `sender` the reply-to inbox (the Spacemail mailbox).
 */
function confirmationEmail(
  kind: "lead" | "contact" | "partner",
  name: string,
  brand: string,
  sender: string
): { subject: string; html: string } {
  const hi = name ? `Hi ${escapeHtml(name)},` : "Hi there,";
  const intro: Record<typeof kind, { subject: string; line: string }> = {
    contact: {
      subject: `We've received your message — ${brand}`,
      line: `Thanks for reaching out to ${escapeHtml(brand)}. We've received your message and our team will get back to you shortly.`,
    },
    partner: {
      subject: `Thanks for your partnership enquiry — ${brand}`,
      line: `Thanks for your interest in partnering with ${escapeHtml(brand)}. We've received your application and our team will review it and be in touch soon.`,
    },
    lead: {
      subject: `Thanks for your enquiry — ${brand}`,
      line: `Thanks for your interest in ${escapeHtml(brand)}. We've received your enquiry and someone from our team will reach out shortly.`,
    },
  };
  const { subject, line } = intro[kind];
  const html = `
    <div style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#222;max-width:520px">
      <p style="margin:0 0 14px">${hi}</p>
      <p style="margin:0 0 14px">${line}</p>
      <p style="margin:0 0 14px">If you didn't submit this, you can safely ignore this email.</p>
      <p style="margin:18px 0 0;color:#666">— The ${escapeHtml(brand)} team<br>
        <a href="mailto:${escapeHtml(sender)}" style="color:#666">${escapeHtml(sender)}</a></p>
    </div>`;
  return { subject, html };
}

/**
 * Notify on a new public-form submission. Sends two best-effort emails through
 * the admin-configured transport (its own SMTP server if set, else Brevo):
 *   1. an alert to the admin recipients (skipped when none are configured), and
 *   2. a confirmation back to the visitor's own email (skipped when invalid).
 * Reads the private admin config for recipients/sender and swallows all errors
 * so a failed/disabled send never blocks the visitor's submission. No-ops
 * entirely when neither an SMTP transport nor a sender is configured.
 */
export async function sendLeadAlert(input: {
  kind: "lead" | "contact" | "partner";
  name: string;
  email: string;
  rows: [string, string][];
}): Promise<void> {
  try {
    const cfg = await getAdminConfig();
    const recipients = cfg.email.recipients
      .split(/[,;\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const useSmtp = smtpConfigured(cfg.email);
    const sender = cfg.email.sender.trim() || process.env.BREVO_SENDER || "";
    // Need either a configured SMTP transport, or a Brevo key + sender fallback.
    if (!useSmtp && !sender) return;

    let brand = "our team";
    try {
      brand = (await getSiteSettings()).general.siteName || brand;
    } catch {
      // Brand is cosmetic — fall back to the default if settings can't be read.
    }

    // One transport decision for both messages: the admin's SMTP server if
    // configured, otherwise Brevo's API.
    const deliver = (
      to: string[],
      subject: string,
      html: string,
      replyTo?: string
    ): Promise<unknown> =>
      useSmtp
        ? smtpSend(cfg.email, { to, subject, html, replyTo })
        : brevoSendTransactional({ to, subject, html, sender, senderName: brand, replyTo });

    // 1) Admin alert — only when recipients are configured.
    if (recipients.length) {
      const label = LABELS[input.kind] ?? "submission";
      const allRows: [string, string][] = [
        ["Name", input.name],
        ["Email", input.email],
        ...input.rows,
      ];
      const html = `
        <h2 style="font-family:sans-serif;font-size:18px;margin:0 0 12px">New ${escapeHtml(label)}</h2>
        <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
          ${allRows
            .filter(([, v]) => v)
            .map(
              ([k, v]) =>
                `<tr><td style="padding:6px 14px 6px 0;color:#666;vertical-align:top;white-space:nowrap"><strong>${escapeHtml(
                  k
                )}</strong></td><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`
            )
            .join("")}
        </table>`;
      const subject = `New ${label} from ${input.name || input.email || "a visitor"}`;
      await deliver(recipients, subject, html, input.email || undefined);
    }

    // 2) Confirmation to the visitor — only when they gave a valid email.
    if (looksLikeEmail(input.email)) {
      const c = confirmationEmail(input.kind, input.name, brand, sender);
      await deliver([input.email], c.subject, c.html, sender || undefined);
    }
  } catch {
    // Alerts are best-effort — never surface to the visitor.
  }
}
