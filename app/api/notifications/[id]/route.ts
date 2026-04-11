import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { NotificationRepo } from "@/lib/db/index";

/**
 * PATCH /api/notifications/[id]
 * Marks a notification as READ.
 * Only the owning user (or admin/manager) may update a notification.
 */
export async function PATCH(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

        const notificationId = parseInt(params.id, 10);
        if (isNaN(notificationId)) return NextResponse.json({ error: "Invalid notification id." }, { status: 400 });

        const existing = await NotificationRepo.getNotificationById(notificationId);
        if (!existing) return NextResponse.json({ error: "Notification not found." }, { status: 404 });

        const isAdminOrManager = session.role === "admin" || session.role === "manager";
        if (!isAdminOrManager && existing.userId !== session.userId) {
            return NextResponse.json({ error: "Forbidden." }, { status: 403 });
        }

        await NotificationRepo.updateNotification(notificationId, { status: "READ" });
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("[PATCH /api/notifications/[id]]", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
