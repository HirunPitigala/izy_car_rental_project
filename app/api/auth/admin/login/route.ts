import { NextResponse } from "next/server";
import { encrypt } from "@/lib/auth";
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

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (email !== adminEmail || password !== adminPassword) {
            console.log(`Admin login failure: invalid credentials for ${email}`);
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // --- JWT Session Creation ---
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day session for security
        const sessionToken = await encrypt({ userId: 0, role: "admin", expiresAt });

        const cookieStore = await cookies();
        cookieStore.set("session", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: expiresAt,
        });

        return NextResponse.json({ success: true, role: "admin" });

    } catch (error) {
        console.error("Admin login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
