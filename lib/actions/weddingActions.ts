"use server";

import { db } from "@/lib/db";
import { vehicle, vehicleBrand, vehicleModel, serviceCategory, booking, notification } from "@/src/db/schema";
import { eq, desc, and, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ----------------------------------------------------------------------------
// Helper: Get or create "Wedding Car Rental" category
// ----------------------------------------------------------------------------
async function getWeddingCategoryId(): Promise<number> {
    const categoryName = "Wedding Car Rental";
    const [existing] = await db.select().from(serviceCategory).where(eq(serviceCategory.categoryName, categoryName));
    if (existing) return existing.categoryId;

    const [result] = await db.insert(serviceCategory).values({ categoryName });
    return (result as any).insertId;
}

// ----------------------------------------------------------------------------
// Fetch Actions
// ----------------------------------------------------------------------------

export async function getWeddingCars() {
    try {
        const vehicles = await db.select({
            vehicleId: vehicle.vehicleId,
            brand: vehicleBrand.brandName,
            model: vehicleModel.modelName,
            plateNumber: vehicle.plateNumber,
            seatingCapacity: vehicle.seatingCapacity,
            luggageCapacity: vehicle.luggageCapacity,
            transmissionType: vehicle.transmission,
            fuelType: vehicle.fuelType,
            rentPerDay: vehicle.rentPerDay,
            status: vehicle.status,
            serviceCategory: serviceCategory.categoryName,
            image: vehicle.vehicleImage,
            description: vehicle.description,
        })
            .from(vehicle)
            .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
            .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
            .innerJoin(serviceCategory, eq(vehicle.categoryId, serviceCategory.categoryId))
            .where(eq(serviceCategory.categoryName, "Wedding Car Rental"))
            .orderBy(desc(vehicle.vehicleId));

        return { success: true, data: vehicles };
    } catch (error: any) {
        console.error("Error fetching wedding cars:", error);
        return { success: false, error: "Failed to fetch wedding cars" };
    }
}

export async function getWeddingCarById(id: number) {
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
            rentPerDay: vehicle.rentPerDay,
            rentPerHour: vehicle.rentPerHour,
            status: vehicle.status,
            serviceCategory: serviceCategory.categoryName,
            image: vehicle.vehicleImage,
            description: vehicle.description,
        })
            .from(vehicle)
            .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
            .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
            .leftJoin(serviceCategory, eq(vehicle.categoryId, serviceCategory.categoryId))
            .where(eq(vehicle.vehicleId, id));

        if (!v) return { success: false, error: "Vehicle not found" };
        return { success: true, data: v };
    } catch (error: any) {
        console.error("Error fetching wedding car by id:", error);
        return { success: false, error: "Failed to fetch vehicle details" };
    }
}

// ----------------------------------------------------------------------------
// Wedding Inquiry Actions
// ----------------------------------------------------------------------------

export async function createWeddingCarInquiry(data: {
    vehicleId: number;
    customerName: string;
    email: string;
    phone: string;
    eventDate: string;
    pickupLocation: string;
    message?: string;
}) {
    try {
        const weddingCategoryId = await getWeddingCategoryId();

        // Insert inquiry into booking table
        const [result] = await (db.insert(booking) as any).values({
            vehicleId: data.vehicleId,
            serviceCategoryId: weddingCategoryId,
            customerFullName: data.customerName,
            customerPhoneNumber1: data.phone,
            dropoffLocation: data.email, // Store email in dropoffLocation (varchar 255)
            rentalDate: new Date(data.eventDate),
            returnDate: new Date(data.eventDate), // Same day for wedding
            pickupLocation: data.pickupLocation,
            message: data.message || null, // Use the new message column
            customerLicenseNo: "N/A",
            customerNicNo: "N/A",
            bookingStatus: "WEDDING_INQUIRY",
            terms1: true,
            terms2Confirmation: true,
        });

        const bookingId = (result as any).insertId;

        // Create notification for admin
        await db.insert(notification).values({
            bookingId: bookingId,
            message: `New wedding car inquiry from ${data.customerName} for event on ${data.eventDate}`,
            notificationDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
            status: "UNREAD"
        });

        revalidatePath("/admin/bookings/wedding-requests");
        return { success: true };
    } catch (error: any) {
        console.error("Error creating wedding inquiry:", error);
        return { success: false, error: error.message || "Failed to submit inquiry" };
    }
}

export async function getWeddingCarInquiries() {
    try {
        const results = await db.select({
            bookingId: booking.bookingId,
            customerName: booking.customerFullName,
            email: booking.dropoffLocation, // Email stored in dropoffLocation
            phone: booking.customerPhoneNumber1,
            eventDate: booking.rentalDate,
            pickupLocation: booking.pickupLocation,
            message: booking.message, // Use the new message column
            status: booking.bookingStatus,
            createdAt: booking.createdAt,
            vehicle: {
                brand: vehicleBrand.brandName,
                model: vehicleModel.modelName,
                plateNumber: vehicle.plateNumber,
                image: vehicle.vehicleImage,
            }
        })
            .from(booking)
            .leftJoin(vehicle, eq(booking.vehicleId, vehicle.vehicleId))
            .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
            .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
            .where(eq(booking.bookingStatus, "WEDDING_INQUIRY"))
            .orderBy(desc(booking.createdAt));

        return { success: true, data: results };
    } catch (error: any) {
        console.error("Error fetching wedding inquiries:", error);
        return { success: false, error: "Failed to fetch wedding inquiries" };
    }
}

export async function markWeddingInquiryContacted(bookingId: number) {
    try {
        await db.update(booking)
            .set({ bookingStatus: "WEDDING_CONTACTED" })
            .where(eq(booking.bookingId, bookingId));

        revalidatePath("/admin/bookings/wedding-requests");
        revalidatePath("/admin/bookings/requested");
        revalidatePath("/employee/bookings/requested");
        return { success: true };
    } catch (error: any) {
        console.error("Error updating wedding inquiry:", error);
        return { success: false, error: "Failed to update inquiry status" };
    }
}

// ----------------------------------------------------------------------------
// Admin: Manage Wedding Vehicle Assignments
// ----------------------------------------------------------------------------

export async function addVehicleToWeddingCategory(vehicleId: number) {
    try {
        const weddingCategoryId = await getWeddingCategoryId();

        await db.update(vehicle)
            .set({ categoryId: weddingCategoryId })
            .where(eq(vehicle.vehicleId, vehicleId));

        revalidatePath("/admin/vehicles/wedding-cars");
        return { success: true };
    } catch (error: any) {
        console.error("Error adding vehicle to wedding category:", error);
        return { success: false, error: "Failed to add vehicle to wedding category" };
    }
}

export async function removeVehicleFromWeddingCategory(vehicleId: number) {
    try {
        // Get or create "Rent a Car" as the default fallback category
        const [rentCategory] = await db.select().from(serviceCategory).where(eq(serviceCategory.categoryName, "Rent a Car"));
        const fallbackCategoryId = rentCategory ? rentCategory.categoryId : 1;

        await db.update(vehicle)
            .set({ categoryId: fallbackCategoryId })
            .where(eq(vehicle.vehicleId, vehicleId));

        revalidatePath("/admin/vehicles/wedding-cars");
        revalidatePath("/admin/vehicles/rent-a-car");
        return { success: true };
    } catch (error: any) {
        console.error("Error removing vehicle from wedding category:", error);
        return { success: false, error: "Failed to remove vehicle from wedding category" };
    }
}

export async function getNonWeddingVehicles() {
    try {
        const weddingCategoryId = await getWeddingCategoryId();

        const vehicles = await db.select({
            vehicleId: vehicle.vehicleId,
            brand: vehicleBrand.brandName,
            model: vehicleModel.modelName,
            plateNumber: vehicle.plateNumber,
            seatingCapacity: vehicle.seatingCapacity,
            status: vehicle.status,
            serviceCategory: serviceCategory.categoryName,
            image: vehicle.vehicleImage,
        })
            .from(vehicle)
            .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
            .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
            .innerJoin(serviceCategory, eq(vehicle.categoryId, serviceCategory.categoryId))
            .where(ne(vehicle.categoryId, weddingCategoryId))
            .orderBy(desc(vehicle.vehicleId));

        return { success: true, data: vehicles };
    } catch (error: any) {
        console.error("Error fetching non-wedding vehicles:", error);
        return { success: false, error: "Failed to fetch vehicles" };
    }
}
