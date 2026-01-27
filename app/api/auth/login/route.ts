import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
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

        // --- Admin Env-Based Auth Bypass ---
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (email === adminEmail && password === adminPassword) {
            const role = "admin";
            const userId = 0; // Placeholder for env-based admin
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
            const sessionToken = await encrypt({ userId, role, expiresAt });

            const cookieStore = await cookies();
            cookieStore.set("session", sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                expires: expiresAt,
            });

            return NextResponse.json({
                success: true,
                token: sessionToken,
                role,
                user: {
                    id: userId,
                    role,
                    email: adminEmail,
                    name: "System Admin"
                }
            });
        }

        // Authenticate ONLY against the public.users table
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (!user || !user.passwordHash) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        if (user.status !== "active") {
            return NextResponse.json({ error: "Account is disabled" }, { status: 403 });
        }

        if (!user.emailVerified) {
            return NextResponse.json({ error: "Please verify your email address before logging in." }, { status: 403 });
        }

        // --- JWT Session Creation ---
        const role = user.role as "admin" | "manager" | "employee" | "customer";
        const userId = user.id;
        const relatedId = user.relatedId || undefined;

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        const sessionToken = await encrypt({ userId, role, relatedId, expiresAt });

        const cookieStore = await cookies();
        cookieStore.set("session", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: expiresAt,
        });

        // Fetch user's real name from consolidated users table
        const name = user.name || "User";

        // Return token and user info in body for mobile apps
        return NextResponse.json({
            success: true,
            token: sessionToken,
            role,
            user: {
                id: userId,
                role,
                email: user.email,
                name
            }
        });


    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
