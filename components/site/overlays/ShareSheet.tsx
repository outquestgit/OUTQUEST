"use client";

import { useEffect, useState } from "react";
import { useOverlay } from "@/components/site/state/OverlayProvider";

/**
 * Bottom-sheet share menu — React-owned (ported from front.js's share* family).
 * Shares the title + URL captured when opened (OverlayProvider `shareData`),
 * defaulting to the current page. "More options" only shows when the Web Share
 * API is available, matching the runtime.
 */
export function ShareSheet() {
  const { shareOpen, shareData, closeShare } = useOverlay();
  const { title, url } = shareData;
  const [copied, setCopied] = useState(false);
  const [hasNative, setHasNative] = useState(false);

  useEffect(() => {
    setHasNative(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hey — check out this OutQuest: "${title}". Thought you might want to do this one 👀\n\n${url}`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
    closeShare();
  };
  const shareSMS = () => {
    const msg = encodeURIComponent(`Check out this OutQuest: "${title}" — ${url}`);
    window.open(`sms:?body=${msg}`, "_blank");
    closeShare();
  };
  const shareEmail = () => {
    const sub = encodeURIComponent(`You need to see this OutQuest — ${title}`);
    const body = encodeURIComponent(
      `Hey,\n\nI found this OutQuest and immediately thought of you:\n\n"${title}"\n\n${url}\n\nLet me know if you want to do it together.`
    );
    window.open(`mailto:?subject=${sub}&body=${body}`);
    closeShare();
  };
  const shareNative = () => {
    if (navigator.share) {
      navigator
        .share({ title, text: `Check out this OutQuest: "${title}"`, url })
        .catch(() => {});
      closeShare();
    }
  };
  const copyLink = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      })
      .catch(() => {
        const el = document.createElement("textarea");
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      });
  };

  const urlDisplay = url.length > 50 ? url.slice(0, 50) + "…" : url;

  const options = [
    { bg: "#E8F9EE", icon: "💬", title: "WhatsApp", desc: "Send directly in a chat", onClick: shareWhatsApp },
    { bg: "#EAF2FF", icon: "📱", title: "Text message", desc: "Send via SMS", onClick: shareSMS },
    { bg: "#FFF4EE", icon: "✉️", title: "Email", desc: "Forward to someone who'll love this", onClick: shareEmail },
  ];

  return (
    <div
      className={shareOpen ? "share-wrap show" : "share-wrap"}
      id="share-wrap"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeShare();
      }}
    >
      <div className="share-sheet" id="share-inner" style={{ position: "relative" }}>
        <span className="share-handle"></span>
        <button className="share-close" onClick={() => closeShare()}>
          ✕
        </button>
        <div className="share-header">
          <h4>Share this quest</h4>
          <p>Know someone who needs a nudge? Send it over.</p>
        </div>
        <div className="share-options">
          {options.map((opt) => (
            <a
              className="share-opt"
              href="#"
              key={opt.title}
              onClick={(e) => {
                e.preventDefault();
                opt.onClick();
              }}
            >
              <div className="share-opt-icon" style={{ background: opt.bg }}>
                {opt.icon}
              </div>
              <div className="share-opt-body">
                <strong>{opt.title}</strong>
                <span>{opt.desc}</span>
              </div>
            </a>
          ))}
          {hasNative && (
            <a
              className="share-opt"
              id="share-native"
              href="#"
              style={{ display: "flex" }}
              onClick={(e) => {
                e.preventDefault();
                shareNative();
              }}
            >
              <div className="share-opt-icon" style={{ background: "#F5F2EB" }}>
                ⬆️
              </div>
              <div className="share-opt-body">
                <strong>More options</strong>
                <span>Use your device&apos;s share sheet</span>
              </div>
            </a>
          )}
        </div>
        <div className="share-copy-row">
          <span className="share-copy-url" id="share-url-display">
            {urlDisplay || "outquest.com/quest/..."}
          </span>
          <button
            className="share-copy-btn"
            id="copy-btn"
            onClick={() => copyLink()}
            style={copied ? { background: "var(--green)" } : undefined}
          >
            {copied ? "Copied ✓" : "Copy link"}
          </button>
        </div>
      </div>
    </div>
  );
}
