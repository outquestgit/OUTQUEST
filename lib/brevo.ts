/**
 * Minimal Brevo (Sendinblue) REST helper. Uses the server-only env vars
 * `BREVO_API_KEY` + `BREVO_LIST_ID`. Never import from a client component — the
 * API key must stay on the server.
 */
const BREVO_API = "https://api.brevo.com/v3";

type Result = { ok: true } | { ok: false; error: string; status: number };

/**
 * Add (or update) a contact and subscribe them to the configured list. Brevo
 * returns 201 for a new contact and 204 when an existing one is updated; an
 * already-existing contact is therefore a success, not an error.
 */
export async function brevoSubscribe(email: string): Promise<Result> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return { ok: false, error: "Newsletter is not configured.", status: 503 };

  const listId = Number(process.env.BREVO_LIST_ID || 0);
  const payload: Record<string, unknown> = { email, updateEnabled: true };
  if (listId > 0) payload.listIds = [listId];

  let res: Response;
  try {
    res = await fetch(`${BREVO_API}/contacts`, {
      method: "POST",
      headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, error: "Could not reach the newsletter service.", status: 502 };
  }

  if (res.ok || res.status === 204) return { ok: true };

  const data = (await res.json().catch(() => ({}))) as { code?: string; message?: string };
  // A duplicate contact is fine — they're already subscribed.
  if (data.code === "duplicate_parameter") return { ok: true };
  return { ok: false, error: data.message || "Could not subscribe — please try again.", status: 502 };
}

/**
 * Send a transactional email via Brevo's `/smtp/email` endpoint. Used for admin
 * lead-alert notifications. `sender` must be a Brevo-verified sender address.
 * Returns a Result; callers treat alerts as best-effort (never block the form).
 */
export async function brevoSendTransactional(opts: {
  to: string[];
  subject: string;
  html: string;
  sender: string;
  senderName?: string;
  replyTo?: string;
}): Promise<Result> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return { ok: false, error: "Email is not configured.", status: 503 };
  if (!opts.sender) return { ok: false, error: "No sender address configured.", status: 400 };
  if (!opts.to.length) return { ok: false, error: "No recipients configured.", status: 400 };

  const payload: Record<string, unknown> = {
    sender: { email: opts.sender, name: opts.senderName || "OutQuest" },
    to: opts.to.map((email) => ({ email })),
    subject: opts.subject,
    htmlContent: opts.html,
  };
  if (opts.replyTo) payload.replyTo = { email: opts.replyTo };

  let res: Response;
  try {
    res = await fetch(`${BREVO_API}/smtp/email`, {
      method: "POST",
      headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, error: "Could not reach the email service.", status: 502 };
  }

  if (res.ok) return { ok: true };
  const data = (await res.json().catch(() => ({}))) as { message?: string };
  return { ok: false, error: data.message || "Could not send the email.", status: 502 };
}
