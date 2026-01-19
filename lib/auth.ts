import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { session } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getCurrentSession() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    if (!sessionId) {
        return null;
    }

    try {
        const [sessionData] = await db
            .select()
            .from(session)
            .where(eq(session.id, sessionId))
            .limit(1);

        if (!sessionData) {
            return null;
        }

        if (new Date(sessionData.expiresAt) < new Date()) {
            // Optional: Delete expired session
            await db.delete(session).where(eq(session.id, sessionId));
            return null;
        }

        return sessionData;
    } catch (error) {
        console.error("Error retrieving session:", error);
        return null;
    }
}
