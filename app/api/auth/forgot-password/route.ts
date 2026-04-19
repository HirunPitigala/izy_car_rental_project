import { NextResponse } from "next/server";
import { authService } from "@/src/modules/auth/auth.service";

// ─── In-memory rate limiting store ───────────────────────────────────────────
// SECURITY FIX (A07): Prevents brute-force attacks on the password reset
// endpoint. We track the number of reset attempts per IP address and block
// further requests after the threshold is exceeded for a cooldown window.
//
// Note: For multi-instance/serverless production deployments, replace this
// with a distributed store like Upstash Redis (@upstash/ratelimit).
// ─────────────────────────────────────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_ATTEMPTS = 5;
const attemptStore = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const record = attemptStore.get(ip);

    if (!record || now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
        // First attempt or window has expired — start a fresh window
        attemptStore.set(ip, { count: 1, windowStart: now });
        return false;
    }

    if (record.count >= RATE_LIMIT_MAX_ATTEMPTS) {
        return true; // Too many attempts within the current window
    }

    // Increment attempt count within the current window
    record.count += 1;
    return false;
}

export async function POST(request: Request) {
    try {
        // Extract IP for rate limiting (uses X-Forwarded-For behind a proxy/load balancer)
        const ip =
            request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
            request.headers.get("x-real-ip") ??
            "unknown";

        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: "Too many password reset attempts. Please try again in 15 minutes." },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // SECURITY FIX (A07): Prevent user enumeration.
        // We call the service regardless of whether the email exists, but ALWAYS
        // return the same generic success response. An attacker cannot determine
        // from this response whether an account exists for the given email.
        await authService.forgotPassword(email).catch(() => {
            // Silently swallow service errors — we never expose them to the caller
        });

        return NextResponse.json({
            success: true,
            message: "If that email address is in our system, you will receive a password reset link shortly."
        });

    } catch (error) {
        console.error("Forgot password error:", error);
        // Return the same generic response even on unexpected errors
        return NextResponse.json({
            success: true,
            message: "If that email address is in our system, you will receive a password reset link shortly."
        });
    }
}
