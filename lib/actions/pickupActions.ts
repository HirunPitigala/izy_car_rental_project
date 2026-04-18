'use server';

import * as pickupService from '@/lib/services/pickupService';
import { revalidatePath } from 'next/cache';
import { sendNotification } from './notificationActions';
import { sendBookingStatusEmail } from "@/lib/email";
import { db } from '@/lib/db';
import { booking, users, vehicle, vehicleBrand, vehicleModel } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function getPendingPickups(employeeId?: number) {
    try {
        const session = await getSession();
        if (!session || (session.role !== "admin" && session.role !== "manager" && session.role !== "employee")) {
            return { success: false, error: "Unauthorized" };
        }

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

export async function getAssignedPickups(employeeId: number) {
    try {
        const session = await getSession();
        if (!session || (session.role !== "admin" && session.role !== "manager" && session.role !== "employee")) {
            return { success: false, error: "Unauthorized" };
        }

        const data = await pickupService.getPickupRequestsByStatus('ACCEPTED', employeeId);
        // Convert distanceKm and price to number if they are strings from DB
        const processed = data.map(item => ({
            ...item,
            distanceKm: Number(item.distanceKm),
            price: Number(item.price)
        }));
        return { success: true, data: processed };
    } catch (error: any) {
        console.error('Error fetching assigned pickups:', error);
        return { success: false, error: 'Failed to fetch assigned pickup requests' };
    }
}

export async function updatePickupStatus(id: number, status: 'ACCEPTED' | 'REJECTED', reason?: string, assignedEmployeeId?: number) {
    try {
        const session = await getSession();
        if (!session || (session.role !== "admin" && session.role !== "manager" && session.role !== "employee")) {
            return { success: false, error: "Unauthorized" };
        }

        await pickupService.updatePickupRequestStatus(id, status, reason, assignedEmployeeId);
        revalidatePath('/admin/bookings/requested');
        revalidatePath('/employee/assigned');

        const [p] = await db.select().from(booking).where(eq(booking.bookingId, id));
        if (p) {
            if (status === 'ACCEPTED' && p.vehicleId) {
                await db.update(vehicle).set({ status: 'UNAVAILABLE' }).where(eq(vehicle.vehicleId, p.vehicleId));
            }

            const [u] = await db.select({ email: users.email, name: users.name })
                .from(users).where(eq(users.userId, p.userId!));

            // Fetch vehicle details for the email
            const [v] = await db.select({
                brand: vehicleBrand.brandName,
                model: vehicleModel.modelName,
                plateNumber: vehicle.plateNumber,
                transmission: vehicle.transmission,
                fuelType: vehicle.fuelType,
            })
            .from(vehicle)
            .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
            .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
            .where(eq(vehicle.vehicleId, p.vehicleId!));

            const vehicleSpecs = v ? {
                brand: v.brand ?? "",
                model: v.model ?? "",
                plateNumber: v.plateNumber,
                transmission: v.transmission,
                fuelType: v.fuelType,
            } : undefined;

            const bookingDetails = {
                rentalDate: p.rentalDate || undefined,
                pickupLocation: p.pickupLocation || undefined,
                dropoffLocation: p.dropoffLocation || undefined,
                totalFare: p.totalFare || undefined,
                passengers: p.numberOfTravelers ?? undefined,
                message: p.message || undefined
            };

            if (status === 'ACCEPTED') {
                // 1. Notify Customer — in-app + email
                if (p.userId) {
                    try { await sendNotification(p.userId, `Your Pickup booking (#${id}) has been ACCEPTED.`, id, "pickup"); }
                    catch (e) { console.error("Notification error:", e); }
                    try { 
                        if (u?.email) {
                            await sendBookingStatusEmail(
                                u.email, 
                                u.name ?? "Customer", 
                                id, 
                                "Pickup", 
                                "ACCEPTED", 
                                undefined,
                                vehicleSpecs,
                                bookingDetails
                            ); 
                        }
                    }
                    catch (e) { console.error("Email error:", e); }
                }
                // 2. Notify Assigned Employee — serviceType enables navigation
                if (assignedEmployeeId) {
                    try {
                        const [empUser] = await db.select({ id: users.userId }).from(users).where(eq(users.relatedId, assignedEmployeeId));
                        if (empUser) await sendNotification(empUser.id, `New Booking Assigned - Pickup booking #${id}`, id, "pickup");
                    } catch (e) { console.error("Employee notification error:", e); }
                }
            } else if (status === 'REJECTED') {
                // Notify Customer — in-app + email
                if (p.userId) {
                    try { await sendNotification(p.userId, `Your Pickup booking (#${id}) has been REJECTED.`, id, "pickup"); }
                    catch (e) { console.error("Notification error:", e); }
                    try { 
                        if (u?.email) {
                            await sendBookingStatusEmail(
                                u.email, 
                                u.name ?? "Customer", 
                                id, 
                                "Pickup", 
                                "REJECTED", 
                                reason ?? undefined,
                                vehicleSpecs,
                                bookingDetails
                            ); 
                        }
                    }
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
