'use server';

import * as pickupService from '@/lib/services/pickupService';
import { revalidatePath } from 'next/cache';
import { sendNotification } from './notificationActions';
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

        if (status === 'ACCEPTED') {
            const [p] = await db.select().from(pickupRequests).where(eq(pickupRequests.id, id));
            if (p) {
                // 1. Notify Customer
                if (p.customerId) {
                    await sendNotification(p.customerId, `Your Pickup booking (#${id}) has been ACCEPTED.`, id);
                }
                // 2. Notify Assigned Employee
                if (assignedEmployeeId) {
                    const [empUser] = await db.select({ id: users.userId })
                        .from(users)
                        .where(eq(users.relatedId, assignedEmployeeId));
                    if (empUser) {
                        await sendNotification(empUser.id, `You have been assigned to handle Pickup booking #${id}.`, id);
                    }
                }
            }
        }

        return { success: true };
    } catch (error: any) {
        console.error('Error updating pickup status:', error);
        return { success: false, error: 'Failed to update pickup status' };
    }
}
