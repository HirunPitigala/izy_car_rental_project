import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, emailVerificationTokens } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
        return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    // 1. Find token
    const [record] = await db
        .select()
        .from(emailVerificationTokens)
        .where(eq(emailVerificationTokens.token, token));

    if (!record || record.expiresAt < new Date()) {
        return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    // 2. Verify user
    await db
        .update(users)
        .set({
            emailVerified: true,
            emailVerifiedAt: new Date(),
        })
        .where(eq(users.id, record.userId));

    // 3. Delete token
    await db
        .delete(emailVerificationTokens)
        .where(eq(emailVerificationTokens.id, record.id));

    return NextResponse.json({ success: true, message: "Email verified successfully" });
}
