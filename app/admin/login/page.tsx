"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { signIn, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

/**
 * Admin sign-in, using the reference admin's "Auth Pages" design (the `.auth-card`
 * from admin-body.html, styled by app/admin/admin.css), wired to the Supabase
 * `signIn` Server Action. The password show/hide toggle is React state instead of
 * the reference's global `togglePw`.
 */
export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(signIn, initialState);
  const [showPw, setShowPw] = useState(false);
  // Set when the admin arrives from a confirmed email-change link (the auth
  // callback redirects here with `?flash=email-changed`). Read on the client to
  // avoid an SSR hydration mismatch on the URL-only param.
  const [emailChanged, setEmailChanged] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("flash") !== "email-changed") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEmailChanged(true);
  }, []);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <div className="auth-logo-mark">OQ</div>
          <div className="auth-title">Admin Sign In</div>
          <div className="auth-sub">Welcome back to OutQuest</div>
        </div>
        <form className="auth-body" action={action}>
          {emailChanged && (
            <>
              <input type="hidden" name="postFlash" value="email-changed" />
              <div
                role="status"
                style={{
                  background: "#e7f4ec",
                  color: "#1a6b39",
                  border: "1px solid #b6ddc4",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  fontSize: "13px",
                  textAlign: "center",
                }}
              >
                ✓ Email updated. Please sign in with your new email address.
              </div>
            </>
          )}
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
          <div className="auth-field">
            <div className="auth-label">Password</div>
            <div className="auth-input-wrap">
              <input
                className="auth-input"
                type={showPw ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                style={{ paddingRight: "40px" }}
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

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Link className="auth-link" href="/admin/forgot">
              Forgot password?
            </Link>
          </div>

          {state.error && (
            <div
              role="alert"
              style={{ color: "#c0341d", fontSize: "13px", textAlign: "center" }}
            >
              {state.error}
            </div>
          )}

          <button
            className="btn btn-primary"
            type="submit"
            disabled={pending}
            style={{ width: "100%", justifyContent: "center", padding: "11px" }}
          >
            {pending ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
