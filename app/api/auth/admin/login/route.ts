import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { admin, session } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
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

        // Find admin by email
        const [adminUser] = await db.select().from(admin).where(eq(admin.email, email)).limit(1);

        if (!adminUser) {
            console.log(`Admin login failure: user ${email} not found`);
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        if (!adminUser.password) {
            console.log(`Admin login failure: user ${email} has no password set`);
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Validate password
        const passwordMatch = await bcrypt.compare(password, adminUser.password);

        if (!passwordMatch) {
            console.log(`Admin login failure: password mismatch for ${email}`);
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Create secure session
        const sessionId = uuidv4();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 1); // 1 day session for security

        await db.insert(session).values({
            id: sessionId,
            userId: adminUser.adminId,
            role: "admin",
            expiresAt: expiresAt,
        });

        const cookieStore = await cookies();
        cookieStore.set("session_id", sessionId, {
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
