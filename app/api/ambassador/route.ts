import { NextResponse } from "next/server";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { guardForm } from "@/lib/formGuard";
import { cleanLine, cleanText, cleanEmail, EMAIL_RE } from "@/lib/sanitize";
import { sendLeadAlert } from "@/lib/notify";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    name?: unknown; email?: unknown; location?: unknown;
    socialLink?: unknown; network?: unknown; recaptchaToken?: unknown;
  };

  const guard = await guardForm(req, "ambassador", String(body.recaptchaToken ?? ""));
  if (guard) return guard;

  const name = cleanLine(body.name, 120);
  const email = cleanEmail(body.email);
  const location = cleanLine(body.location, 200);
 const socialLink = cleanLine(body.socialLink, 300);
  const network = cleanText(body.network, 3000);
  if (!name) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (!EMAIL_RE.test(email))
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  if (!network)
    return NextResponse.json({ error: "Tell us a little about your network." }, { status: 400 });

  const answers: [string, string][] = [];
  if (location) answers.push(["Location", location]);
  if (socialLink) answers.push(["Social / community link", socialLink]);
  answers.push(["About their network", network]);

  const sb = createSupabasePublicClient();
  const { error } = await sb.from("leads").insert({
    lead_type: "ambassador",
    name, email,
    company: location || null,
    answers,
    status: "new",
  });
  if (error)
    return NextResponse.json({ error: "Could not submit — please try again." }, { status: 500 });

  await sendLeadAlert({ kind: "ambassador", name, email, rows: answers });
  return NextResponse.json({ ok: true });
}
