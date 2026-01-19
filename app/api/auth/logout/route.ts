import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { session } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get("session_id")?.value;

        if (sessionId) {
            // Remove from DB
            await db.delete(session).where(eq(session.id, sessionId));
        }

        // Clear cookie
        cookieStore.delete("session_id");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
