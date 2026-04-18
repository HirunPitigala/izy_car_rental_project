/**
 * SECURITY: Shared in-memory rate limiter for authentication endpoints.
 *
 * OWASP A07 — Identification & Authentication Failures
 * Prevents brute-force attacks by limiting the number of failed attempts
 * an IP address can make within a sliding time window.
 *
 * ⚠️  Production Note: This in-memory store is per-process. In a
 * horizontally scaled or serverless environment (e.g., Vercel, AWS Lambda),
 * replace this with a distributed cache such as Upstash Redis using
 * the @upstash/ratelimit package.
 */

const WINDOW_MS = 15 * 60 * 1000; // 15-minute sliding window
const MAX_ATTEMPTS = 10;           // Max login attempts per window per IP

interface AttemptRecord {
    count: number;
    windowStart: number;
}

const store = new Map<string, AttemptRecord>();

/**
 * Checks whether the given IP is rate-limited and increments the counter.
 * Returns true if the request should be blocked.
 */
export function isLoginRateLimited(ip: string): boolean {
    const now = Date.now();
    const record = store.get(ip);

    if (!record || now - record.windowStart > WINDOW_MS) {
        // Fresh window
        store.set(ip, { count: 1, windowStart: now });
        return false;
    }

    if (record.count >= MAX_ATTEMPTS) {
        return true;
    }

    record.count += 1;
    return false;
}

/**
 * Returns the number of seconds until the current window expires.
 * Useful for adding a Retry-After header.
 */
export function getRetryAfterSeconds(ip: string): number {
    const record = store.get(ip);
    if (!record) return 0;
    const elapsed = Date.now() - record.windowStart;
    return Math.ceil((WINDOW_MS - elapsed) / 1000);
}
