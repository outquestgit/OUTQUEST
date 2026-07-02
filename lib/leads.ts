import { createSupabaseServerClient } from "./supabase/server";

/** Lead statuses surfaced in the admin (the enum also has 'qualified'). */
export type LeadStatus = "new" | "contacted" | "qualified" | "closed";

/** Which public form produced the lead — drives the admin dashboard tabs. */
export type LeadType = "deal" | "contact" | "partner";

/** A captured lead — from a deal lead-form, the Contact Us, or Partner With Us form. */
export interface LeadRow {
  id: string;
  lead_type: LeadType;
  name: string;
  email: string | null;
  subject: string | null;
  company: string | null;
  source_deal: string | null;
  source_quest: string | null;
  deal_id: string | null;
  quest_id: string | null;
  answers: [string, string][];
  status: LeadStatus;
  created_at: string;
}

type RawLead = Omit<LeadRow, "answers"> & { answers: unknown };

function normalize(row: RawLead): LeadRow {
  const answers = Array.isArray(row.answers)
    ? (row.answers
        .map((a) => (Array.isArray(a) ? [String(a[0] ?? ""), String(a[1] ?? "")] : null))
        .filter(Boolean) as [string, string][])
    : [];
  return { ...row, lead_type: (row.lead_type ?? "deal") as LeadType, answers };
}

const SELECT =
  "id, lead_type, name, email, subject, company, source_deal, source_quest, deal_id, quest_id, answers, status, created_at";

/** Admin read (uncached, RLS-as-admin) — newest first. */
export async function adminListLeads(): Promise<LeadRow[]> {
  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("leads")
    .select(SELECT)
    .order("created_at", { ascending: false });
  return ((data ?? []) as RawLead[]).map(normalize);
}
