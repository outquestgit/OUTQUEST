/**
 * In-memory sliding-window rate limiter for public form submissions
 * (10 per IP per hour by default). Keyed per endpoint+IP so each form has its own
 * window. Single-instance store — adequate for a long-running Node server; on
 * multi-instance/serverless deployments swap for a shared store (Redis/DB).
 */
const HOUR = 60 * 60 * 1000;
const buckets = new Map<string, number[]>();
let lastSweep = 0;

/** Drop empty/expired buckets occasionally so the map can't grow unbounded. */
function sweep(now: number, windowMs: number) {
  if (now - lastSweep < windowMs) return;
  lastSweep = now;
  for (const [k, times] of buckets) {
    const live = times.filter((t) => now - t < windowMs);
    if (live.length) buckets.set(k, live);
    else buckets.delete(k);
  }
}

export function rateLimit(
  key: string,
  limit = 10,
  windowMs = HOUR
): { ok: boolean; retryAfter: number; remaining: number } {
  const now = Date.now();
  sweep(now, windowMs);
  const times = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (times.length >= limit) {
    const retryAfter = Math.max(1, Math.ceil((windowMs - (now - times[0])) / 1000));
    buckets.set(key, times);
    return { ok: false, retryAfter, remaining: 0 };
  }
  times.push(now);
  buckets.set(key, times);
  return { ok: true, retryAfter: 0, remaining: limit - times.length };
}
