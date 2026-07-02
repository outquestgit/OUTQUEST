import { NextResponse } from "next/server";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { guardForm } from "@/lib/formGuard";
import { cleanLine, cleanText, cleanEmail, EMAIL_RE } from "@/lib/sanitize";
import { sendLeadAlert } from "@/lib/notify";

/**
 * Public "Contact Us" form. Rate-limited + reCAPTCHA-verified, inputs sanitized,
 * then inserted as a lead of type "contact" (anon role, allowed by the
 * leads_public_insert RLS policy). Surfaces in the admin Leads dashboard.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    name?: unknown;
    email?: unknown;
    subject?: unknown;
    message?: unknown;
    recaptchaToken?: unknown;
  };

  const guard = await guardForm(req, "contact", String(body.recaptchaToken ?? ""));
  if (guard) return guard;

  const name = cleanLine(body.name, 120);
  const email = cleanEmail(body.email);
  const subject = cleanLine(body.subject, 200);
  const message = cleanText(body.message, 5000);
  if (!name) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (!EMAIL_RE.test(email))
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });

  const answers: [string, string][] = [];
  if (subject) answers.push(["Subject", subject]);
  if (message) answers.push(["Message", message]);

  const sb = createSupabasePublicClient();
  const { error } = await sb.from("leads").insert({
    lead_type: "contact",
    name,
    email,
    subject: subject || null,
    message: message || null,
    answers,
    status: "new",
  });
  if (error)
    return NextResponse.json({ error: "Could not send — please try again." }, { status: 500 });

  await sendLeadAlert({ kind: "contact", name, email, rows: answers });

  return NextResponse.json({ ok: true });
}
