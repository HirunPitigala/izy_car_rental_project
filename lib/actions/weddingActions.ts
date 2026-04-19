"use server";

import { db } from "@/lib/db";
import { vehicle, vehicleBrand, vehicleModel, serviceCategory, booking, notification, users } from "@/src/db/schema";
import { eq, desc, and, ne, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { notifyAdmins, sendNotification } from "./notificationActions";

import { SERVICE_CATEGORIES } from "@/lib/constants";
import { checkVehicleAvailability } from "./availabilityActions";

// ----------------------------------------------------------------------------
// Helper: Get or create "Wedding Car Rental" category
// ----------------------------------------------------------------------------
async function getWeddingCategoryId(): Promise<number> {
    const categoryName = SERVICE_CATEGORIES.WEDDING_CAR_RENTAL;
    const [existing] = await db.select().from(serviceCategory).where(eq(serviceCategory.categoryName, categoryName));
    if (existing) return existing.categoryId;

    const [result] = await db.insert(serviceCategory).values({ categoryName });
    return (result as any).insertId;
}

// ----------------------------------------------------------------------------
// Fetch Actions
// ----------------------------------------------------------------------------

export async function getWeddingCars(onlyAvailable: boolean = false) {
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
            .where(
                and(
                    eq(serviceCategory.categoryName, SERVICE_CATEGORIES.WEDDING_CAR_RENTAL),
                    onlyAvailable ? eq(vehicle.status, "AVAILABLE") : undefined
                )
            )
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
    userId: number;
    customerName: string;
    email: string;
    phone: string;
    eventDate: string;
    pickupLocation: string;
    message?: string;
}) {
    try {
        const session = await getSession();
        if (!session) return { success: false, error: "Authentication required" };

        // Check availability
        const eventDateObj = new Date(data.eventDate);
        const eventDateEnd = new Date(eventDateObj.getTime() + 24 * 60 * 60 * 1000 - 1000); // End of the day
        const isAvailable = await checkVehicleAvailability(data.vehicleId, eventDateObj, eventDateEnd);
        if (!isAvailable) {
            return { success: false, error: "This vehicle is already booked for the selected date." };
        }

        const weddingCategoryId = await getWeddingCategoryId();

        // Insert inquiry into booking table
        const [result] = await (db.insert(booking) as any).values({
            vehicleId: data.vehicleId,
            userId: data.userId,
            serviceCategoryId: weddingCategoryId,
            customerFullName: data.customerName,
            customerPhoneNumber1: data.phone,
            dropoffLocation: data.email, // Store email in dropoffLocation (varchar 255)
            rentalDate: new Date(data.eventDate),
            returnDate: new Date(data.eventDate), // Same day for wedding
            pickupLocation: data.pickupLocation,
            distance: "0.00",
            totalFare: "0.00",
            message: data.message || null, // Use the new message column
            customerLicenseNo: "N/A",
            customerNicNo: "N/A",
            status: "WEDDING_INQUIRY",
            terms1: true,
            terms2Confirmation: true,
        });

        const bookingId = (result as any).insertId;

        // Notify Admins
        await notifyAdmins(`New wedding car inquiry from ${data.customerName} for event on ${data.eventDate}`, bookingId);

        revalidatePath("/admin/bookings/wedding-requests");
        return { success: true };
    } catch (error: any) {
        console.error("Error creating wedding inquiry:", error);
        return { success: false, error: error.message || "Failed to submit inquiry" };
    }
}

export async function getWeddingCarInquiries() {
    try {
        const session = await getSession();
        if (!session || (session.role !== "admin" && session.role !== "manager")) {
            return { success: false, error: "Unauthorized" };
        }

        const results = await db.select({
            bookingId: booking.bookingId,
            customerName: booking.customerFullName,
            email: booking.dropoffLocation, // Email stored in dropoffLocation
            phone: booking.customerPhoneNumber1,
            eventDate: booking.rentalDate,
            pickupLocation: booking.pickupLocation,
            message: booking.message, // Use the new message column
            status: booking.status,
            createdAt: booking.createdAt,
            vehicle: {
                brand: vehicleBrand.brandName,
                model: vehicleModel.modelName,
                plateNumber: vehicle.plateNumber,
                image: vehicle.vehicleImage,
            }
        })
            .from(booking)
            .innerJoin(vehicle, eq(booking.vehicleId, vehicle.vehicleId))
            .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
            .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
            .where(inArray(booking.status, ["WEDDING_INQUIRY", "WEDDING_CONTACTED"]))
            .orderBy(desc(booking.createdAt));

        return { success: true, data: results };
    } catch (error: any) {
        console.error("Error fetching wedding inquiries:", error);
        return { success: false, error: "Failed to fetch wedding inquiries" };
    }
}

export async function markWeddingInquiryContacted(bookingId: number) {
    try {
        const session = await getSession();
        if (!session || (session.role !== "admin" && session.role !== "manager")) {
            return { success: false, error: "Unauthorized" };
        }

        await db.update(booking)
            .set({ status: "WEDDING_CONTACTED" })
            .where(eq(booking.bookingId, bookingId));

        // Notify Customer
        const [b] = await db.select().from(booking).where(eq(booking.bookingId, bookingId));
        if (b && b.userId) {
            await sendNotification(b.userId, `Your wedding car inquiry (#${bookingId}) has been marked as CONTACTED. Our team will reach out to you soon.`, bookingId);
        }

        revalidatePath("/admin/bookings/requested");
        return { success: true };
    } catch (error: any) {
        console.error("Error updating wedding inquiry:", error);
        return { success: false, error: "Failed to update inquiry status" };
    }
}

export async function acceptWeddingInquiry(bookingId: number, employeeId: number) {
    try {
        const session = await getSession();
        if (!session || (session.role !== "admin" && session.role !== "manager")) {
            return { success: false, error: "Unauthorized" };
        }

        await db.update(booking)
            .set({ 
                status: "ACCEPTED",
                assignedEmployeeId: employeeId 
            })
            .where(eq(booking.bookingId, bookingId));

        // Notify Customer
        const [b] = await db.select().from(booking).where(eq(booking.bookingId, bookingId));
        if (b && b.userId) {
            await sendNotification(b.userId, `Your wedding car booking (#${bookingId}) has been ACCEPTED and confirmed!`, bookingId);
        }

        // Notify Employee
        const [empUser] = await db.select({ id: users.userId }).from(users).where(eq(users.relatedId, employeeId));
        if (empUser) {
            await sendNotification(empUser.id, `New Wedding Booking Assigned (#${bookingId}). Please perform necessary pre-rental inspections.`, bookingId, "wedding");
        }

        revalidatePath("/admin/bookings/requested");
        revalidatePath("/employee/assigned");
        return { success: true };
    } catch (error: any) {
        console.error("Error accepting wedding inquiry:", error);
        return { success: false, error: "Failed to accept booking" };
    }
}

export async function getAssignedWeddingBookings(employeeId: number) {
    try {
        const session = await getSession();
        if (!session || (session.role !== "admin" && session.role !== "manager" && session.role !== "employee")) {
            return { success: false, error: "Unauthorized" };
        }

        const results = await db.select({
            bookingId: booking.bookingId,
            customerName: booking.customerFullName,
            phone: booking.customerPhoneNumber1,
            eventDate: booking.rentalDate,
            rentalDate: booking.rentalDate,
            pickupLocation: booking.pickupLocation,
            status: booking.status,
            createdAt: booking.createdAt,
            vehicle: {
                brand: vehicleBrand.brandName,
                model: vehicleModel.modelName,
                plateNumber: vehicle.plateNumber,
                image: vehicle.vehicleImage,
            }
        })
            .from(booking)
            .innerJoin(vehicle, eq(booking.vehicleId, vehicle.vehicleId))
            .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
            .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
            .where(
                and(
                    eq(booking.status, "ACCEPTED"),
                    eq(booking.assignedEmployeeId, employeeId),
                    eq(booking.serviceCategoryId, await getWeddingCategoryId())
                )
            )
            .orderBy(desc(booking.createdAt));

        return { success: true, data: results };
    } catch (error: any) {
        console.error("Error fetching assigned weddings:", error);
        return { success: false, error: "Failed to fetch assignments" };
    }
}

// ----------------------------------------------------------------------------
// Admin: Manage Wedding Vehicle Assignments
// ----------------------------------------------------------------------------

export async function addVehicleToWeddingCategory(vehicleId: number) {
    try {
        const session = await getSession();
        if (!session || session.role !== "admin") {
            return { success: false, error: "Unauthorized" };
        }

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
        const session = await getSession();
        if (!session || session.role !== "admin") {
            return { success: false, error: "Unauthorized" };
        }

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
        const session = await getSession();
        if (!session || session.role !== "admin") {
            return { success: false, error: "Unauthorized" };
        }

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
