import { NextResponse } from "next/server";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { guardForm } from "@/lib/formGuard";
import { cleanLine, cleanText, cleanEmail, EMAIL_RE } from "@/lib/sanitize";
import { sendLeadAlert } from "@/lib/notify";

/**
 * Public "Find My Path" quiz lead capture. The quiz's contact step (a gate
 * when the admin has "Require before results" on) posts here before revealing
 * results. Rate-limited + reCAPTCHA-verified like the other public forms,
 * inserted as a lead of type "quiz" for the admin Leads dashboard (its own
 * tab), and confirmed by email with the visitor's matched quests attached —
 * the on-screen copy promises their results by email, and this fulfils it.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    name?: unknown;
    email?: unknown;
    answers?: unknown;
    matches?: unknown;
    recaptchaToken?: unknown;
  };

  const guard = await guardForm(req, "quiz", String(body.recaptchaToken ?? ""));
  if (guard) return guard;

  const name = cleanLine(body.name, 120);
  const email = cleanEmail(body.email);
  if (!name) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (!EMAIL_RE.test(email))
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });

  // The quiz answers the visitor picked, as [question, answer] pairs.
  const answers: [string, string][] = Array.isArray(body.answers)
    ? body.answers
        .slice(0, 20)
        .map((a) =>
          Array.isArray(a) ? ([cleanLine(a[0], 200), cleanText(a[1], 500)] as [string, string]) : null
        )
        .filter((a): a is [string, string] => !!a && a[0] !== "" && a[1] !== "")
    : [];

  // Matched quests, as [label, title] pairs (e.g. ["Best match", "Work a ski
  // season in Japan"]) — computed client-side from the same scoring the
  // results screen uses.
  const matches: [string, string][] = Array.isArray(body.matches)
    ? body.matches
        .slice(0, 10)
        .map((m) =>
          Array.isArray(m) ? ([cleanLine(m[0], 200), cleanLine(m[1], 200)] as [string, string]) : null
        )
        .filter((m): m is [string, string] => !!m && m[0] !== "" && m[1] !== "")
    : [];

  const rows: [string, string][] = [...answers, ...matches];

  const sb = createSupabasePublicClient();
  const { error } = await sb.from("leads").insert({
    lead_type: "quiz",
    name,
    email,
    answers: rows,
    status: "new",
  });
  if (error)
    return NextResponse.json({ error: "Could not submit — please try again." }, { status: 500 });

  // Best-effort admin alert + visitor confirmation (with their matches).
  await sendLeadAlert({ kind: "quiz", name, email, rows });

  return NextResponse.json({ ok: true });
}
