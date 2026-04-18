"use server";

import { db } from "@/src/db";
import { 
    booking, vehicle, vehicleBrand, vehicleModel, users
} from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function getAssignmentDetails(category: string, id: number, employeeId: number) {
    try {
        const session = await getSession();
        if (!session) return { success: false, error: "Unauthorized" };

        const isAdminOrManager = session.role === "admin" || session.role === "manager";
        const isAssignedEmployee = session.role === "employee" && session.relatedId === employeeId;

        if (!isAdminOrManager && !isAssignedEmployee) {
            return { success: false, error: "Forbidden: You do not have permission to view these assignment details." };
        }

        if (category === "rent-a-car") {
            const [data] = await db.select({
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
                    and(eq(booking.bookingId, id), eq(booking.assignedEmployeeId, employeeId))
                );
            return { success: true, data };
        } 
        else if (category === "pickups") {
            const [data] = await db.select({
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
                createdAt: booking.createdAt,
                customerFullName: booking.customerFullName,
                customerPhone: booking.customerPhoneNumber1,
                vehicleBrand: vehicleBrand.brandName,
                vehicleModel: vehicleModel.modelName,
                vehiclePlate: vehicle.plateNumber,
            })
                .from(booking)
                .leftJoin(vehicle, eq(booking.vehicleId, vehicle.vehicleId))
                .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
                .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
                .where(
                    and(
                        eq(booking.bookingId, id),
                        eq(booking.assignedEmployeeId, employeeId)
                    )
                );
            return { success: true, data };
        } 
        else if (category === "airport") {
            const [data] = await db.select({
                id: booking.bookingId,
                pickupLocation: booking.pickupLocation,
                dropoffLocation: booking.dropoffLocation,
                transferDate: booking.rentalDate,
                status: booking.status,
                createdAt: booking.createdAt,
                customerFullName: booking.customerFullName,
                customerPhone: booking.customerPhoneNumber1,
                email: users.email,
                vehicleBrand: vehicleBrand.brandName,
                vehicleModel: vehicleModel.modelName,
                vehiclePlate: vehicle.plateNumber,
                message: booking.message,
            })
                .from(booking)
                .leftJoin(vehicle, eq(booking.vehicleId, vehicle.vehicleId))
                .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
                .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
                .leftJoin(users, eq(booking.userId, users.userId))
                .where(
                    and(eq(booking.bookingId, id), eq(booking.assignedEmployeeId, employeeId))
                );
            return { success: true, data };
        }
        else if (category === "wedding") {
            const [data] = await db.select({
                bookingId: booking.bookingId,
                customerName: booking.customerFullName,
                phone: booking.customerPhoneNumber1,
                email: booking.dropoffLocation,
                eventDate: booking.rentalDate,
                rentalDate: booking.rentalDate,
                pickupLocation: booking.pickupLocation,
                message: booking.message,
                status: booking.status,
                createdAt: booking.createdAt,
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
                .where(
                    and(
                        eq(booking.bookingId, id),
                        eq(booking.assignedEmployeeId, employeeId)
                    )
                );
            return { success: true, data };
        }
        return { success: false, error: "Invalid category" };
    } catch (error) {
        console.error("Error fetching assignment details:", error);
        return { success: false, error: "Failed to fetch details" };
    }
}
