"use client";

import { nav, togglePw } from "@/lib/admin/runtime";

/** Admin SPA auth previews (`#page-auth-*`) — design pages toggled by the
 *  sidebar's "Auth Pages"; the real login is the standalone `/admin/login`. */

export function AuthLoginPage() {
  return (
    <div className="page" id="page-auth-login" suppressHydrationWarning>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-logo-mark">SQ</div>
            <div className="auth-title">Admin Sign In</div>
            <div className="auth-sub">Welcome back to OutQuest</div>
          </div>
          <div className="auth-body">
            <div className="auth-field">
              <div className="auth-label">Email Address</div>
              <input className="auth-input" type="email" placeholder="admin@outquest.com" />
            </div>
            <div className="auth-field">
              <div className="auth-label">Password</div>
              <div className="auth-input-wrap">
                <input
                  className="auth-input"
                  id="pw-input"
                  type="password"
                  placeholder="••••••••"
                  style={{ paddingRight: "40px" }}
                />
                <button
                  className="pw-toggle"
                  onClick={() => togglePw("pw-input", "pw-icon")}
                  id="pw-icon"
                >
                  👁
                </button>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span className="auth-link" onClick={() => nav("auth-forgot")}>
                Forgot password?
              </span>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "11px" }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthForgotPage() {
  return (
    <div className="page" id="page-auth-forgot" suppressHydrationWarning>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-logo-mark">SQ</div>
            <div className="auth-title">Reset Password</div>
            <div className="auth-sub">Enter your email to receive a reset link</div>
          </div>
          <div className="auth-body">
            <div className="auth-field">
              <div className="auth-label">Email Address</div>
              <input className="auth-input" type="email" placeholder="admin@outquest.com" />
            </div>
            <button
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "11px" }}
            >
              Send Reset Link
            </button>
            <div className="auth-footer-text">
              <span className="auth-link" onClick={() => nav("auth-login")}>
                ← Back to Sign In
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthResetPage() {
  return (
    <div className="page" id="page-auth-reset" suppressHydrationWarning>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-logo-mark">SQ</div>
            <div className="auth-title">New Password</div>
            <div className="auth-sub">Choose a strong new password</div>
          </div>
          <div className="auth-body">
            <div className="auth-field">
              <div className="auth-label">New Password</div>
              <div className="auth-input-wrap">
                <input
                  className="auth-input"
                  id="np-input"
                  type="password"
                  placeholder="••••••••"
                  style={{ paddingRight: "40px" }}
                />
                <button
                  className="pw-toggle"
                  onClick={() => togglePw("np-input", "np-icon")}
                  id="np-icon"
                >
                  👁
                </button>
              </div>
            </div>
            <div className="auth-field">
              <div className="auth-label">Confirm New Password</div>
              <div className="auth-input-wrap">
                <input
                  className="auth-input"
                  id="cp-input"
                  type="password"
                  placeholder="••••••••"
                  style={{ paddingRight: "40px" }}
                />
                <button
                  className="pw-toggle"
                  onClick={() => togglePw("cp-input", "cp-icon")}
                  id="cp-icon"
                >
                  👁
                </button>
              </div>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "11px" }}
            >
              Update Password
            </button>
            <div className="auth-footer-text">
              <span className="auth-link" onClick={() => nav("auth-login")}>
                ← Back to Sign In
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
