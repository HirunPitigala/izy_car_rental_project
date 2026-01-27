import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, passwordResetTokens } from "@/src/db/schema";
import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcrypt";

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

        // Validate password strength
        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters long" },
                { status: 400 }
            );
        }

        // Find the reset token
        const [resetToken] = await db
            .select()
            .from(passwordResetTokens)
            .where(
                and(
                    eq(passwordResetTokens.token, token),
                    gt(passwordResetTokens.expiresAt, new Date())
                )
            )
            .limit(1);

        if (!resetToken) {
            return NextResponse.json(
                { error: "Invalid or expired reset token. Please request a new password reset link." },
                { status: 400 }
            );
        }

        // Hash the new password
        const passwordHash = await bcrypt.hash(password, 10);

        // Update user's password
        await db
            .update(users)
            .set({ passwordHash })
            .where(eq(users.id, resetToken.userId));

        // Delete the used reset token
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, resetToken.id));

        console.log(`Password successfully reset for user ID: ${resetToken.userId}`);

        return NextResponse.json({
            success: true,
            message: "Password has been reset successfully. You can now login with your new password."
        });

    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { error: "Failed to reset password. Please try again later." },
            { status: 500 }
        );
    }
}
