import { NextResponse } from "next/server";
import { brevoSubscribe } from "@/lib/brevo";
import { guardForm } from "@/lib/formGuard";
import { cleanEmail, EMAIL_RE } from "@/lib/sanitize";

/**
 * Public newsletter sign-up (the footer `.nl-section`). Rate-limited +
 * reCAPTCHA-verified, then subscribes the email to the configured Brevo list.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { email?: unknown; recaptchaToken?: unknown };

  const guard = await guardForm(req, "newsletter", String(body.recaptchaToken ?? ""));
  if (guard) return guard;

  const email = cleanEmail(body.email);
  if (!EMAIL_RE.test(email))
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });

  const r = await brevoSubscribe(email);
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: r.status });

  return NextResponse.json({ ok: true });
}
