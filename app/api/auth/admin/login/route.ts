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
            const secure = process.env.NODE_ENV === "production";
            const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
            console.log(`Setting session cookie. Role: ${result.role}, Max-Age: ${maxAge}, Secure: ${secure}`);

            cookieStore.set("session", result.token, {
                httpOnly: true,
                secure: secure,
                sameSite: "lax",
                path: "/",
                maxAge: maxAge,
            });
            console.log("Cookie set command executed.");
        }

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
