import { NextResponse } from "next/server";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { guardForm } from "@/lib/formGuard";
import { cleanLine, cleanText, cleanEmail, EMAIL_RE } from "@/lib/sanitize";
import { sendLeadAlert } from "@/lib/notify";

/**
 * Public "Become an Ambassador" application form. Rate-limited +
 * reCAPTCHA-verified, inputs sanitized, then inserted as a lead of type
 * "ambassador" (anon role, allowed by the leads_public_insert RLS policy).
 * Surfaces in the admin Leads dashboard (Ambassadors tab) and emails the
 * configured admin recipients (Settings → Email) plus a confirmation to
 * the applicant.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    name?: unknown;
    email?: unknown;
    location?: unknown;
    role?: unknown;
    network?: unknown;
    shareMethods?: unknown;
    whyFit?: unknown;
    extra?: unknown;
    recaptchaToken?: unknown;
  };

  const guard = await guardForm(req, "ambassador", String(body.recaptchaToken ?? ""));
  if (guard) return guard;

  const name = cleanLine(body.name, 120);
  const email = cleanEmail(body.email);
  const location = cleanLine(body.location, 200);
  const role = cleanLine(body.role, 100);
  const network = cleanText(body.network, 3000);
  const shareMethods = Array.isArray(body.shareMethods)
    ? body.shareMethods.map((s) => cleanLine(s, 60)).filter(Boolean).slice(0, 10)
    : [];
  const whyFit = cleanText(body.whyFit, 2000);
  const extra = cleanText(body.extra, 2000);

  if (!name) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (!EMAIL_RE.test(email))
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  if (!network)
    return NextResponse.json(
      { error: "Tell us a little about your network." },
      { status: 400 }
    );

  const answers: [string, string][] = [];
  if (location) answers.push(["Location", location]);
  if (role) answers.push(["Which best describes you", role]);
  answers.push(["About their network", network]);
  if (shareMethods.length) answers.push(["How they'd share OutQuest", shareMethods.join(", ")]);
  if (whyFit) answers.push(["Why OutQuest fits their network", whyFit]);
  if (extra) answers.push(["Anything else", extra]);

  const sb = createSupabasePublicClient();
  const { error } = await sb.from("leads").insert({
    lead_type: "ambassador",
    name,
    email,
    company: location || null,
    answers,
    status: "new",
  });
  if (error)
    return NextResponse.json({ error: "Could not submit — please try again." }, { status: 500 });

  await sendLeadAlert({ kind: "ambassador", name, email, rows: answers });

  return NextResponse.json({ ok: true });
}
