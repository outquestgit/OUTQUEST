"use client";

import type { ButtonHTMLAttributes } from "react";

/**
 * Shared front-site button. Each variant maps to the exact CSS class the
 * reference already uses, so the rendered markup is byte-for-byte identical to
 * the inline `<button>`s it replaces — extracting it just means a button's
 * class/markup now lives in one place. All native button props (`style`,
 * `onClick`, `disabled`, `aria-*`, …) pass straight through.
 */
type Variant = "orange" | "primary" | "secondary";

const VARIANT_CLASS: Record<Variant, string> = {
  orange: "btn-orange",
  primary: "gsq-btn-primary",
  secondary: "gsq-btn-secondary",
};

export function Button({
  variant = "orange",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const cls = [VARIANT_CLASS[variant], className].filter(Boolean).join(" ");
  return <button className={cls} {...props} />;
}
