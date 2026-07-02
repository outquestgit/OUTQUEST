import "server-only";
import { createSupabaseAdminClient } from "./supabase/admin";
import {
  DEFAULT_ADMIN_CONFIG,
  type AdminConfig,
  type AdminEmailConfig,
} from "./site/data/adminConfig";

export type { AdminConfig, AdminEmailConfig };
export { DEFAULT_ADMIN_CONFIG };

const str = (v: unknown, def = ""): string => (typeof v === "string" ? v : def);

/**
 * Read the single-row private admin config. Uses the service-role client so it
 * works both in the admin page (server) and in the public form API routes
 * (anon) that need the alert recipients — the `admin_config` table is otherwise
 * unreadable by anon (admin-only RLS). Falls back to defaults on any error (e.g.
 * the migration hasn't run yet), so callers never throw.
 */
export async function getAdminConfig(): Promise<AdminConfig> {
  try {
    const sb = createSupabaseAdminClient();
    const { data, error } = await sb
      .from("admin_config")
      .select("email")
      .eq("id", 1)
      .maybeSingle();
    if (error || !data) return DEFAULT_ADMIN_CONFIG;
    const e = (data.email ?? {}) as Partial<AdminEmailConfig>;
    const D = DEFAULT_ADMIN_CONFIG;
    return {
      email: {
        recipients: str(e.recipients, D.email.recipients),
        sender: str(e.sender, D.email.sender),
        smtpHost: str(e.smtpHost, D.email.smtpHost),
        smtpPort: str(e.smtpPort, D.email.smtpPort),
        smtpUser: str(e.smtpUser, D.email.smtpUser),
        smtpPass: str(e.smtpPass, D.email.smtpPass),
      },
    };
  } catch {
    return DEFAULT_ADMIN_CONFIG;
  }
}
