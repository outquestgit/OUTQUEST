import { NextResponse } from "next/server";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { guardForm } from "@/lib/formGuard";
import { cleanLine, cleanText, cleanEmail, EMAIL_RE } from "@/lib/sanitize";
import { sendLeadAlert } from "@/lib/notify";

/**
 * Public lead capture — a visitor submitting a deal's lead-capture form
 * (action_type = "leadform"). Rate-limited + reCAPTCHA-verified, inputs
 * sanitized, then inserted into `leads` as the anon role; RLS
 * (`leads_public_insert`) permits insert-only. Answers are the user's responses
 * to the deal's custom fields, stored as [[question, answer], …].
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    dealSlug?: unknown;
    questSlug?: unknown;
    name?: unknown;
    email?: unknown;
    answers?: unknown;
    recaptchaToken?: unknown;
  };

  const guard = await guardForm(req, "lead", String(body.recaptchaToken ?? ""));
  if (guard) return guard;

  const dealSlug = cleanLine(body.dealSlug, 200);
  const questSlug = cleanLine(body.questSlug, 200);
  const name = cleanLine(body.name, 120);
  const email = cleanEmail(body.email);
  if (!name) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (!EMAIL_RE.test(email))
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  if (!dealSlug) return NextResponse.json({ error: "Missing deal." }, { status: 400 });

  // Normalize + sanitize answers to [question, answer] pairs.
  const answers: [string, string][] = Array.isArray(body.answers)
    ? body.answers
        .slice(0, 40)
        .map((a) =>
          Array.isArray(a) ? ([cleanLine(a[0], 200), cleanText(a[1], 2000)] as [string, string]) : null
        )
        .filter((a): a is [string, string] => !!a && a[0] !== "")
    : [];

  const sb = createSupabasePublicClient();

  // Resolve the source deal + its connected quests (anon reads published rows).
  const { data: deal } = await sb
    .from("deals")
    .select("id, title, deal_quests ( quests ( id, title, slug ) )")
    .eq("slug", dealSlug)
    .maybeSingle();
  if (!deal) return NextResponse.json({ error: "This deal is no longer available." }, { status: 404 });

  // Source quest = the quest the visitor came from (questSlug) if it's connected
  // to this deal, otherwise the deal's first connected quest. Links + displays it.
  type QuestRef = { id: string; title: string; slug: string };
  const connected = (
    (deal as unknown as { deal_quests?: { quests: QuestRef | null }[] }).deal_quests ?? []
  )
    .map((dq) => dq.quests)
    .filter((q): q is QuestRef => !!q);
  const sourceQuest =
    (questSlug && connected.find((q) => q.slug === questSlug)) || connected[0] || null;

  const { error } = await sb.from("leads").insert({
    deal_id: deal.id,
    source_deal: deal.title,
    quest_id: sourceQuest?.id ?? null,
    source_quest: sourceQuest?.title ?? null,
    name,
    email,
    answers,
    status: "new",
  });
  if (error) return NextResponse.json({ error: "Could not submit — please try again." }, { status: 500 });

  // Best-effort admin alert (never blocks the visitor's submission).
  await sendLeadAlert({
    kind: "lead",
    name,
    email,
    rows: [
      ["Deal", deal.title],
      ...(sourceQuest ? ([["Quest", sourceQuest.title]] as [string, string][]) : []),
      ...answers,
    ],
  });

  return NextResponse.json({ ok: true });
}
