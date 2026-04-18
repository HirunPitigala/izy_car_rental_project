import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// ─────────────────────────────────────────────────────────────
// ROUTE PROTECTION RULES
// Define which path prefixes require which role(s).
// The middleware checks these in order — first match wins.
// ─────────────────────────────────────────────────────────────
const protectedRoutes: { prefix: string; roles: string[] }[] = [
    // Admin-only pages
    { prefix: "/admin", roles: ["admin"] },

    // Manager-only pages
    { prefix: "/manager", roles: ["manager"] },

    // Employee-only pages
    { prefix: "/employee", roles: ["employee"] },

    // Customer-only pages
    { prefix: "/customer", roles: ["customer"] },

    // API routes — role-scoped
    { prefix: "/api/admin", roles: ["admin"] },
    { prefix: "/api/employee", roles: ["employee", "admin"] },
    { prefix: "/api/customer", roles: ["customer", "admin"] },

    // Shared authenticated API routes (any valid session)
    { prefix: "/api/notifications", roles: ["admin", "manager", "customer", "employee"] },
    { prefix: "/api/bookings", roles: ["admin", "customer"] },
    { prefix: "/api/cloudinary", roles: ["admin", "customer", "employee"] },
    { prefix: "/api/upload", roles: ["admin", "customer", "employee"] },
    { prefix: "/api/inspection", roles: ["admin", "employee"] },
];

// Routes that should only be accessible if the user is NOT logged in
// (e.g., redirect logged-in users away from login/register pages)
const authOnlyRoutes = ["/login", "/register"];

// Completely public routes — no session check needed
const publicPrefixes = [
    "/api/auth",        // login, logout, forgot-password, verify-email
    "/api/register",    // public customer registration
    "/api/vehicles",    // public vehicle browsing
    "/api/wedding",     // public wedding browsing
    "/api/airport-rental/search", // public search
    "/api/pickup/search",         // public search
    "/_next",           // Next.js assets
    "/favicon.ico",
    "/logo.png",
    // ⚠️  WARNING: These are development/debug routes that MUST be removed
    // before deploying to production. They expose internal implementation details.
    // See OWASP: A05 Security Misconfiguration.
    // "/api/test-bcrypt",
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function getSecretKey(): Uint8Array {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not configured");
    return new TextEncoder().encode(secret);
}

/**
 * Verifies the JWT and returns the role, or null if invalid/missing.
 * Runs in the Edge Runtime (no Node.js-only APIs allowed here).
 */
async function getSessionRole(request: NextRequest): Promise<string | null> {
    try {
        const token = request.cookies.get("session")?.value;
        if (!token) return null;

        const { payload } = await jwtVerify(token, getSecretKey(), {
            algorithms: ["HS256"],
        });

        return typeof payload.role === "string" ? payload.role.toLowerCase() : null;
    } catch {
        // Token is expired, tampered, or invalid — treat as unauthenticated
        return null;
    }
}

/**
 * The canonical home dashboard for each role.
 */
function getDashboardForRole(role: string): string {
    switch (role) {
        case "admin":    return "/admin/dashboard";
        case "manager":  return "/manager/dashboard";
        case "employee": return "/employee/assigned";
        case "customer": return "/customer/dashboard";
        default:         return "/";
    }
}

// ─────────────────────────────────────────────────────────────
// PROXY (formerly middleware — renamed in Next.js 16)
// ─────────────────────────────────────────────────────────────

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Always allow fully public routes through immediately
    if (publicPrefixes.some((prefix) => pathname.startsWith(prefix))) {
        return NextResponse.next();
    }

    // 2. Verify the session JWT
    const role = await getSessionRole(request);

    // 3. If the user is visiting an auth-only route (login/register) while
    //    already logged in, redirect them to their dashboard.
    //    EXCEPTION: Admins are allowed to access /register routes to create 
    //    accounts on behalf of others.
    if (authOnlyRoutes.some((r) => pathname.startsWith(r))) {
        if (role) {
            // Allow admins to access /register but not /login
            if (role === "admin" && pathname.startsWith("/register")) {
                return NextResponse.next();
            }
            return NextResponse.redirect(
                new URL(getDashboardForRole(role), request.url)
            );
        }
        return NextResponse.next();
    }

    // 4. Check protected route rules
    const matchedRule = protectedRoutes.find((rule) =>
        pathname.startsWith(rule.prefix)
    );

    if (matchedRule) {
        // Not authenticated at all
        if (!role) {
            // API routes should get a JSON 401, not a redirect
            if (pathname.startsWith("/api/")) {
                return NextResponse.json(
                    { error: "Unauthorized. Please log in." },
                    { status: 401 }
                );
            }
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("from", pathname); // preserve intended destination
            return NextResponse.redirect(loginUrl);
        }

        // Authenticated but wrong role
        if (!matchedRule.roles.includes(role)) {
            if (pathname.startsWith("/api/")) {
                return NextResponse.json(
                    { error: "Forbidden. You do not have permission to access this resource." },
                    { status: 403 }
                );
            }
            // Redirect to their own dashboard
            return NextResponse.redirect(
                new URL(getDashboardForRole(role), request.url)
            );
        }
    }

    // 5. All checks passed — allow through
    return NextResponse.next();
}

// ─────────────────────────────────────────────────────────────
// MATCHER
// Tell Next.js which routes to run this middleware on.
// Excludes static files and the Next.js internals automatically.
// ─────────────────────────────────────────────────────────────
export const config = {
    matcher: [
        /*
         * Match all request paths EXCEPT:
         * - _next/static (static files)
         * - _next/image  (image optimization)
         * - Static assets at the root (e.g. /logo.png, /favicon.ico)
         */
        "/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|otf|css|js)$).*)",
    ],
};
