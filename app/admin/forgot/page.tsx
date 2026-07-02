"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset, type ForgotState } from "../login/actions";

const initialState: ForgotState = { error: null, sent: false };

/** Admin "forgot password" — emails a reset link via Supabase. */
export default function AdminForgotPage() {
  const [state, action, pending] = useActionState(requestPasswordReset, initialState);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <div className="auth-logo-mark">SQ</div>
          <div className="auth-title">Reset Password</div>
          <div className="auth-sub">Enter your email to receive a reset link</div>
        </div>

        {state.sent ? (
          <div className="auth-body">
            <div style={{ textAlign: "center", fontSize: "14px", color: "var(--text)", lineHeight: 1.6 }}>
              If an account exists for that email, a password-reset link is on its way. Check your inbox
              (and spam).
            </div>
            <div className="auth-footer-text">
              <Link className="auth-link" href="/admin/login">
                ← Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form className="auth-body" action={action}>
            <div className="auth-field">
              <div className="auth-label">Email Address</div>
              <input
                className="auth-input"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="admin@outquest.com"
                required
              />
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
              {pending ? "Sending…" : "Send Reset Link"}
            </button>
            <div className="auth-footer-text">
              <Link className="auth-link" href="/admin/login">
                ← Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
