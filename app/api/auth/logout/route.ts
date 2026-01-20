
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { session } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get("session_id")?.value;

        if (sessionId) {
            // Delete from DB
            await db.delete(session).where(eq(session.id, sessionId));
        }

        // Clear cookie
        cookieStore.delete("session_id");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({ error: "Logout failed" }, { status: 500 });
    }
}
