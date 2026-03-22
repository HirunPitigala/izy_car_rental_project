import { db } from "@/lib/db";
import { pickupRequests, vehicle, vehicleBrand, vehicleModel, serviceCategory, users } from "@/src/db/schema";
import { eq, and, gte } from "drizzle-orm";

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────

export interface PickupSearchParams {
    travelers: number;
    luggage: number;
}

export interface PickupBookingData {
    customerId: number;
    vehicleId: number;
    pickupLocation: string;
    dropLocation: string;
    pickupTime: Date;
    returnTime?: Date | null;
    isReturnTrip: boolean;
    travelers: number;
    luggageCount: number;
    distanceKm: number;
    price: number;
    customerFullName: string;
    customerPhone: string;
}

// ──────────────────────────────────────────────────────────────
// Fare Calculation (stub — no external API needed)
// ──────────────────────────────────────────────────────────────

/**
 * Calculate estimated pickup fare.
 * Formula: distance × pricePerKm  (× 2 if return trip).
 */
export function calculateFare(
    distanceKm: number,
    pricePerKm: number,
    isReturnTrip: boolean
): number {
    const base = distanceKm * pricePerKm;
    return isReturnTrip ? base * 2 : base;
}

/**
 * Stub distance estimation between two place names.
 * Returns a sensible placeholder value so the booking can be submitted.
 * Replace with a real geo API later.
 */
export function estimateDistance(from: string, to: string): number {
    // Very basic hash so the same pair always returns the same distance
    const str = `${from.toLowerCase().trim()}${to.toLowerCase().trim()}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    // Clamp between 5 and 150 km
    return Math.abs(hash % 145) + 5;
}

// ──────────────────────────────────────────────────────────────
// Vehicle Search
// ──────────────────────────────────────────────────────────────

/**
 * Return available Pickup-category vehicles that have enough seating
 * capacity for the requested number of travelers.
 */
export async function searchAvailablePickupVehicles(
    travelers: number,
    _luggage: number
) {
    const results = await db
        .select({
            vehicleId: vehicle.vehicleId,
            brand: vehicleBrand.brandName,
            model: vehicleModel.modelName,
            plateNumber: vehicle.plateNumber,
            seatingCapacity: vehicle.seatingCapacity,
            luggageCapacity: vehicle.luggageCapacity,
            transmission: vehicle.transmission,
            fuelType: vehicle.fuelType,
            pricePerKm: vehicle.pricePerKm,
            image: vehicle.vehicleImage,
            description: vehicle.description,
            status: vehicle.status,
        })
        .from(vehicle)
        .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
        .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
        .innerJoin(serviceCategory, eq(vehicle.categoryId, serviceCategory.categoryId))
        .where(
            and(
                eq(serviceCategory.categoryName, "Pickups"),
                eq(vehicle.status, "AVAILABLE"),
                gte(vehicle.seatingCapacity, travelers)
            )
        );

    return results;
}

// ──────────────────────────────────────────────────────────────
// Booking Creation
// ──────────────────────────────────────────────────────────────

export interface ValidationError {
    field: string;
    message: string;
}

/**
 * Validate booking payload and return any errors found.
 */
export function validatePickupBooking(data: PickupBookingData): ValidationError[] {
    const errors: ValidationError[] = [];
    const now = new Date();

    if (data.travelers <= 0) {
        errors.push({ field: "travelers", message: "Traveler count must be at least 1." });
    }

    // Allow up to 10 minutes in the past to account for timezone
    // differences between the client's datetime-local input (no TZ suffix)
    // and the server's UTC clock (e.g. user in UTC+5:30).
    const gracePeriodMs = 10 * 60 * 1000;
    if (data.pickupTime.getTime() < Date.now() - gracePeriodMs) {
        errors.push({ field: "pickupTime", message: "Pickup time must be in the future." });
    }

    if (data.isReturnTrip && data.returnTime) {
        if (data.returnTime <= data.pickupTime) {
            errors.push({
                field: "returnTime",
                message: "Return time must be after pickup time.",
            });
        }
    }

    if (!data.pickupLocation.trim()) {
        errors.push({ field: "pickupLocation", message: "Pickup location is required." });
    }

    if (!data.dropLocation.trim()) {
        errors.push({ field: "dropLocation", message: "Drop-off location is required." });
    }

    if (!data.customerFullName.trim()) {
        errors.push({ field: "customerFullName", message: "Full name is required." });
    }

    if (!data.customerPhone.trim()) {
        errors.push({ field: "customerPhone", message: "Phone number is required." });
    }

    return errors;
}

/**
 * Persist a validated pickup booking to `pickup_requests`.
 */
export async function createPickupBooking(data: PickupBookingData) {
    const [result] = await db.insert(pickupRequests).values({
        customerId: data.customerId,
        vehicleId: data.vehicleId,
        pickupLocation: data.pickupLocation,
        dropLocation: data.dropLocation,
        pickupTime: data.pickupTime,
        returnTime: data.isReturnTrip && data.returnTime ? data.returnTime : null,
        isReturnTrip: data.isReturnTrip,
        travelers: data.travelers,
        luggageCount: data.luggageCount,
        distanceKm: data.distanceKm.toFixed(2),
        price: data.price.toFixed(2),
        customerFullName: data.customerFullName,
        customerPhone: data.customerPhone,
        status: "PENDING",
    });

    return (result as any).insertId as number;
}

// ──────────────────────────────────────────────────────────────
// Employee Read / Update
// ──────────────────────────────────────────────────────────────

/**
 * Fetch all pickup requests with the given status (default: PENDING).
 */
export async function getPickupRequestsByStatus(status = "PENDING") {
    return db
        .select({
            id: pickupRequests.id,
            pickupLocation: pickupRequests.pickupLocation,
            dropLocation: pickupRequests.dropLocation,
            pickupTime: pickupRequests.pickupTime,
            returnTime: pickupRequests.returnTime,
            isReturnTrip: pickupRequests.isReturnTrip,
            travelers: pickupRequests.travelers,
            luggageCount: pickupRequests.luggageCount,
            distanceKm: pickupRequests.distanceKm,
            price: pickupRequests.price,
            status: pickupRequests.status,
            rejectionReason: pickupRequests.rejectionReason,
            createdAt: pickupRequests.createdAt,
            customerFullName: pickupRequests.customerFullName,
            customerPhone: pickupRequests.customerPhone,
            vehicleBrand: vehicleBrand.brandName,
            vehicleModel: vehicleModel.modelName,
            vehiclePlate: vehicle.plateNumber,
            customerName: users.name,
            customerEmail: users.email,
        })
        .from(pickupRequests)
        .leftJoin(vehicle, eq(pickupRequests.vehicleId, vehicle.vehicleId))
        .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
        .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
        .leftJoin(users, eq(pickupRequests.customerId, users.id))
        .where(eq(pickupRequests.status, status))
        .orderBy(pickupRequests.createdAt);
}

/**
 * Update status of a pickup request (accept or reject).
 */
export async function updatePickupRequestStatus(
    id: number,
    status: "ACCEPTED" | "REJECTED",
    rejectionReason?: string
) {
    await db
        .update(pickupRequests)
        .set({
            status,
            rejectionReason: status === "REJECTED" ? (rejectionReason ?? null) : null,
        })
        .where(eq(pickupRequests.id, id));
}

/**
 * Fetch pickup bookings for a specific customer.
 */
export async function getCustomerPickupHistory(customerId: number) {
    return db
        .select({
            id: pickupRequests.id,
            pickupLocation: pickupRequests.pickupLocation,
            dropLocation: pickupRequests.dropLocation,
            pickupTime: pickupRequests.pickupTime,
            returnTime: pickupRequests.returnTime,
            isReturnTrip: pickupRequests.isReturnTrip,
            travelers: pickupRequests.travelers,
            distanceKm: pickupRequests.distanceKm,
            price: pickupRequests.price,
            status: pickupRequests.status,
            rejectionReason: pickupRequests.rejectionReason,
            createdAt: pickupRequests.createdAt,
            vehicleBrand: vehicleBrand.brandName,
            vehicleModel: vehicleModel.modelName,
            vehiclePlate: vehicle.plateNumber,
        })
        .from(pickupRequests)
        .leftJoin(vehicle, eq(pickupRequests.vehicleId, vehicle.vehicleId))
        .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
        .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
        .where(eq(pickupRequests.customerId, customerId))
        .orderBy(pickupRequests.createdAt);
}
