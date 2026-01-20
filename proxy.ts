import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const sessionId = request.cookies.get("session_id")?.value;
    const { pathname } = request.nextUrl;

    // Protected routes
    const protectedRoutes = ["/admin", "/manager", "/employee", "/customer"];
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    if (isProtectedRoute && !sessionId) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Optional: Prevent logged-in users from accessing login page again?
    // if (pathname === "/login" && sessionId) {
    //   // Redirect to dashboard logic would be complex here without knowing role
    // }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder content (if any)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
