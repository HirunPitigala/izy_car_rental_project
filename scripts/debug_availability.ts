import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../lib/db";
import { vehicle, serviceCategory, booking, vehicleBrand } from "../src/db/schema";
import { eq, ne, and, sql } from "drizzle-orm";

async function investigate() {
    console.log("--- Investigating Database State ---");

    // 1. Check Service Categories
    const categories = await db.select().from(serviceCategory);
    console.log("Service Categories:", categories);

    // 2. Check Available Vehicles
    const allVehicles = await db.select({
        id: vehicle.vehicleId,
        plate: vehicle.plateNumber,
        status: vehicle.status,
        catId: vehicle.categoryId
    }).from(vehicle);
    console.log("All Vehicles count:", allVehicles.length);
    console.log("First few vehicles:", allVehicles.slice(0, 5));

    // 3. Test Availability Logic
    const startDate = "2026-02-10";
    const startTime = "10:00";
    const endDate = "2026-02-12";
    const endTime = "10:00";

    const start = `${startDate} ${startTime}:00`;
    const end = `${endDate} ${endTime}:00`;

    console.log(`\n--- Testing Search: ${start} to ${end} ---`);

    const blockedVehiclesQuery = db.select({ id: booking.vehicleId })
        .from(booking)
        .where(
            and(
                ne(booking.bookingStatus, 'REJECTED'),
                sql`${booking.rentalDate} < ${end}`,
                sql`${booking.returnDate} > ${start}`
            )
        );

    const blockedResult = await blockedVehiclesQuery;
    console.log("Blocked result count:", blockedResult.length);

    const query = db.select({
        id: vehicle.vehicleId,
        brand: vehicleBrand.brandName,
        status: vehicle.status,
        cat: serviceCategory.categoryName
    })
        .from(vehicle)
        .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
        .innerJoin(serviceCategory, eq(vehicle.categoryId, serviceCategory.categoryId))
        .where(
            and(
                eq(serviceCategory.categoryName, "Rent a Car"),
                eq(vehicle.status, "AVAILABLE")
            )
        );

    const available = await query;
    console.log("Available baseline (no blocks):", available.length);
    if (available.length > 0) {
        console.log("Example available vehicle:", available[0]);
    }

    process.exit(0);
}

investigate().catch(err => {
    console.error(err);
    process.exit(1);
});
