"use server";

import { db } from "@/src/db";
import { booking, vehicle, vehicleBrand, vehicleModel, users, review } from "@/src/db/schema";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { eq, and, desc } from "drizzle-orm";
import { validateNIC } from "@/lib/validation";
import { sendNotification, notifyAdmins } from "./notificationActions";
import { sendBookingStatusEmail } from "@/lib/email";
import { checkVehicleAvailability } from "./availabilityActions";

// Helper to upload file to Cloudinary
export async function saveFileToCloudinary(file: File | null, folder: string): Promise<string | null> {
    if (!file || file.size === 0) return null;

    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const { uploadToCloudinary } = await import("@/lib/cloudinary");
        
        // Use 'image' for PDFs as Cloudinary handles them as documents this way, 
        // allowing browser viewing and transformations. 'raw' often forces download.
        const isPDF = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
        const resourceType = isPDF ? "image" : "image"; 
        
        const result = await uploadToCloudinary(buffer, `bookings/${folder}`, resourceType);
        return result.secure_url;
    } catch (error: unknown) {
        console.error("Cloudinary upload error:", error);
        return null;
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

        const customerAddress = formData.get("customerAddress") as string;

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

        // Process Files - Now receiving URLs from frontend directly
        const licensePath = formData.get("customerLicensePdf") as string | null;
        const idPath = formData.get("customerIdPdf") as string | null;
        const gNicPath = formData.get("guaranteeNicPdf") as string | null;
        const gLicensePath = formData.get("guaranteeLicensePdf") as string | null;
        const paymentslipPath = formData.get("paymentslip") as string | null;

        // Check availability before creating booking
        const isAvailable = await checkVehicleAvailability(vehicleId, new Date(rentalDate), new Date(returnDate));
        if (!isAvailable) {
            return { success: false, error: "This vehicle is no longer available for the selected dates. Someone else might have just booked it." };
        }

        // Log data for debugging
        console.log("Creating booking with files:", {
            userId,
            vehicleId,
            licensePath,
            idPath,
            paymentslipPath
        });

        // Insert into database — capture insertId for notification
        const [insertResult] = await (db.insert(booking) as any).values({
            userId: userId,
            vehicleId: vehicleId,
            serviceCategoryId: serviceCategoryId,
            rentalDate: new Date(rentalDate),
            returnDate: new Date(returnDate),
            customerFullName,
            customerPhoneNumber1: customerPhone1,
            customerLicenseNo,
            customerNicNo,
            customerAddress,
            customerDrivingLicencePdf: licensePath,
            customerIdPdf: idPath,
            guaranteeFullname,
            guaranteeAddress,
            guaranteePhoneNo1: guaranteePhone1,
            guaranteeNicNo,
            guaranteeNicPdf: gNicPath,
            guaranteeLicensePdf: gLicensePath,
            totalFare: totalFare,
            status: "PENDING",
            terms1: true,
            terms2Confirmation: true,
            paymentslip: paymentslipPath,
        });

        const newBookingId: number | undefined = (insertResult as any)?.insertId;

        revalidatePath("/admin/bookings/requested");

        // Notify Admins — include bookingId and serviceType for navigation
        await notifyAdmins(
            `New Rent-a-Car booking request from ${customerFullName}${newBookingId ? ` (#${newBookingId})` : ""}`,
            newBookingId,
            "rent-a-car"
        );
        return { success: true, bookingId: newBookingId };
    } catch (error) {
        console.error("Booking creation error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to process your booking request";
        return { success: false, error: errorMessage };
    }
}

export async function getPendingBookings(employeeId?: number) {
    try {
        const results = await db.select({
            bookingId: booking.bookingId,
            customerName: booking.customerFullName,
            customerAddress: booking.customerAddress,
            phone: booking.customerPhoneNumber1,
            nic: booking.customerNicNo,
            license: booking.customerLicenseNo,
            rentalDate: booking.rentalDate,
            returnDate: booking.returnDate,
            totalFare: booking.totalFare,
            status: booking.status,
            rejectionReason: booking.rejectionReason,
            createdAt: booking.createdAt,
            terms1: booking.terms1,
            guaranteeFullname: booking.guaranteeFullname,
            guaranteeAddress: booking.guaranteeAddress,
            guaranteePhoneNo1: booking.guaranteePhoneNo1,
            guaranteeNicNo: booking.guaranteeNicNo,
            guaranteeLicensePdf: booking.guaranteeLicensePdf,
            paymentslip: booking.paymentslip,
            email: users.email,
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
            .leftJoin(users, eq(booking.userId, users.userId))
            .where(
                employeeId
                    ? and(eq(booking.status, "PENDING"), eq(booking.assignedEmployeeId, employeeId))
                    : eq(booking.status, "PENDING")
            )
            .orderBy(booking.createdAt);

        return { success: true, data: results };
    } catch (error) {
        console.error("Error fetching pending bookings:", error);
        return { success: false, error: "Failed to fetch bookings" };
    }
}

export async function getAssignedBookings(employeeId: number) {
    try {
        const results = await db.select({
            bookingId: booking.bookingId,
            customerName: booking.customerFullName,
            customerAddress: booking.customerAddress,
            phone: booking.customerPhoneNumber1,
            nic: booking.customerNicNo,
            license: booking.customerLicenseNo,
            rentalDate: booking.rentalDate,
            returnDate: booking.returnDate,
            totalFare: booking.totalFare,
            status: booking.status,
            rejectionReason: booking.rejectionReason,
            createdAt: booking.createdAt,
            terms1: booking.terms1,
            guaranteeFullname: booking.guaranteeFullname,
            guaranteeAddress: booking.guaranteeAddress,
            guaranteePhoneNo1: booking.guaranteePhoneNo1,
            guaranteeNicNo: booking.guaranteeNicNo,
            guaranteeLicensePdf: booking.guaranteeLicensePdf,
            paymentslip: booking.paymentslip,
            email: users.email,
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
            .leftJoin(users, eq(booking.userId, users.userId))
            .where(
                and(eq(booking.status, "ACCEPTED"), eq(booking.assignedEmployeeId, employeeId))
            )
            .orderBy(booking.createdAt);

        return { success: true, data: results };
    } catch (error) {
        console.error("Error fetching assigned bookings:", error);
        return { success: false, error: "Failed to fetch assigned bookings" };
    }
}


export async function updateBookingStatus(bookingId: number, status: "ACCEPTED" | "REJECTED", formData?: FormData, assignedEmployeeId?: number) {
    try {
        await db.update(booking)
            .set({ 
                status: status, 
                rejectionReason: formData?.get("rejectionReason") as string,
                assignedEmployeeId: assignedEmployeeId ?? undefined
            })
            .where(eq(booking.bookingId, bookingId));

        revalidatePath("/admin/bookings/requested");
        revalidatePath("/employee/assigned");

        // Handle Notifications & Vehicle Status
        const [b] = await db.select().from(booking).where(eq(booking.bookingId, bookingId));
        if (b) {
            if (status === "ACCEPTED" && b.vehicleId) {
                await db.update(vehicle).set({ status: "UNAVAILABLE" }).where(eq(vehicle.vehicleId, b.vehicleId));
            }

            const [u] = await db.select({ email: users.email, name: users.name })
                .from(users).where(eq(users.userId, b.userId!));

            // Fetch vehicle details for the email
            const [v] = await db.select({
                brand: vehicleBrand.brandName,
                model: vehicleModel.modelName,
                plateNumber: vehicle.plateNumber,
                transmission: vehicle.transmission,
                fuelType: vehicle.fuelType,
            })
            .from(vehicle)
            .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
            .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
            .where(eq(vehicle.vehicleId, b.vehicleId!));

            const vehicleSpecs = v ? {
                brand: v.brand ?? "",
                model: v.model ?? "",
                plateNumber: v.plateNumber,
                transmission: v.transmission,
                fuelType: v.fuelType,
            } : undefined;

            const bookingDetails = {
                rentalDate: b.rentalDate || undefined,
                returnDate: b.returnDate || undefined,
                pickupLocation: b.pickupLocation || undefined,
                dropoffLocation: b.dropoffLocation || undefined,
                totalFare: b.totalFare || undefined,
                message: b.message || undefined
            };

            if (status === "ACCEPTED") {
                // 1. Notify Customer — in-app + email
                if (b.userId) {
                    try { await sendNotification(b.userId, `Your Rent-a-Car booking (#${bookingId}) has been ACCEPTED.`, bookingId, "rent-a-car"); }
                    catch (e) { console.error("Notification error:", e); }
                    try { 
                        if (u?.email) {
                            await sendBookingStatusEmail(
                                u.email, 
                                u.name ?? "Customer", 
                                bookingId, 
                                "Rent-a-Car", 
                                "ACCEPTED", 
                                undefined,
                                vehicleSpecs,
                                bookingDetails
                            ); 
                        }
                    }
                    catch (e) { console.error("Email error:", e); }
                }
                // 2. Notify Assigned Employee — serviceType enables navigation to booking detail
                if (assignedEmployeeId) {
                    try {
                        const [empUser] = await db.select({ id: users.userId }).from(users).where(eq(users.relatedId, assignedEmployeeId));
                        if (empUser) await sendNotification(empUser.id, `New Booking Assigned - Rent-a-Car booking #${bookingId}`, bookingId, "rent-a-car");
                    } catch (e) { console.error("Employee notification error:", e); }
                }
            } else if (status === "REJECTED") {
                // Notify Customer — in-app + email
                if (b.userId) {
                    const reason = formData?.get("rejectionReason") as string | undefined;
                    try { await sendNotification(b.userId, `Your Rent-a-Car booking (#${bookingId}) has been REJECTED.`, bookingId, "rent-a-car"); }
                    catch (e) { console.error("Notification error:", e); }
                    try { 
                        if (u?.email) {
                            await sendBookingStatusEmail(
                                u.email, 
                                u.name ?? "Customer", 
                                bookingId, 
                                "Rent-a-Car", 
                                "REJECTED", 
                                reason ?? undefined,
                                vehicleSpecs,
                                bookingDetails
                            ); 
                        }
                    }
                    catch (e) { console.error("Email error:", e); }
                }
            }
        }

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
            gLicense: booking.guaranteeLicensePdf,
            paymentslip: booking.paymentslip
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
                gLicense: docs.gLicense,
                paymentslip: docs.paymentslip
            }
        };
    } catch (error) {
        console.error("Error fetching documents:", error);
        return { success: false, error: "Failed to fetch documents" };
    }
}

export async function getCustomerBookings() {
    try {
        const session = await getSession();
        if (!session) return { success: false, error: "Unauthorized" };

        const results = await db.select({
            bookingId: booking.bookingId,
            vehicleId: booking.vehicleId,
            rentalDate: booking.rentalDate,
            returnDate: booking.returnDate,
            totalFare: booking.totalFare,
            status: booking.status,
            createdAt: booking.createdAt,
            vehicle: {
                brand: vehicleBrand.brandName,
                model: vehicleModel.modelName,
                image: vehicle.vehicleImage,
            },
            review: {
                reviewId: review.reviewId
            }
        })
        .from(booking)
        .leftJoin(vehicle, eq(booking.vehicleId, vehicle.vehicleId))
        .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
        .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
        .leftJoin(review, eq(booking.bookingId, review.bookingId))
        .where(eq(booking.userId, session.userId))
        .orderBy(desc(booking.createdAt));

        return { success: true, data: results };
    } catch (error) {
        console.error("Error fetching customer bookings:", error);
        return { success: false, error: "Failed to fetch bookings" };
    }
}
