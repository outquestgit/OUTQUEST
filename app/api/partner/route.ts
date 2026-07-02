import { NextResponse } from "next/server";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { guardForm } from "@/lib/formGuard";
import { cleanLine, cleanText, cleanEmail, cleanUrl, EMAIL_RE } from "@/lib/sanitize";
import { sendLeadAlert } from "@/lib/notify";

/**
 * Public "Partner With Us" application form. Rate-limited + reCAPTCHA-verified,
 * inputs sanitized, then inserted as a lead of type "partner" (anon role, allowed
 * by leads_public_insert RLS). Surfaces in the admin Leads dashboard.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    name?: unknown;
    email?: unknown;
    company?: unknown;
    website?: unknown;
    offering?: unknown;
    description?: unknown;
    recaptchaToken?: unknown;
  };

  const guard = await guardForm(req, "partner", String(body.recaptchaToken ?? ""));
  if (guard) return guard;

  const name = cleanLine(body.name, 120);
  const email = cleanEmail(body.email);
  const company = cleanLine(body.company, 200);
  const website = cleanUrl(body.website);
  const description = cleanText(body.description, 5000);
  const offering = Array.isArray(body.offering)
    ? body.offering.map((o) => cleanLine(o, 100)).filter(Boolean).slice(0, 20)
    : [];
  if (!name) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (!EMAIL_RE.test(email))
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });

  const answers: [string, string][] = [];
  if (company) answers.push(["Company / Program", company]);
  if (website) answers.push(["Website", website]);
  if (offering.length) answers.push(["Type of offering", offering.join(", ")]);
  if (description) answers.push(["Description", description]);

  const sb = createSupabasePublicClient();
  const { error } = await sb.from("leads").insert({
    lead_type: "partner",
    name,
    email,
    company: company || null,
    message: description || null,
    answers,
    status: "new",
  });
  if (error)
    return NextResponse.json({ error: "Could not submit — please try again." }, { status: 500 });

  await sendLeadAlert({ kind: "partner", name, email, rows: answers });

  return NextResponse.json({ ok: true });
}
