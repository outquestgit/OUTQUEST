"use client";

import React from "react";

/**
 * Shared Pages-CMS editor primitives. Every pcms editor used to define its own
 * identical copies of these — they now live here so a field/repeater design
 * change is made once. Markup is unchanged from the originals.
 */

/** Labelled text input / textarea bound to a string + onChange. */
export function Inp({
  label,
  value,
  onChange,
  area,
  rows,
  placeholder,
  flex,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  area?: boolean;
  rows?: number;
  placeholder?: string;
  flex?: number | string;
}) {
  return (
    <div className="field" style={{ margin: 0, flex }}>
      <label>{label}</label>
      {area ? (
        <textarea rows={rows ?? 2} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

/**
 * Labelled image control: shows the current image (if any), an upload button
 * that posts to the admin image endpoint and stores the returned public URL, and
 * a clear button. Reuses the same `quests` storage bucket as the quest editor.
 */
export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [busy, setBusy] = React.useState(false);
  const upload = async (file: File) => {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/quests/upload", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (res.ok && data.url) onChange(data.url);
      else window.alert(data.error || "Image upload failed.");
    } catch {
      window.alert("Image upload failed.");
    }
    setBusy(false);
  };
  return (
    <div className="field" style={{ margin: 0 }}>
      <label>{label}</label>
      <div className="pcms-img-field">
        {value && <span aria-hidden className="pcms-img-thumb" style={{ backgroundImage: `url(${value})` }} />}
        <label className={busy ? "pcms-img-upload busy" : "pcms-img-upload"}>
          <span aria-hidden>{busy ? "⏳" : "📷"}</span>
          {busy ? "Uploading…" : value ? "Replace image" : "Upload image"}
          <input
            type="file"
            accept="image/*"
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f);
              e.target.value = "";
            }}
          />
        </label>
        {value && !busy && (
          <button type="button" className="pcms-img-clear" onClick={() => onChange("")}>
            ✕ Remove
          </button>
        )}
      </div>
    </div>
  );
}

/** Card wrapper around a repeater row. */
export const RowCard = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 12px" }}>{children}</div>
);

/** "＋ Add …" repeater button. */
export const AddBtn = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button className="add-repeater-btn" onClick={onClick} style={{ marginBottom: "14px" }}>
    ＋ {label}
  </button>
);

/** "×" repeater row remove button. */
export const RemoveBtn = ({ onClick }: { onClick: () => void }) => (
  <button className="repeater-remove" onClick={onClick} style={{ marginBottom: "2px" }}>
    ×
  </button>
);

/** Immutably patch list item `i`. */
export const upd = <T,>(list: T[], i: number, patch: Partial<T>): T[] => list.map((x, j) => (j === i ? { ...x, ...patch } : x));
/** Immutably remove list item `i`. */
export const rm = <T,>(list: T[], i: number): T[] => list.filter((_, j) => j !== i);
/** Immutably set string list item `i`. */
export const updStr = (list: string[], i: number, v: string): string[] => list.map((x, j) => (j === i ? v : x));
