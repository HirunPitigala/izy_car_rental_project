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

        // Fetch user's real name from related tables
        let name = "User";
        try {
            if (role === "admin" && relatedId) {
                const { admin } = await import("@/src/db/schema");
                const [u] = await db.select({ name: admin.name }).from(admin).where(eq(admin.adminId, relatedId));
                if (u?.name) name = u.name;
            } else if (role === "manager" && relatedId) {
                const { manager } = await import("@/src/db/schema");
                const [u] = await db.select({ name: manager.name }).from(manager).where(eq(manager.managerId, relatedId));
                if (u?.name) name = u.name;
            } else if (role === "employee" && relatedId) {
                const { employee } = await import("@/src/db/schema");
                const [u] = await db.select({ name: employee.name }).from(employee).where(eq(employee.employeeId, relatedId));
                if (u?.name) name = u.name;
            } else if (role === "customer" && relatedId) {
                const { customer } = await import("@/src/db/schema");
                const [u] = await db.select({ name: customer.fullName }).from(customer).where(eq(customer.customerId, relatedId));
                if (u?.name) name = u.name;
            }
        } catch (e) {
            console.error("Error fetching name for login:", e);
        }

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
