import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { NotificationRepo } from "@/lib/db/index";

/**
 * GET /api/notifications
 * Returns all notifications for the authenticated user, sorted newest-first.
 */
export async function GET() {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

        const notifications = await NotificationRepo.getNotificationsByUserId(session.userId);

        notifications.sort((a, b) => {
            const tA = a.notificationDate ? new Date(a.notificationDate).getTime() : 0;
            const tB = b.notificationDate ? new Date(b.notificationDate).getTime() : 0;
            return tB - tA;
        });

        return NextResponse.json({ success: true, data: notifications }, { status: 200 });
    } catch (error) {
        console.error("[GET /api/notifications]", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
