import { db } from "@/lib/db";
import {
    booking,
    vehicle,
    vehicleBrand,
    vehicleModel,
    serviceCategory,
    users,
    employee,
} from "@/src/db/schema";
import { eq, and, gte, sql, or, notInArray } from "drizzle-orm";
import { getAvailableVehicles } from "@/lib/actions/vehicleActions";
import { SERVICE_CATEGORIES } from "@/lib/constants";

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

    transferLocation: string; // customer's address
    paymentslip?: string;
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

    const result = await getAvailableVehicles(startD, startT, endD, endT, SERVICE_CATEGORIES.AIRPORT_RENTAL);
    
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
    // 1. Get Service Category ID for "Airport Rental"
    const categories = await db.select().from(serviceCategory).where(eq(serviceCategory.categoryName, SERVICE_CATEGORIES.AIRPORT_RENTAL));
    const categoryId = categories[0]?.categoryId;

    if (!categoryId) {
        throw new Error(`Service category "${SERVICE_CATEGORIES.AIRPORT_RENTAL}" not found.`);
    }

    // 2. Map Transfer logic
    // Pickup: Airport -> Address
    // Drop: Address -> Airport
    const airportLabel = data.airport === "katunayaka" ? "BIA - Katunayaka" : "HRI - Mattala";
    const pickupLocation = data.transferType === "pickup" ? airportLabel : data.transferLocation;
    const dropoffLocation = data.transferType === "pickup" ? data.transferLocation : airportLabel;

    // 3. Map Timing
    const transferDate = data.transferType === "pickup" ? data.pickupDate : data.dropDate;
    const transferTime = data.transferType === "pickup" ? data.pickupTime : data.dropTime;
    const rentalDate = transferDate ? new Date(`${transferDate}T${transferTime || "00:00"}`) : new Date();

    const [result] = await db.insert(booking).values({
        serviceCategoryId: categoryId,
        userId: data.customerId,
        vehicleId: data.vehicleId,
        
        rentalDate: rentalDate,
        returnDate: null, // One-way transfer

        customerFullName: data.customerFullName,
        customerPhoneNumber1: data.customerPhone,
        customerPhoneNumber2: "", // Default for unified table
        customerLicenseNo: "N/A",  // Default for unified table
        customerNicNo: "N/A",      // Default for unified table
        customerAddress: data.transferLocation,

        pickupLocation: pickupLocation,
        dropoffLocation: dropoffLocation,

        distance: "0.00",
        totalFare: "0.00",

        numberOfTravelers: data.passengers,
        numberOfLuggages: data.luggageCount ?? 0,

        message: `Airport: ${data.airport.toUpperCase()} | Type: ${data.transferType.toUpperCase()}`,
        status: "PENDING",
        terms1: true,
        terms2Confirmation: true,
        paymentslip: data.paymentslip,
    });

    return (result as any).insertId as number;
}

/**
 * Fetch all airport bookings filtered by status (for employee/admin).
 */
export async function getAirportBookingsByStatus(status = "PENDING", employeeId?: number) {
    const categories = await db.select().from(serviceCategory).where(eq(serviceCategory.categoryName, SERVICE_CATEGORIES.AIRPORT_RENTAL));
    const categoryId = categories[0]?.categoryId;

    return db
        .select({
            id: booking.bookingId,
            pickupDate: booking.rentalDate,
            passengers: booking.numberOfTravelers,
            luggageCount: booking.numberOfLuggages,
            customerFullName: booking.customerFullName,
            customerPhone: booking.customerPhoneNumber1,

            transferLocation: booking.customerAddress,
            pickupLocation: booking.pickupLocation,
            dropoffLocation: booking.dropoffLocation,
            status: booking.status,
            rejectionReason: booking.rejectionReason,
            createdAt: booking.createdAt,
            handledByEmployeeId: booking.assignedEmployeeId,
            vehicleBrand: vehicleBrand.brandName,
            vehicleModel: vehicleModel.modelName,
            vehiclePlate: vehicle.plateNumber,
            vehicleImage: vehicle.vehicleImage,
            customerName: users.name,
            customerAccountEmail: users.email,
            handledByName: employee.name,
            paymentslip: booking.paymentslip,
        })
        .from(booking)
        .leftJoin(vehicle, eq(booking.vehicleId, vehicle.vehicleId))
        .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
        .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
        .leftJoin(users, eq(booking.userId, users.userId))
        .leftJoin(employee, eq(booking.assignedEmployeeId, employee.employeeId))
        .where(
            and(
                eq(booking.serviceCategoryId, categoryId),
                employeeId 
                    ? and(eq(booking.status, status), eq(booking.assignedEmployeeId, employeeId))
                    : eq(booking.status, status)
            )
        )
        .orderBy(booking.createdAt);
}

/**
 * Fetch all airport bookings regardless of status (for admin dashboard).
 */
export async function getAllAirportBookings() {
    const categories = await db.select().from(serviceCategory).where(eq(serviceCategory.categoryName, SERVICE_CATEGORIES.AIRPORT_RENTAL));
    const categoryId = categories[0]?.categoryId;

    return db
        .select({
            id: booking.bookingId,
            pickupDate: booking.rentalDate,
            passengers: booking.numberOfTravelers,
            luggageCount: booking.numberOfLuggages,
            customerFullName: booking.customerFullName,
            customerPhone: booking.customerPhoneNumber1,

            transferLocation: booking.customerAddress,
            pickupLocation: booking.pickupLocation,
            dropoffLocation: booking.dropoffLocation,
            status: booking.status,
            rejectionReason: booking.rejectionReason,
            createdAt: booking.createdAt,
            handledByEmployeeId: booking.assignedEmployeeId,
            vehicleBrand: vehicleBrand.brandName,
            vehicleModel: vehicleModel.modelName,
            vehiclePlate: vehicle.plateNumber,
            customerAccountEmail: users.email,
            handledByName: employee.name,
            paymentslip: booking.paymentslip,
        })
        .from(booking)
        .leftJoin(vehicle, eq(booking.vehicleId, vehicle.vehicleId))
        .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
        .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
        .leftJoin(users, eq(booking.userId, users.userId))
        .leftJoin(employee, eq(booking.assignedEmployeeId, employee.employeeId))
        .where(eq(booking.serviceCategoryId, categoryId))
        .orderBy(booking.createdAt);
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
        .update(booking)
        .set({
            status,
            rejectionReason: status === "REJECTED" ? (rejectionReason ?? null) : null,
            assignedEmployeeId: employeeId ?? null,
        })
        .where(eq(booking.bookingId, id));

    if (status === "ACCEPTED") {
        const [b] = await db.select({ vehicleId: booking.vehicleId }).from(booking).where(eq(booking.bookingId, id));
        if (b?.vehicleId) {
            await db.update(vehicle).set({ status: "UNAVAILABLE" }).where(eq(vehicle.vehicleId, b.vehicleId));
        }
    }
}

/**
 * Fetch airport bookings for a specific customer.
 */
export async function getCustomerAirportBookings(customerId: number) {
    const categories = await db.select().from(serviceCategory).where(eq(serviceCategory.categoryName, SERVICE_CATEGORIES.AIRPORT_RENTAL));
    const categoryId = categories[0]?.categoryId;

    return db
        .select({
            id: booking.bookingId,
            pickupDate: booking.rentalDate,
            passengers: booking.numberOfTravelers,
            luggageCount: booking.numberOfLuggages,
            transferLocation: booking.customerAddress,
            pickupLocation: booking.pickupLocation,
            dropoffLocation: booking.dropoffLocation,
            status: booking.status,
            rejectionReason: booking.rejectionReason,
            createdAt: booking.createdAt,
            vehicleBrand: vehicleBrand.brandName,
            vehicleModel: vehicleModel.modelName,
            vehiclePlate: vehicle.plateNumber,
            vehicleImage: vehicle.vehicleImage,
        })
        .from(booking)
        .leftJoin(vehicle, eq(booking.vehicleId, vehicle.vehicleId))
        .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
        .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
        .where(and(eq(booking.userId, customerId), eq(booking.serviceCategoryId, categoryId)))
        .orderBy(booking.createdAt);
}
