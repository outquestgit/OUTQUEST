/** Standard return shape for admin form Server Actions (used with useActionState). */
export type FormState = {
  error: string | null;
  fieldErrors?: Record<string, string>;
};

export const EMPTY_FORM_STATE: FormState = { error: null };

/** URL-safe slug from arbitrary text (lowercase, hyphen-separated). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Trimmed string field; "" when absent. */
export function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

/** Nullable text field — empty string becomes null (for nullable columns). */
export function nullableStr(formData: FormData, key: string): string | null {
  const v = str(formData, key);
  return v === "" ? null : v;
}

/** Integer field with a fallback. */
export function intVal(formData: FormData, key: string, fallback = 0): number {
  const n = Number(str(formData, key));
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

/** Checkbox → boolean (present & "on"/"true"). */
export function boolVal(formData: FormData, key: string): boolean {
  const v = formData.get(key);
  return v === "on" || v === "true" || v === "1";
}
