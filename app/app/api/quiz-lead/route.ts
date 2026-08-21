import { NextResponse } from "next/server";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { guardForm } from "@/lib/formGuard";
import { cleanLine, cleanText, cleanEmail, EMAIL_RE } from "@/lib/sanitize";
import { sendLeadAlert } from "@/lib/notify";

export async function POST(req: Request) {
  try {
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
    if (!name) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    const answers: [string, string][] = Array.isArray(body.answers)
      ? body.answers
          .slice(0, 20)
          .map((a) =>
            Array.isArray(a)
              ? ([cleanLine(a[0], 200), cleanText(a[1], 500)] as [string, string])
              : null
          )
          .filter((a): a is [string, string] => !!a && a[0] !== "" && a[1] !== "")
      : [];

    const matches: [string, string][] = Array.isArray(body.matches)
      ? body.matches
          .slice(0, 10)
          .map((m) =>
            Array.isArray(m)
              ? ([cleanLine(m[0], 200), cleanLine(m[1], 200)] as [string, string])
              : null
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

    if (error) {
      console.error("quiz-lead insert error:", error);
      // Put the real DB reason in `error` so the form shows it
      return NextResponse.json(
        { error: `DB: ${error.message} (${error.code || "no-code"})` },
        { status: 500 }
      );
    }

    // Don't let email failure block the user seeing results
    try {
      await sendLeadAlert({ kind: "quiz", name, email, rows });
    } catch (e) {
      console.error("quiz-lead email error:", e);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("quiz-lead crash:", e);
    return NextResponse.json(
      { error: `Server: ${e instanceof Error ? e.message : "unknown"}` },
      { status: 500 }
    );
  }
}
