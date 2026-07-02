import "server-only";
import nodemailer from "nodemailer";
import type { AdminEmailConfig } from "./site/data/adminConfig";

type Result = { ok: true } | { ok: false; error: string };

/** True when the admin has filled in enough SMTP config to actually send. */
export function smtpConfigured(e: AdminEmailConfig): boolean {
  return !!(e.smtpHost && e.smtpUser && e.smtpPass && e.sender);
}

/**
 * Send a single email through the admin-configured SMTP server (hosting mail
 * account). `secure` is inferred from the port: 465 = implicit TLS, otherwise
 * STARTTLS. Server-only — credentials never reach the client.
 */
export async function smtpSend(
  e: AdminEmailConfig,
  msg: { to: string[]; subject: string; html: string; replyTo?: string }
): Promise<Result> {
  if (!smtpConfigured(e)) return { ok: false, error: "SMTP is not configured." };
  if (!msg.to.length) return { ok: false, error: "No recipients configured." };

  const port = Number(e.smtpPort) || 587;
  const transporter = nodemailer.createTransport({
    host: e.smtpHost,
    port,
    secure: port === 465, // 465 = SSL; 587/others use STARTTLS
    auth: { user: e.smtpUser, pass: e.smtpPass },
  });

  try {
    await transporter.sendMail({
      from: e.sender,
      to: msg.to.join(", "),
      subject: msg.subject,
      html: msg.html,
      replyTo: msg.replyTo,
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "SMTP send failed." };
  }
}
