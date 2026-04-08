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
import { eq, and, gte, sql, or, notInArray } from "drizzle-orm";
import { getAvailableVehicles } from "@/lib/actions/vehicleActions";

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
    transferType: "pickup" | "drop";
    airport: "katunayaka" | "mattala";
    pickupDate?: string;
    pickupTime?: string;
    dropDate?: string;
    dropTime?: string;
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
 * Reuses the standard availability filtering logic from vehicleActions.
 */
export async function searchAvailableAirportVehicles(
    passengers: number,
    luggageCount: number,
    startDate?: string,
    startTime?: string,
    endDate?: string,
    endTime?: string
) {
    // If no dates provided, use a far future range or current day for simple listing.
    const startD = startDate || new Date().toISOString().split('T')[0];
    const startT = startTime || "00:00";
    const endD = endDate || startD;
    const endT = endTime || "23:59";

    const result = await getAvailableVehicles(startD, startT, endD, endT, "Airport Rental");
    
    if (result.success && result.data) {
        // Further filter by seating and luggage capacity for airport specifics
        return result.data.filter(v => 
            v.seatingCapacity >= passengers && 
            v.luggageCapacity >= luggageCount
        );
    }
    
    return [];
}

// ──────────────────────────────────────────────────────────────
// Validation
// ──────────────────────────────────────────────────────────────

export function validateAirportBooking(data: AirportBookingData): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!["pickup", "drop"].includes(data.transferType)) {
        errors.push({ field: "transferType", message: "Transfer type must be pickup or drop." });
    }
    if (!["katunayaka", "mattala"].includes(data.airport)) {
        errors.push({ field: "airport", message: "Invalid airport selection." });
    }

    if (data.transferType === "pickup") {
        if (!data.pickupDate) errors.push({ field: "pickupDate", message: "Pickup date is required." });
        if (!data.pickupTime) errors.push({ field: "pickupTime", message: "Pickup time is required." });
    } else {
        if (!data.dropDate) errors.push({ field: "dropDate", message: "Drop date is required." });
        if (!data.dropTime) errors.push({ field: "dropTime", message: "Drop time is required." });
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
        pickupDate: data.pickupDate ? new Date(data.pickupDate) : null,
        pickupTime: data.pickupTime ?? null,
        dropDate: data.dropDate ? new Date(data.dropDate) : null,
        dropTime: data.dropTime ?? null,
        passengers: data.passengers,
        luggageCount: data.luggageCount ?? 0,
        customerFullName: data.customerFullName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail ?? null,
        transferLocation: data.transferLocation,
        status: "PENDING",
        bookingType: "airport_rental",
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
            pickupDate: airportBookings.pickupDate,
            pickupTime: airportBookings.pickupTime,
            dropDate: airportBookings.dropDate,
            dropTime: airportBookings.dropTime,
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
            pickupDate: airportBookings.pickupDate,
            pickupTime: airportBookings.pickupTime,
            dropDate: airportBookings.dropDate,
            dropTime: airportBookings.dropTime,
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
            pickupDate: airportBookings.pickupDate,
            pickupTime: airportBookings.pickupTime,
            dropDate: airportBookings.dropDate,
            dropTime: airportBookings.dropTime,
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
