import { db } from "@/lib/db";
import {
    airportBookings,
    vehicle,
    vehicleBrand,
    vehicleModel,
    serviceCategory,
    users,
    employee,
} from "@/src/db/schema";
import { eq, and, gte } from "drizzle-orm";

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────

export interface AirportSearchParams {
    passengers: number;
    luggageCount: number;
}

export interface AirportBookingData {
    customerId: number;
    vehicleId: number;
    transferType: "PICKUP" | "DROP";
    airport: "BANDARANAYAKE" | "MATTALA";
    transferDate: string;     // YYYY-MM-DD
    transferTime: string;     // HH:MM
    passengers: number;
    luggageCount: number;
    customerFullName: string;
    customerPhone: string;
    customerEmail?: string;
    transferLocation: string; // customer's address
}

export interface ValidationError {
    field: string;
    message: string;
}

// ──────────────────────────────────────────────────────────────
// Vehicle Search
// ──────────────────────────────────────────────────────────────

/**
 * Return available "Airport Rental" vehicles that satisfy passenger & luggage needs.
 */
export async function searchAvailableAirportVehicles(
    passengers: number,
    luggageCount: number
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
            rentPerDay: vehicle.rentPerDay,
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
                eq(serviceCategory.categoryName, "Airport Rental"),
                eq(vehicle.status, "AVAILABLE"),
                gte(vehicle.seatingCapacity, passengers),
                gte(vehicle.luggageCapacity, luggageCount)
            )
        );

    return results;
}

// ──────────────────────────────────────────────────────────────
// Validation
// ──────────────────────────────────────────────────────────────

export function validateAirportBooking(data: AirportBookingData): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!["PICKUP", "DROP"].includes(data.transferType)) {
        errors.push({ field: "transferType", message: "Transfer type must be PICKUP or DROP." });
    }
    if (!["BANDARANAYAKE", "MATTALA"].includes(data.airport)) {
        errors.push({ field: "airport", message: "Invalid airport selection." });
    }
    if (!data.transferDate) {
        errors.push({ field: "transferDate", message: "Transfer date is required." });
    } else {
        const today = new Date().toISOString().split("T")[0];
        if (data.transferDate < today) {
            errors.push({ field: "transferDate", message: "Transfer date cannot be in the past." });
        }
    }
    if (!data.transferTime) {
        errors.push({ field: "transferTime", message: "Transfer time is required." });
    }
    if (!data.passengers || data.passengers <= 0) {
        errors.push({ field: "passengers", message: "Passengers must be at least 1." });
    }
    if (data.luggageCount < 0) {
        errors.push({ field: "luggageCount", message: "Luggage count cannot be negative." });
    }
    if (!data.customerFullName?.trim()) {
        errors.push({ field: "customerFullName", message: "Full name is required." });
    }
    if (!data.customerPhone?.trim()) {
        errors.push({ field: "customerPhone", message: "Phone number is required." });
    }
    if (!data.transferLocation?.trim()) {
        errors.push({ field: "transferLocation", message: "Pickup/drop location is required." });
    }

    return errors;
}

// ──────────────────────────────────────────────────────────────
// Booking CRUD
// ──────────────────────────────────────────────────────────────

export async function createAirportBooking(data: AirportBookingData) {
    const [result] = await db.insert(airportBookings).values({
        customerId: data.customerId,
        vehicleId: data.vehicleId,
        transferType: data.transferType,
        airport: data.airport,
        transferDate: data.transferDate,
        transferTime: data.transferTime,
        passengers: data.passengers,
        luggageCount: data.luggageCount ?? 0,
        customerFullName: data.customerFullName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail ?? null,
        transferLocation: data.transferLocation,
        status: "PENDING",
    });

    return (result as any).insertId as number;
}

/**
 * Fetch all airport bookings filtered by status (for employee/admin).
 */
export async function getAirportBookingsByStatus(status = "PENDING") {
    return db
        .select({
            id: airportBookings.id,
            transferType: airportBookings.transferType,
            airport: airportBookings.airport,
            transferDate: airportBookings.transferDate,
            transferTime: airportBookings.transferTime,
            passengers: airportBookings.passengers,
            luggageCount: airportBookings.luggageCount,
            customerFullName: airportBookings.customerFullName,
            customerPhone: airportBookings.customerPhone,
            customerEmail: airportBookings.customerEmail,
            transferLocation: airportBookings.transferLocation,
            status: airportBookings.status,
            rejectionReason: airportBookings.rejectionReason,
            createdAt: airportBookings.createdAt,
            handledByEmployeeId: airportBookings.handledByEmployeeId,
            vehicleBrand: vehicleBrand.brandName,
            vehicleModel: vehicleModel.modelName,
            vehiclePlate: vehicle.plateNumber,
            vehicleImage: vehicle.vehicleImage,
            customerName: users.name,
            customerAccountEmail: users.email,
            handledByName: employee.name,
        })
        .from(airportBookings)
        .leftJoin(vehicle, eq(airportBookings.vehicleId, vehicle.vehicleId))
        .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
        .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
        .leftJoin(users, eq(airportBookings.customerId, users.id))
        .leftJoin(employee, eq(airportBookings.handledByEmployeeId, employee.employeeId))
        .where(eq(airportBookings.status, status))
        .orderBy(airportBookings.createdAt);
}

/**
 * Fetch all airport bookings regardless of status (for admin dashboard).
 */
export async function getAllAirportBookings() {
    return db
        .select({
            id: airportBookings.id,
            transferType: airportBookings.transferType,
            airport: airportBookings.airport,
            transferDate: airportBookings.transferDate,
            transferTime: airportBookings.transferTime,
            passengers: airportBookings.passengers,
            luggageCount: airportBookings.luggageCount,
            customerFullName: airportBookings.customerFullName,
            customerPhone: airportBookings.customerPhone,
            customerEmail: airportBookings.customerEmail,
            transferLocation: airportBookings.transferLocation,
            status: airportBookings.status,
            rejectionReason: airportBookings.rejectionReason,
            createdAt: airportBookings.createdAt,
            handledByEmployeeId: airportBookings.handledByEmployeeId,
            vehicleBrand: vehicleBrand.brandName,
            vehicleModel: vehicleModel.modelName,
            vehiclePlate: vehicle.plateNumber,
            customerName: users.name,
            customerAccountEmail: users.email,
            handledByName: employee.name,
        })
        .from(airportBookings)
        .leftJoin(vehicle, eq(airportBookings.vehicleId, vehicle.vehicleId))
        .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
        .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
        .leftJoin(users, eq(airportBookings.customerId, users.id))
        .leftJoin(employee, eq(airportBookings.handledByEmployeeId, employee.employeeId))
        .orderBy(airportBookings.createdAt);
}

/**
 * Update airport booking status (accept or reject).
 */
export async function updateAirportBookingStatus(
    id: number,
    status: "ACCEPTED" | "REJECTED",
    rejectionReason?: string,
    employeeId?: number
) {
    await db
        .update(airportBookings)
        .set({
            status,
            rejectionReason: status === "REJECTED" ? (rejectionReason ?? null) : null,
            handledByEmployeeId: employeeId ?? null,
        })
        .where(eq(airportBookings.id, id));
}

/**
 * Fetch airport bookings for a specific customer.
 */
export async function getCustomerAirportBookings(customerId: number) {
    return db
        .select({
            id: airportBookings.id,
            transferType: airportBookings.transferType,
            airport: airportBookings.airport,
            transferDate: airportBookings.transferDate,
            transferTime: airportBookings.transferTime,
            passengers: airportBookings.passengers,
            luggageCount: airportBookings.luggageCount,
            transferLocation: airportBookings.transferLocation,
            status: airportBookings.status,
            rejectionReason: airportBookings.rejectionReason,
            createdAt: airportBookings.createdAt,
            vehicleBrand: vehicleBrand.brandName,
            vehicleModel: vehicleModel.modelName,
            vehiclePlate: vehicle.plateNumber,
            vehicleImage: vehicle.vehicleImage,
        })
        .from(airportBookings)
        .leftJoin(vehicle, eq(airportBookings.vehicleId, vehicle.vehicleId))
        .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
        .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
        .where(eq(airportBookings.customerId, customerId))
        .orderBy(airportBookings.createdAt);
}
