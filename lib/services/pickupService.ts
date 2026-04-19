import { db } from "@/lib/db";
import { 
    booking, 
    vehicle, 
    vehicleBrand, 
    vehicleModel, 
    serviceCategory, 
    users,
    employee 
} from "@/src/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { checkVehicleAvailability } from "../actions/availabilityActions";


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
    paymentslip?: string;
}

// ──────────────────────────────────────────────────────────────
// Helper: Category ID
// ──────────────────────────────────────────────────────────────

async function getPickupCategoryId(): Promise<number> {
    const [cat] = await db.select().from(serviceCategory).where(eq(serviceCategory.categoryName, SERVICE_CATEGORIES.PICKUPS));
    if (!cat) throw new Error(`Service category "${SERVICE_CATEGORIES.PICKUPS}" not found.`);
    return cat.categoryId;
}

// ──────────────────────────────────────────────────────────────
// Fare Calculation
// ──────────────────────────────────────────────────────────────

export function calculateFare(
    distanceKm: number,
    pricePerKm: number,
    isReturnTrip: boolean
): number {
    const base = distanceKm * pricePerKm;
    return isReturnTrip ? base * 2 : base;
}

export function estimateDistance(from: string, to: string): number {
    const str = `${from.toLowerCase().trim()}${to.toLowerCase().trim()}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash % 145) + 5;
}

// ──────────────────────────────────────────────────────────────
// Vehicle Search
// ──────────────────────────────────────────────────────────────

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
                eq(serviceCategory.categoryName, SERVICE_CATEGORIES.PICKUPS),
                eq(vehicle.status, "AVAILABLE"),
                gte(vehicle.seatingCapacity, travelers),
                // Exclude vehicles that are actively locked by another user
                sql`(
                    ${vehicle.isLocked} = 0
                    OR ${vehicle.lockExpiresAt} IS NULL
                    OR ${vehicle.lockExpiresAt} < NOW()
                )`
            )
        );

    return results;
}

// ──────────────────────────────────────────────────────────────
// Validation
// ──────────────────────────────────────────────────────────────

export interface ValidationError {
    field: string;
    message: string;
}

export function validatePickupBooking(data: PickupBookingData): ValidationError[] {
    const errors: ValidationError[] = [];
    if (data.travelers <= 0) {
        errors.push({ field: "travelers", message: "Traveler count must be at least 1." });
    }

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

// ──────────────────────────────────────────────────────────────
// Booking Creation (UnifiedTable)
// ──────────────────────────────────────────────────────────────

export async function createPickupBooking(data: PickupBookingData) {
    // 0. Check availability
    const checkEnd = data.isReturnTrip && data.returnTime ? data.returnTime : new Date(data.pickupTime.getTime() + 4 * 60 * 60 * 1000); 
    const isAvailable = await checkVehicleAvailability(data.vehicleId, data.pickupTime, checkEnd);
    if (!isAvailable) {
        throw new Error("This vehicle is no longer available for the selected dates.");
    }

    // 0.5 Check vehicle lock — block if locked by a different user
    const now = new Date();
    const [vLock] = await db.select({
        isLocked: vehicle.isLocked,
        lockedBy: vehicle.lockedBy,
        lockExpiresAt: vehicle.lockExpiresAt,
    }).from(vehicle).where(eq(vehicle.vehicleId, data.vehicleId));

    if (vLock && vLock.isLocked && vLock.lockExpiresAt && new Date(vLock.lockExpiresAt) > now) {
        if (vLock.lockedBy !== data.customerId) {
            throw new Error("This vehicle is currently being booked by another user. Please try again in a few minutes.");
        }
    }

    const categoryId = await getPickupCategoryId();

    const [result] = await db.insert(booking).values({
        serviceCategoryId: categoryId,
        userId: data.customerId,
        vehicleId: data.vehicleId,
        
        rentalDate: data.pickupTime,
        returnDate: data.isReturnTrip && data.returnTime ? data.returnTime : null,

        customerFullName: data.customerFullName,
        customerPhoneNumber1: data.customerPhone,
        customerPhoneNumber2: "", 
        customerLicenseNo: "N/A",  
        customerNicNo: "N/A",      
        customerAddress: data.pickupLocation, // Using pickup as address placeholder if needed

        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropLocation,

        distance: data.distanceKm.toFixed(2),
        totalFare: data.price.toFixed(2),

        numberOfTravelers: data.travelers,
        numberOfLuggages: data.luggageCount,

        message: `Pickup Trip | Return: ${data.isReturnTrip ? "YES" : "NO"}`,
        status: "PENDING",
        terms1: true,
        terms2Confirmation: data.isReturnTrip, // Map return trip flag here
        paymentslip: data.paymentslip,
    });

    const bookingId = (result as any).insertId as number;

    // Release vehicle lock after successful booking
    await db.update(vehicle)
        .set({ isLocked: false, lockedBy: null, lockExpiresAt: null })
        .where(eq(vehicle.vehicleId, data.vehicleId));

    return bookingId;
}


// ──────────────────────────────────────────────────────────────
// Read / Update
// ──────────────────────────────────────────────────────────────

export async function getPickupRequestsByStatus(status = "PENDING", employeeId?: number) {
    const categoryId = await getPickupCategoryId();

    return db
        .select({
            id: booking.bookingId,
            pickupLocation: booking.pickupLocation,
            dropLocation: booking.dropoffLocation,
            pickupTime: booking.rentalDate,
            returnTime: booking.returnDate,
            isReturnTrip: booking.terms2Confirmation,
            travelers: booking.numberOfTravelers,
            luggageCount: booking.numberOfLuggages,
            distanceKm: booking.distance,
            price: booking.totalFare,
            status: booking.status,
            rejectionReason: booking.rejectionReason,
            createdAt: booking.createdAt,
            customerFullName: booking.customerFullName,
            customerPhone: booking.customerPhoneNumber1,
            vehicleBrand: vehicleBrand.brandName,
            vehicleModel: vehicleModel.modelName,
            vehiclePlate: vehicle.plateNumber,
            customerEmail: users.email,
            paymentslip: booking.paymentslip,
        })
        .from(booking)
        .leftJoin(vehicle, eq(booking.vehicleId, vehicle.vehicleId))
        .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
        .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
        .leftJoin(users, eq(booking.userId, users.userId))
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

export async function updatePickupRequestStatus(
    id: number,
    status: "ACCEPTED" | "REJECTED",
    rejectionReason?: string,
    assignedEmployeeId?: number
) {
    await db
        .update(booking)
        .set({
            status,
            rejectionReason: status === "REJECTED" ? (rejectionReason ?? null) : null,
            assignedEmployeeId: assignedEmployeeId ?? undefined
        })
        .where(eq(booking.bookingId, id));
}

export async function getCustomerPickupHistory(customerId: number) {
    const categoryId = await getPickupCategoryId();

    return db
        .select({
            id: booking.bookingId,
            pickupLocation: booking.pickupLocation,
            dropLocation: booking.dropoffLocation,
            pickupTime: booking.rentalDate,
            returnTime: booking.returnDate,
            isReturnTrip: booking.terms2Confirmation,
            travelers: booking.numberOfTravelers,
            distanceKm: booking.distance,
            price: booking.totalFare,
            status: booking.status,
            rejectionReason: booking.rejectionReason,
            createdAt: booking.createdAt,
            vehicleBrand: vehicleBrand.brandName,
            vehicleModel: vehicleModel.modelName,
            vehiclePlate: vehicle.plateNumber,
        })
        .from(booking)
        .leftJoin(vehicle, eq(booking.vehicleId, vehicle.vehicleId))
        .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
        .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
        .where(and(eq(booking.userId, customerId), eq(booking.serviceCategoryId, categoryId)))
        .orderBy(booking.createdAt);
}
