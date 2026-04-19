"use server";

import { db } from "@/lib/db";
import { vehicle, vehicleBrand, vehicleModel, serviceCategory, booking } from "@/src/db/schema";
import { eq, sql, desc, and, ne, notInArray, or, lt, gt, lte, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { getSession } from "@/lib/auth";

// ----------------------------------------------------------------------------
// Helper Functions (Internal)
// ----------------------------------------------------------------------------

async function getOrCreateBrand(brandName: string) {
    if (!brandName) throw new Error("Brand name is required");
    const [existing] = await db.select().from(vehicleBrand).where(eq(vehicleBrand.brandName, brandName));
    if (existing) return existing.brandId;

    const [result] = await db.insert(vehicleBrand).values({ brandName });
    return (result as any).insertId;
}

async function getOrCreateModel(brandId: number, modelName: string) {
    if (!modelName) throw new Error("Model name is required");
    const [existing] = await db.select().from(vehicleModel).where(
        and(eq(vehicleModel.brandId, brandId), eq(vehicleModel.modelName, modelName))
    );
    if (existing) return existing.modelId;

    const [result] = await db.insert(vehicleModel).values({ brandId, modelName });
    return (result as any).insertId;
}

async function getCategory(categoryName: string) {
    if (!categoryName) throw new Error("Category is required");
    const [existing] = await db.select().from(serviceCategory).where(eq(serviceCategory.categoryName, categoryName));

    // If category doesn't exist, we might want to create it or throw error. 
    // Logic implies "selected by user" from strict options, so it SHOULD exist. 
    // But for safety and init, we can create it if missing, or throw. 
    // Given the prompt "inputs already exist... selected by user", I'll assume they pre-exist or I should create to be safe.
    // I will auto-create to prevent blockers.
    if (existing) return existing.categoryId;

    const [result] = await db.insert(serviceCategory).values({ categoryName });
    return (result as any).insertId;
}

// ----------------------------------------------------------------------------
// Main Actions
// ----------------------------------------------------------------------------

export async function saveVehicle(data: any) {
    try {
        const session = await getSession();
        if (!session || session.role !== "admin") {
            return { success: false, error: "Unauthorized. Admin access required." };
        }

        // 1. Resolve Dependencies (Brand, Model, Category)
        const brandId = await getOrCreateBrand(data.brand);
        const modelId = await getOrCreateModel(brandId, data.model);
        const categoryId = await getCategory(data.serviceCategory);

        // 2. Prepare Payload
        // Mapping UI fields to DB Schema fields
        const vehiclePayload = {
            plateNumber: data.plateNumber,
            categoryId,
            brandId,
            modelId,
            vehicleImage: data.image.startsWith('data:')
                ? (await (await import("@/lib/cloudinary")).uploadBase64ToCloudinary(data.image, 'vehicles')).secure_url
                : data.image, // If it's already a URL or empty, keep it.

            seatingCapacity: parseInt(data.seatingCapacity),
            luggageCapacity: parseInt(data.luggageCapacity),
            transmission: data.transmissionType,
            fuelType: data.fuelType,
            description: data.description,

            rentPerHour: data.rentPerHour.toString(), // Ensure decimal compatible string
            rentPerDay: data.rentPerDay.toString(),
            rentPerMonth: data.rentPerMonth.toString(),

            maxKmsPerDay: parseInt(data.maxMileagePerDay),
            extraKmPrice: data.extraMileageCharge.toString(),
            pricePerKm: data.pricePerKm ? data.pricePerKm.toString() : null,
            minRentalDays: parseInt(data.minRentalPeriod),

            status: data.status,
            chassisNumber: data.chassisNumber,
        };

        // 3. Persist to DB
        if (data.vehicleId) {
            // Update mode
            await db.update(vehicle).set(vehiclePayload).where(eq(vehicle.vehicleId, data.vehicleId));
        } else {
            // Create mode - check if plate already exists to prevent crash
            const [existing] = await db.select().from(vehicle).where(eq(vehicle.plateNumber, data.plateNumber));
            if (existing) {
                return { success: false, error: "A vehicle with this plate number already exists." };
            }
            await db.insert(vehicle).values(vehiclePayload);
        }

        revalidatePath("/admin/vehicles");
        revalidatePath("/admin/vehicles/rent-a-car");
        revalidatePath("/admin/vehicles/airport-rental");
        return { success: true };

    } catch (error: any) {
        console.error("Error saving vehicle:", error);
        return { success: false, error: error.message || "Failed to save vehicle" };
    }
}

// ----------------------------------------------------------------------------
// Fetch Actions (Updated for new Schema)
// ----------------------------------------------------------------------------

export async function getAvailableVehicles(startDate: string, startTime: string, endDate: string, endTime: string, category: string = SERVICE_CATEGORIES.RENT_A_CAR) {
    try {
        const start = `${startDate} ${startTime}:00`;
        const end = `${endDate} ${endTime}:00`;

        // 1. Find IDs of vehicles that are ALREADY booked during this period
        // Logic: Only block if the booking is currently active (PENDING or ACCEPTED)
        // and its date range overlaps with the requested search range.
        const blockedVehiclesQuery = await db.select({ id: booking.vehicleId })
            .from(booking)
            .innerJoin(vehicle, eq(booking.vehicleId, vehicle.vehicleId))
            .where(
                and(
                    or(
                        eq(booking.status, 'PENDING'),
                        eq(booking.status, 'ACCEPTED'),
                        eq(booking.status, 'WEDDING_CONTACTED')
                    ),
                    sql`${booking.rentalDate} < ${end}`,
                    sql`${booking.returnDate} > ${start}`,
                    // ONLY block if:
                    // 1. It is a FUTURE booking (starts after now) -> Prevents double booking future slots.
                    // 2. OR the car is NOT marked as 'AVAILABLE' -> Standard active booking block.
                    // This allows "Early Returns" (Current/Past booking + status=AVAILABLE) to be ignored.
                    or(
                        gt(booking.rentalDate, sql`NOW()`),
                        ne(vehicle.status, "AVAILABLE")
                    )
                )
            );

        const blockedIds = blockedVehiclesQuery
            .map(b => b.id)
            .filter((id): id is number => id !== null);

        // 2. Query all vehicles NOT in the blocked list
        const query = db.select({
            vehicleId: vehicle.vehicleId,
            brand: vehicleBrand.brandName,
            model: vehicleModel.modelName,
            plateNumber: vehicle.plateNumber,
            seatingCapacity: vehicle.seatingCapacity,
            luggageCapacity: vehicle.luggageCapacity,
            transmissionType: vehicle.transmission,
            fuelType: vehicle.fuelType,
            rentPerHour: vehicle.rentPerHour,
            rentPerDay: vehicle.rentPerDay,
            rentPerMonth: vehicle.rentPerMonth,
            maxMileagePerDay: vehicle.maxKmsPerDay,
            extraMileageCharge: vehicle.extraKmPrice,
            minRentalPeriod: vehicle.minRentalDays,
            status: vehicle.status,
            serviceCategory: serviceCategory.categoryName,
            image: vehicle.vehicleImage,
            description: vehicle.description,
            pricePerKm: vehicle.pricePerKm,
            isLocked: vehicle.isLocked,
            lockedBy: vehicle.lockedBy,
            lockExpiresAt: vehicle.lockExpiresAt,
        })
            .from(vehicle)
            .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
            .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
            .innerJoin(serviceCategory, eq(vehicle.categoryId, serviceCategory.categoryId))
            .where(
                and(
                    eq(vehicle.status, "AVAILABLE"),
                    // Filter by selected category
                    eq(serviceCategory.categoryName, category),
                    blockedIds.length > 0 ? notInArray(vehicle.vehicleId, blockedIds) : undefined
                )
            );

        const availableVehicles = await query;

        return { success: true, data: availableVehicles };
    } catch (error: any) {
        console.error("Error searching availability:", error);
        return { success: false, error: `Failed to search availability: ${error.message || 'Unknown error'}` };
    }
}

export async function getVehiclesByCategory(categoryName: string) {
    try {
        const vehicles = await db.select({
            vehicleId: vehicle.vehicleId,
            brand: vehicleBrand.brandName,
            model: vehicleModel.modelName,
            plateNumber: vehicle.plateNumber,

            seatingCapacity: vehicle.seatingCapacity,
            luggageCapacity: vehicle.luggageCapacity,
            transmissionType: vehicle.transmission, // Mapping back to UI expected name
            fuelType: vehicle.fuelType,

            rentPerHour: vehicle.rentPerHour,
            rentPerDay: vehicle.rentPerDay,
            rentPerMonth: vehicle.rentPerMonth,

            maxMileagePerDay: vehicle.maxKmsPerDay, // Mapping back
            extraMileageCharge: vehicle.extraKmPrice, // Mapping back
            minRentalPeriod: vehicle.minRentalDays, // Mapping back

            status: vehicle.status,
            serviceCategory: serviceCategory.categoryName,
            image: vehicle.vehicleImage, // Mapping back
            description: vehicle.description,
            chassisNumber: vehicle.chassisNumber,
            pricePerKm: vehicle.pricePerKm,
            createdAt: vehicle.createdAt,
            isLocked: vehicle.isLocked,
            lockedBy: vehicle.lockedBy,
            lockExpiresAt: vehicle.lockExpiresAt,
        })
            .from(vehicle)
            .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
            .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
            .innerJoin(serviceCategory, eq(vehicle.categoryId, serviceCategory.categoryId))
            .where(eq(serviceCategory.categoryName, categoryName))
            .orderBy(desc(vehicle.vehicleId));

        return { success: true, data: vehicles };
    } catch (error) {
        console.error("Error fetching vehicles by category:", error);
        return { success: false, error: "Failed to fetch vehicles" };
    }
}

export async function getVehicleById(id: number) {
    if (!id || isNaN(id)) {
        return { success: false, error: "Invalid vehicle ID provided." };
    }

    try {
        const [v] = await db.select({
            vehicleId: vehicle.vehicleId,
            brand: vehicleBrand.brandName,
            model: vehicleModel.modelName,
            plateNumber: vehicle.plateNumber,

            seatingCapacity: vehicle.seatingCapacity,
            luggageCapacity: vehicle.luggageCapacity,
            transmissionType: vehicle.transmission,
            fuelType: vehicle.fuelType,

            rentPerHour: vehicle.rentPerHour,
            rentPerDay: vehicle.rentPerDay,
            rentPerMonth: vehicle.rentPerMonth,

            maxMileagePerDay: vehicle.maxKmsPerDay,
            extraMileageCharge: vehicle.extraKmPrice,
            minRentalPeriod: vehicle.minRentalDays,
            maxRentalPeriod: sql<number>`30`, // Placeholder as schema reduced this

            status: vehicle.status,
            serviceCategory: serviceCategory.categoryName,
            image: vehicle.vehicleImage,
            description: vehicle.description,
            chassisNumber: vehicle.chassisNumber,
            pricePerKm: vehicle.pricePerKm,
            isLocked: vehicle.isLocked,
            lockedBy: vehicle.lockedBy,
            lockExpiresAt: vehicle.lockExpiresAt,
        })
            .from(vehicle)
            .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
            .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
            .leftJoin(serviceCategory, eq(vehicle.categoryId, serviceCategory.categoryId))
            .where(eq(vehicle.vehicleId, id));

        return { success: true, data: v };
    } catch (error) {
        console.error("Error fetching vehicle by id:", error);
        return { success: false, error: "Failed to fetch vehicle details" };
    }
}
