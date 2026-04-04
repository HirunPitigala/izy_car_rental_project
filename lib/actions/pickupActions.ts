'use server';

import * as pickupService from '@/lib/services/pickupService';
import { revalidatePath } from 'next/cache';

export async function getPendingPickups() {
    try {
        const data = await pickupService.getPickupRequestsByStatus('PENDING');
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

export async function updatePickupStatus(id: number, status: 'ACCEPTED' | 'REJECTED', reason?: string) {
    try {
        await pickupService.updatePickupRequestStatus(id, status, reason);
        revalidatePath('/admin/bookings/requested');
        return { success: true };
    } catch (error: any) {
        console.error('Error updating pickup status:', error);
        return { success: false, error: 'Failed to update pickup status' };
    }
}
