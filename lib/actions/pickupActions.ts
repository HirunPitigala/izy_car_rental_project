'use server';

import * as pickupService from '@/lib/services/pickupService';
import { revalidatePath } from 'next/cache';
import { sendNotification } from './notificationActions';
import { sendBookingStatusEmail } from "@/lib/email";
import { db } from '@/lib/db';
import { pickupRequests, users } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export async function getPendingPickups(employeeId?: number) {
    try {
        const data = await pickupService.getPickupRequestsByStatus('PENDING', employeeId);
        // Convert distanceKm and price to number if they are strings from DB
        const processed = data.map(item => ({
            ...item,
            distanceKm: Number(item.distanceKm),
            price: Number(item.price)
        }));
        return { success: true, data: processed };
    } catch (error: any) {
        console.error('Error fetching pickups:', error);
        return { success: false, error: 'Failed to fetch pickup requests' };
    }
}

export async function updatePickupStatus(id: number, status: 'ACCEPTED' | 'REJECTED', reason?: string, assignedEmployeeId?: number) {
    try {
        await pickupService.updatePickupRequestStatus(id, status, reason, assignedEmployeeId);
        revalidatePath('/admin/bookings/requested');
        revalidatePath('/employee/bookings/requested');

        const [p] = await db.select().from(pickupRequests).where(eq(pickupRequests.id, id));
        if (p) {
            const [u] = await db.select({ email: users.email, name: users.name })
                .from(users).where(eq(users.userId, p.customerId));

            if (status === 'ACCEPTED') {
                // 1. Notify Customer — in-app + email
                if (p.customerId) {
                    try { await sendNotification(p.customerId, `Your Pickup booking (#${id}) has been ACCEPTED.`, id); }
                    catch (e) { console.error("Notification error:", e); }
                    try { if (u?.email) await sendBookingStatusEmail(u.email, u.name ?? "Customer", id, "Pickup", "ACCEPTED"); }
                    catch (e) { console.error("Email error:", e); }
                }
                // 2. Notify Assigned Employee
                if (assignedEmployeeId) {
                    try {
                        const [empUser] = await db.select({ id: users.userId }).from(users).where(eq(users.relatedId, assignedEmployeeId));
                        if (empUser) await sendNotification(empUser.id, `You have been assigned to handle Pickup booking #${id}.`, id);
                    } catch (e) { console.error("Employee notification error:", e); }
                }
            } else if (status === 'REJECTED') {
                // Notify Customer — in-app + email
                if (p.customerId) {
                    try { await sendNotification(p.customerId, `Your Pickup booking (#${id}) has been REJECTED.`, id); }
                    catch (e) { console.error("Notification error:", e); }
                    try { if (u?.email) await sendBookingStatusEmail(u.email, u.name ?? "Customer", id, "Pickup", "REJECTED", reason ?? undefined); }
                    catch (e) { console.error("Email error:", e); }
                }
            }
        }

        return { success: true };
    } catch (error: any) {
        console.error('Error updating pickup status:', error);
        return { success: false, error: 'Failed to update pickup status' };
    }
}
