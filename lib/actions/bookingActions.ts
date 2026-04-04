"use server";

import { db } from "@/lib/db";
import { booking, vehicle, vehicleBrand, vehicleModel } from "@/src/db/schema";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { validateNIC } from "@/lib/validation";
import { v4 as uuidv4 } from "uuid";

// Helper to upload file to Cloudinary
async function saveFileToCloudinary(file: File | null, folder: string): Promise<string | null> {
    if (!file || file.size === 0) return null;

    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        // Use the new helper
        // We need to import it dynamically or at the top if we change imports
        // But since this is a server action file, dynamic import is cleaner if we want to avoid top-level issues, 
        // though top-level is better. I'll add the import in a separate chunk.
        // For now, let's assume I'll add the import.
        const { uploadToCloudinary } = await import("@/lib/cloudinary");
        const result = await uploadToCloudinary(buffer, `bookings/${folder}`, "auto");
        return result.secure_url;
    } catch (error: any) {
        console.error("Cloudinary upload error:", error);
        throw new Error(`Failed to upload document: ${error.message || "Unknown error"}`);
    }
}

export async function createBooking(formData: FormData) {
    try {
        const session = await getSession();
        if (!session) {
            return { success: false, error: "Authentication required" };
        }

        // Extract basic details
        const userId = session.userId;
        const vehicleId = parseInt(formData.get("vehicleId") as string);
        const serviceCategoryId = parseInt(formData.get("serviceCategoryId") as string);

        const rentalDate = formData.get("rental_date") as string;
        const returnDate = formData.get("return_date") as string;

        const customerFullName = formData.get("customerFullName") as string;
        const customerPhone1 = formData.get("customerPhone1") as string;
        const customerLicenseNo = formData.get("customerLicenseNo") as string;
        const customerNicNo = formData.get("customerNicNo") as string;

        const guaranteeFullname = formData.get("guaranteeFullname") as string;
        const guaranteeAddress = formData.get("guaranteeAddress") as string;
        const guaranteePhone1 = formData.get("guaranteePhone1") as string;
        const guaranteeNicNo = formData.get("guaranteeNicNo") as string;

        const totalFareStr = formData.get("totalPrice") as string;
        const totalFare = totalFareStr ? parseFloat(totalFareStr).toFixed(2) : "0.00";

        // Validate required fields
        if (!vehicleId || !userId) {
            return { success: false, error: "Missing vehicle or user information" };
        }

        // Backend Validation
        const customerNicValidation = validateNIC(customerNicNo);
        if (customerNicNo && !customerNicValidation.valid) {
            return { success: false, error: `Hirer NIC: ${customerNicValidation.error}` };
        }
        const guaranteeNicValidation = validateNIC(guaranteeNicNo);
        if (guaranteeNicNo && !guaranteeNicValidation.valid) {
            return { success: false, error: `Guarantor NIC: ${guaranteeNicValidation.error}` };
        }

        // Process Files - Upload to Cloudinary
        const licensePath = await saveFileToCloudinary(formData.get("customerLicensePdf") as File, "license");
        const idPath = await saveFileToCloudinary(formData.get("customerIdPdf") as File, "id");
        const gNicPath = await saveFileToCloudinary(formData.get("guaranteeNicPdf") as File, "guarantor-nic");
        const gLicensePath = await saveFileToCloudinary(formData.get("guaranteeLicensePdf") as File, "guarantor-license");

        // Log data for debugging
        console.log("Creating booking with files:", {
            userId,
            vehicleId,
            licensePath,
            idPath
        });

        // Insert into database
        await (db.insert(booking) as any).values({
            userId: userId,
            vehicleId: vehicleId,
            serviceCategoryId: serviceCategoryId,
            rentalDate: new Date(rentalDate),
            returnDate: new Date(returnDate),
            customerFullName,
            customerPhoneNumber1: customerPhone1,
            customerLicenseNo,
            customerNicNo,
            customerDrivingLicencePdf: licensePath,
            customerIdPdf: idPath,
            guaranteeFullname,
            guaranteeAddress,
            guaranteePhoneNo1: guaranteePhone1,
            guaranteeNicNo,
            guaranteeNicPdf: gNicPath,
            guaranteeLicensePdf: gLicensePath,
            totalFare: totalFare,
            bookingStatus: "PENDING",
            terms1: true,
            terms2Confirmation: true,
        });

        revalidatePath("/admin/bookings/requested");

        return { success: true };
    } catch (error) {
        console.error("Booking creation error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to process your booking request";
        return { success: false, error: errorMessage };
    }
}

export async function getPendingBookings() {
    try {
        const results = await db.select({
            bookingId: booking.bookingId,
            customerName: booking.customerFullName,
            phone: booking.customerPhoneNumber1,
            nic: booking.customerNicNo,
            license: booking.customerLicenseNo,
            rentalDate: booking.rentalDate,
            returnDate: booking.returnDate,
            totalFare: booking.totalFare,
            status: booking.bookingStatus,
            rejectionReason: booking.rejectionReason,
            vehicle: {
                brand: vehicleBrand.brandName,
                model: vehicleModel.modelName,
                plateNumber: vehicle.plateNumber
            }
        })
            .from(booking)
            .leftJoin(vehicle, eq(booking.vehicleId, vehicle.vehicleId))
            .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
            .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
            .where(eq(booking.bookingStatus, "PENDING"))
            .orderBy(booking.createdAt);

        return { success: true, data: results };
    } catch (error) {
        console.error("Error fetching pending bookings:", error);
        return { success: false, error: "Failed to fetch bookings" };
    }
}

export async function updateBookingStatus(bookingId: number, status: "ACCEPTED" | "REJECTED", formData?: FormData) {
    try {
        await db.update(booking)
            .set({ bookingStatus: status, rejectionReason: formData?.get("rejectionReason") as string })
            .where(eq(booking.bookingId, bookingId));

        revalidatePath("/admin/bookings/requested");
        revalidatePath("/employee/bookings/requested");
        return { success: true };
    } catch (error) {
        console.error("Error updating booking status:", error);
        return { success: false, error: "Failed to update status" };
    }
}

export async function getBookingDocuments(bookingId: number) {
    try {
        const [docs] = await db.select({
            license: booking.customerDrivingLicencePdf,
            customerID: booking.customerIdPdf,
            nic: booking.guaranteeNicPdf,
            gLicense: booking.guaranteeLicensePdf
        })
            .from(booking)
            .where(eq(booking.bookingId, bookingId));

        if (!docs) return { success: false, error: "Documents not found" };

        return {
            success: true,
            data: {
                license: docs.license,
                customerID: docs.customerID,
                nic: docs.nic,
                gLicense: docs.gLicense
            }
        };
    } catch (error) {
        console.error("Error fetching documents:", error);
        return { success: false, error: "Failed to fetch documents" };
    }
}
