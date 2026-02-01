import { NextResponse } from "next/server";
import { authService } from "@/src/modules/auth/auth.service";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token, password } = body;

        if (!token || !password) {
            return NextResponse.json(
                { error: "Token and password are required" },
                { status: 400 }
            );
        }

        const result = await authService.resetPassword(token, password);
        return NextResponse.json(result);

    } catch (error: any) {
        if (error.message === "Password must be at least 8 characters long" ||
            error.message.includes("reset token")) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        console.error("Reset password error:", error);
        return NextResponse.json(
            { error: "Failed to reset password. Please try again later." },
            { status: 500 }
        );
    }
}
