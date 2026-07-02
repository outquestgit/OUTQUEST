"use client";

import { useState } from "react";

/**
 * Settings → Security: change the signed-in admin's password. Re-auths the
 * current password server-side (`/api/admin/password`) before updating.
 */
export function ChangePassword() {
  const [current, setCurrent] = useState("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async () => {
    setMsg(null);
    if (!current) return setMsg({ ok: false, text: "Enter your current password." });
    if (pw1.length < 8) return setMsg({ ok: false, text: "New password must be at least 8 characters." });
    if (pw1 !== pw2) return setMsg({ ok: false, text: "New passwords don't match." });
    setBusy(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: pw1 }),
      });
      const out = await res.json().catch(() => ({}));
      if (res.ok) {
        setMsg({ ok: true, text: "Password updated." });
        setCurrent("");
        setPw1("");
        setPw2("");
      } else {
        setMsg({ ok: false, text: out.error || "Could not update password." });
      }
    } catch {
      setMsg({ ok: false, text: "Network error — please try again." });
    }
    setBusy(false);
  };

  const pwInput = (value: string, onChange: (v: string) => void, placeholder: string, ac: string) => (
    <div className="pw-wrap">
      <input
        type={show ? "text" : "password"}
        value={value}
        autoComplete={ac}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      <button className="pw-eye" type="button" title="Show/hide" onClick={() => setShow((s) => !s)}>
        {show ? "🙈" : "👁"}
      </button>
    </div>
  );

  return (
    <>
      <div className="field">
        <label>Current Password</label>
        {pwInput(current, setCurrent, "••••••••", "current-password")}
      </div>
      <div className="field">
        <label>New Admin Password</label>
        {pwInput(pw1, setPw1, "At least 8 characters", "new-password")}
      </div>
      <div className="field">
        <label>Confirm Password</label>
        {pwInput(pw2, setPw2, "••••••••", "new-password")}
      </div>
      <div className="field" style={{ gridColumn: "span 2", display: "flex", alignItems: "center", gap: "12px" }}>
        <button className="btn btn-primary btn-sm" type="button" onClick={submit} disabled={busy}>
          {busy ? "Updating…" : "Change Password"}
        </button>
        {msg && (
          <span style={{ fontSize: "13px", color: msg.ok ? "#1a6b39" : "#c0341d" }}>{msg.text}</span>
        )}
      </div>
    </>
  );
}
