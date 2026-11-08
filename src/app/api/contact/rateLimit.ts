/**
 * Small in-memory sliding-window rate limiter.
 *
 * Note: state lives in the memory of one server instance. On serverless hosting each instance keeps its own
 * counters, so this blunts bursts and casual abuse but is not a hard global limit. For that, back it with a
 * shared store (e.g. Redis / Upstash) and keep the same `checkRateLimit` call.
 */

type Rule = { limit: number; windowMs: number };

const hits = new Map<string, number[]>();
const CLEANUP_THRESHOLD = 5000;

export function checkRateLimit(key: string, rule: Rule, now = Date.now()): { allowed: boolean; retryAfterSec: number } {
  const windowStart = now - rule.windowMs;
  const recent = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (recent.length >= rule.limit) {
    hits.set(key, recent);
    return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((recent[0] + rule.windowMs - now) / 1000)) };
  }

  recent.push(now);
  hits.set(key, recent);

  // Keep memory bounded: drop keys whose hits have all expired.
  if (hits.size > CLEANUP_THRESHOLD) {
    for (const [k, times] of hits) {
      if (times[times.length - 1] <= windowStart) hits.delete(k);
    }
  }
  return { allowed: true, retryAfterSec: 0 };
}

/** Best-effort client address from proxy headers (set by the hosting platform). */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}
