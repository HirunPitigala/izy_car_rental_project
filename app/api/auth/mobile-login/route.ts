import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { encrypt } from "@/lib/auth";

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

        const role = user.role as "admin" | "manager" | "employee" | "customer";
        const userId = user.id;
        const relatedId = user.relatedId || undefined;

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const token = await encrypt({ userId, role, relatedId, expiresAt });

        return NextResponse.json({
            token,
            user: {
                id: userId,
                email: user.email,
                role: role,
                name: user.name || "User"
            }
        });

    } catch (error) {
        console.error("Mobile login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
