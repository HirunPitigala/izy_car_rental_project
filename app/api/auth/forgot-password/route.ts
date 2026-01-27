import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, passwordResetTokens } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Check if user exists
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

        // Always return success to prevent user enumeration
        // Even if the email doesn't exist, we return success
        if (!user) {
            console.log(`Password reset requested for non-existent email: ${email}`);
            return NextResponse.json({
                success: true,
                message: "If an account exists with this email, you will receive a password reset link shortly."
            });
        }

        // Generate secure random token
        const token = randomBytes(32).toString("hex");

        // Set expiration to 1 hour from now
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        // Delete any existing reset tokens for this user
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, user.id));

        // Store the reset token
        await db.insert(passwordResetTokens).values({
            userId: user.id,
            token,
            expiresAt,
        });

        // Send password reset email
        await sendPasswordResetEmail(email, token);

        console.log(`Password reset email sent to: ${email}`);

        return NextResponse.json({
            success: true,
            message: "If an account exists with this email, you will receive a password reset link shortly."
        });

    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { error: "Failed to process password reset request. Please try again later." },
            { status: 500 }
        );
    }
}
