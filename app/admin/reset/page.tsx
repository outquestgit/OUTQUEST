"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { updatePassword, type ResetState } from "../login/actions";

const initialState: ResetState = { error: null };

/**
 * Set a new password after following the reset email link. The recovery session
 * is established by `/admin/auth/callback` before this page renders.
 */
export default function AdminResetPage() {
  const [state, action, pending] = useActionState(updatePassword, initialState);
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <div className="auth-logo-mark">SQ</div>
          <div className="auth-title">New Password</div>
          <div className="auth-sub">Choose a strong new password (min 8 characters)</div>
        </div>

        <form className="auth-body" action={action}>
          <div className="auth-field">
            <div className="auth-label">New Password</div>
            <div className="auth-input-wrap">
              <input
                className="auth-input"
                type={showPw ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                placeholder="••••••••"
                style={{ paddingRight: "40px" }}
                minLength={8}
                required
              />
              <button
                type="button"
                className="pw-toggle"
                aria-label={showPw ? "Hide password" : "Show password"}
                onClick={() => setShowPw((v) => !v)}
              >
                {showPw ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <div className="auth-field">
            <div className="auth-label">Confirm New Password</div>
            <div className="auth-input-wrap">
              <input
                className="auth-input"
                type={showPw ? "text" : "password"}
                name="confirm"
                autoComplete="new-password"
                placeholder="••••••••"
                style={{ paddingRight: "40px" }}
                minLength={8}
                required
              />
            </div>
          </div>

          {state.error && (
            <div role="alert" style={{ color: "#c0341d", fontSize: "13px", textAlign: "center" }}>
              {state.error}
            </div>
          )}

          <button
            className="btn btn-primary"
            type="submit"
            disabled={pending}
            style={{ width: "100%", justifyContent: "center", padding: "11px" }}
          >
            {pending ? "Updating…" : "Update Password"}
          </button>
          <div className="auth-footer-text">
            <Link className="auth-link" href="/admin/login">
              ← Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
