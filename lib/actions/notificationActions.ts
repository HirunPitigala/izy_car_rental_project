"use server";

import { db } from "@/src/db";
import { notification, users } from "@/src/db/schema";
import { notificationBroker } from "@/lib/notificationBroker";
import { eq, or } from "drizzle-orm";

export async function sendNotification(userId: number, message: string, bookingId?: number) {
    try {
        await db.insert(notification).values({
            userId,
            bookingId,
            message,
            notificationDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
            status: "UNREAD"
        });

        // Trigger real-time broker
        // In a serverless environment, this won't work perfectly across instances, 
        // but for a local dev setup or single-node VPS, it works for simulation.
        notificationBroker.notify(userId, { message, bookingId, date: new Date().toISOString() });
        
        return { success: true };
    } catch (error) {
        console.error("Send Notification Error:", error);
        return { success: false, error: "Failed to send notification" };
    }
}

export async function notifyAdmins(message: string, bookingId?: number) {
    try {
        // Find all admins/managers to record the notification in DB
        const adminUsers = await db.select({ id: users.userId })
            .from(users)
            .where(or(eq(users.role, "admin"), eq(users.role, "manager")));

        if (adminUsers.length > 0) {
            const notificationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            await db.insert(notification).values(
                adminUsers.map(u => ({
                    userId: u.id,
                    bookingId,
                    message,
                    notificationDate,
                    status: "UNREAD" as const,
                }))
            );
        }

        // Trigger real-time broker for all admins
        notificationBroker.notifyAdmins({ message, bookingId, date: new Date().toISOString() });
        
        return { success: true };
    } catch (error) {
        console.error("Notify Admins Error:", error);
        return { success: false, error: "Failed to notify admins" };
    }
}
