"use client";

import { useEffect, useState } from "react";

/**
 * Settings → Security: change the signed-in admin's login email. Re-auths the
 * current password server-side (`/api/admin/email`); Supabase then emails a
 * confirmation link to the new address, and the change applies once it's clicked.
 */
export function ChangeEmail() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/email")
      .then((r) => r.json())
      .then((d) => setCurrent(d.email ?? ""))
      .catch(() => {});
  }, []);

  const submit = async () => {
    setMsg(null);
    const email = next.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setMsg({ ok: false, text: "Enter a valid new email address." });
    if (!pw) return setMsg({ ok: false, text: "Enter your current password to confirm." });
    setBusy(true);
    try {
      const res = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail: email, currentPassword: pw }),
      });
      const out = await res.json().catch(() => ({}));
      if (res.ok) {
        setMsg({
          ok: true,
          text: `Confirmation link sent to ${email}. Open that inbox and click the link — you'll then be asked to sign in again with your new email.`,
        });
        setNext("");
        setPw("");
      } else {
        setMsg({ ok: false, text: out.error || "Could not change email." });
      }
    } catch {
      setMsg({ ok: false, text: "Network error — please try again." });
    }
    setBusy(false);
  };

  return (
    <>
      <div className="field">
        <label>Current Login Email</label>
        <input type="email" value={current} readOnly disabled placeholder="…" />
      </div>
      <div className="field">
        <label>New Login Email</label>
        <input
          type="email"
          value={next}
          autoComplete="email"
          placeholder="you@newdomain.com"
          onChange={(e) => setNext(e.target.value)}
        />
      </div>
      <div className="field">
        <label>Current Password</label>
        <input
          type="password"
          value={pw}
          autoComplete="current-password"
          placeholder="••••••••"
          onChange={(e) => setPw(e.target.value)}
        />
      </div>
      <div className="field" style={{ gridColumn: "span 2", display: "flex", alignItems: "center", gap: "12px" }}>
        <button className="btn btn-primary btn-sm" type="button" onClick={submit} disabled={busy}>
          {busy ? "Sending…" : "Change Email"}
        </button>
        {msg && (
          <span style={{ fontSize: "13px", color: msg.ok ? "#1a6b39" : "#c0341d" }}>{msg.text}</span>
        )}
      </div>
    </>
  );
}
