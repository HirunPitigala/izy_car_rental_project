import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { manager, users, emailVerificationTokens } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { generateToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { email, password, confirmPassword } = body;

        // 1️⃣ Basic validation
        if (!email || !password || !confirmPassword) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { error: "Passwords do not match" },
                { status: 400 }
            );
        }

        // 2️⃣ Check if email already exists in users table (central auth)
        const existingInUsers = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

        if (existingInUsers.length > 0) {
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 409 }
            );
        }

        // 3️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4️⃣ Insert into manager table
        const [result] = await db.insert(manager).values({
            name: "New Manager", // Default name
            email: email,
            phone: "", // Default phone
            password: hashedPassword,
        });

        const managerId = (result as any).insertId;

        // 5️⃣ Insert into central users table for authentication
        const [userResult] = await db.insert(users).values({
            email: email,
            passwordHash: hashedPassword,
            role: "manager",
            relatedId: managerId,
            name: "New Manager",
            phone: "",
            status: "active",
            emailVerified: false,
        });

        const userId = (userResult as any).insertId;

        // 6️⃣ Generate and send verification token
        const token = generateToken();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await db.insert(emailVerificationTokens).values({
            userId: userId,
            token: token,
            expiresAt: expiresAt,
        });

        await sendVerificationEmail(email, token);

        // 7️⃣ Success response
        return NextResponse.json(
            { success: true, message: "Manager registered successfully. Please check your email to verify your account." },
            { status: 201 }
        );
    } catch (error) {
        console.error("Manager registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
