/**
 * Input sanitization for public form submissions. Strips control characters,
 * trims, and caps length. The stored values are always rendered escaped in the
 * admin, but we still neutralise raw input here.
 */

/** Remove C0 control chars + DEL, keeping tab (9), newline (10), CR (13). */
function stripControls(s: string): string {
  let out = "";
  for (const ch of s) {
    const c = ch.codePointAt(0) ?? 0;
    if (c === 9 || c === 10 || c === 13 || (c >= 32 && c !== 127)) out += ch;
  }
  return out;
}

export function cleanText(v: unknown, max = 2000): string {
  return stripControls(String(v ?? "")).trim().slice(0, max);
}

/** Single-line field (name/subject/company): collapses any newlines to spaces. */
export function cleanLine(v: unknown, max = 200): string {
  return cleanText(v, max).replace(/\s*[\r\n]+\s*/g, " ");
}

/** Normalise + length-cap an email (validation happens separately). */
export function cleanEmail(v: unknown): string {
  return cleanLine(v, 254).toLowerCase();
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** A reasonable URL: http(s) only, length-capped; returns "" if not URL-ish. */
export function cleanUrl(v: unknown, max = 500): string {
  const s = cleanLine(v, max);
  if (!s) return "";
  return /^https?:\/\/[^\s.]+\.[^\s]+$/i.test(s) ? s : "";
}
