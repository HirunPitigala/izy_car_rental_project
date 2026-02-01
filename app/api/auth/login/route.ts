import { NextResponse } from "next/server";
import { authService } from "@/src/modules/auth/auth.service";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

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
            cookieStore.set("session", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                expires: result.expiresAt,
            });
        }

        return NextResponse.json({
            success: true,
            token: result.token, // Optional: return token in body if needed for mobile/other clients
            role: result.role,
            user: result.user
        });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
