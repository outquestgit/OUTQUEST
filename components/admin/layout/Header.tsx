"use client";

/**
 * Admin top header. Faithful to `<header id="header">` in the reference; the
 * title/breadcrumb text is updated at runtime by `admin.js` (`nav()`), so the
 * ids stay intact and the markup is the original default ("Dashboard").
 */
export function Header() {
  return (
    <header id="header">
      <div>
        <div className="header-title" id="header-title">
          Dashboard
        </div>
        <span className="header-breadcrumb" id="header-breadcrumb">
          OutQuest Admin
        </span>
      </div>
      <div className="header-actions" id="header-actions">
        <button className="btn-icon">🔔</button>
        <button className="btn-icon">🔍</button>
      </div>
    </header>
  );
}
