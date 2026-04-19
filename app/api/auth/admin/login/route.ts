import { NextResponse } from "next/server";
import { authService } from "@/src/modules/auth/auth.service";
import { cookies } from "next/headers";
import { isLoginRateLimited, getRetryAfterSeconds } from "@/lib/rateLimit";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // SECURITY FIX (A07): Rate limit login attempts to prevent brute-force attacks.
        // Admin login is the highest-risk endpoint in the system.
        const ip =
            request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
            request.headers.get("x-real-ip") ??
            "unknown";
        if (isLoginRateLimited(ip)) {
            const retryAfter = getRetryAfterSeconds(ip);
            return NextResponse.json(
                { error: "Too many login attempts. Please try again later." },
                { status: 429, headers: { "Retry-After": String(retryAfter) } }
            );
        }

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const result = await authService.login({ email, password });

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: result.status || 401 });
        }

        if (result.token && result.expiresAt) {
            const cookieStore = await cookies();
            const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds

            cookieStore.set("session", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: maxAge,
            });
        }

        // SECURITY FIX (A02): Do NOT return the raw JWT in the response body.
        // The session is managed exclusively via the httpOnly cookie.
        // Returning the token here would create a secondary XSS exposure vector.
        // SECURITY FIX (A05): Removed console.log statements that exposed
        // session role and cookie metadata in server logs.
        return NextResponse.json({
            success: true,
            role: result.role,
            user: result.user
        });

    } catch (error) {
        console.error("Admin login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
