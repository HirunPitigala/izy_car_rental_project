"use server";

import { db } from "@/src/db";
import { notification, users } from "@/src/db/schema";
import { notificationBroker } from "@/lib/notificationBroker";
import { eq, or } from "drizzle-orm";

/**
 * Send a notification to a specific user.
 * Writes to DB and fires SSE broker event.
 * serviceType is included in the broker payload (not stored in DB) for client-side navigation.
 */
export async function sendNotification(
    userId: number,
    message: string,
    bookingId?: number,
    serviceType?: string
) {
    try {
        await db.insert(notification).values({
            userId,
            bookingId,
            message,
            notificationDate: new Date().toISOString().slice(0, 19).replace("T", " "),
            status: "UNREAD",
        });

        notificationBroker.notify(userId, {
            message,
            bookingId,
            serviceType,
            date: new Date().toISOString(),
        });

        return { success: true };
    } catch (error) {
        console.error("Send Notification Error:", error);
        return { success: false, error: "Failed to send notification" };
    }
}

/**
 * Broadcast a notification to all admins and managers.
 * serviceType is included in the broker payload for client-side navigation.
 */
export async function notifyAdmins(
    message: string,
    bookingId?: number,
    serviceType?: string
) {
    try {
        const adminUsers = await db
            .select({ id: users.userId })
            .from(users)
            .where(or(eq(users.role, "admin"), eq(users.role, "manager")));

        if (adminUsers.length > 0) {
            const notificationDate = new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");
            await db.insert(notification).values(
                adminUsers.map((u) => ({
                    userId: u.id,
                    bookingId,
                    message,
                    notificationDate,
                    status: "UNREAD" as const,
                }))
            );
        }

        notificationBroker.notifyAdmins({
            message,
            bookingId,
            serviceType,
            date: new Date().toISOString(),
        });

        return { success: true };
    } catch (error) {
        console.error("Notify Admins Error:", error);
        return { success: false, error: "Failed to notify admins" };
    }
}
