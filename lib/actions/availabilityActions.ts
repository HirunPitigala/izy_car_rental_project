"use server";

import { db } from "@/lib/db";
import { booking } from "@/src/db/schema";
import { and, or, eq, sql } from "drizzle-orm";

/**
 * Checks if a vehicle is available for a given date range.
 * A vehicle is NOT available if there are any PENDING or ACCEPTED bookings
 * that overlap with the requested range.
 * 
 * @param vehicleId The ID of the vehicle to check
 * @param startDate The requested rental start date/time
 * @param endDate The requested rental return date/time
 */
export async function checkVehicleAvailability(vehicleId: number, startDate: Date, endDate: Date) {
    try {
        // Validation: Ensure valid dates
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error("Invalid date range provided.");
        }

        // Format dates for MySQL comparison
        const requestedStart = startDate.toISOString().slice(0, 19).replace('T', ' ');
        const requestedEnd = endDate.toISOString().slice(0, 19).replace('T', ' ');

        // Overlap Logic: (newStart < existEnd) AND (existStart < newEnd)
        // We use COALESCE(return_date, DATE_ADD(rental_date, INTERVAL 4 HOUR)) to handle one-way trips
        // where returnDate is NULL.
        const overlappingBookings = await db.select({ count: sql<number>`count(*)` })
            .from(booking)
            .where(
                and(
                    eq(booking.vehicleId, vehicleId),
                    or(
                        eq(booking.status, "PENDING"),
                        eq(booking.status, "ACCEPTED"),
                        eq(booking.status, "WEDDING_INQUIRY"),
                        eq(booking.status, "WEDDING_CONTACTED")
                    ),
                    sql`${booking.rentalDate} < ${requestedEnd}`,
                    sql`COALESCE(${booking.returnDate}, DATE_ADD(${booking.rentalDate}, INTERVAL 4 HOUR)) > ${requestedStart}`
                )
            );

        const count = overlappingBookings[0]?.count || 0;
        return count === 0;
    } catch (error) {
        console.error("Availability check error:", error);
        // If check fails, we err on the side of caution and assume unavailable or throw
        throw error;
    }
}
