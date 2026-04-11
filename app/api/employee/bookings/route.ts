import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/src/db";
import {
    booking,
    vehicle,
    vehicleBrand,
    vehicleModel,
    pickupRequests,
    airportBookings,
} from "@/src/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * GET /api/employee/bookings?serviceType=rent-a-car|pickup|airport-transfer
 *
 * Returns ACCEPTED bookings assigned to the logged-in employee for a given service type.
 * Queries different tables based on serviceType:
 *   - rent-a-car     → booking         (assignedEmployeeId)
 *   - pickup         → pickupRequests  (assignedEmployeeId)
 *   - airport-transfer → airportBookings (handledByEmployeeId)
 */
export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== "employee") {
            return NextResponse.json({ error: "Forbidden." }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const serviceType = searchParams.get("serviceType");

        if (!serviceType) {
            return NextResponse.json(
                { error: "serviceType query parameter is required." },
                { status: 400 }
            );
        }

        // session.relatedId = employee.employeeId
        const employeeId = session.relatedId;

        let data: any[] = [];

        // ── Rent-a-Car ────────────────────────────────────────────────────────
        if (serviceType === "rent-a-car") {
            data = await db
                .select({
                    id: booking.bookingId,
                    customerName: booking.customerFullName,
                    customerPhone: booking.customerPhoneNumber1,
                    pickupDate: booking.rentalDate,
                    returnDate: booking.returnDate,
                    pickupLocation: booking.pickupLocation,
                    dropoffLocation: booking.dropoffLocation,
                    status: booking.status,
                    totalFare: booking.totalFare,
                    createdAt: booking.createdAt,
                    vehicleBrand: vehicleBrand.brandName,
                    vehicleModel: vehicleModel.modelName,
                    plateNumber: vehicle.plateNumber,
                    vehicleImage: vehicle.vehicleImage,
                })
                .from(booking)
                .leftJoin(vehicle, eq(booking.vehicleId, vehicle.vehicleId))
                .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
                .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
                .where(
                    and(
                        eq(booking.assignedEmployeeId, employeeId),
                        eq(booking.status, "ACCEPTED")
                    )
                )
                .orderBy(booking.rentalDate);
        }

        // ── Pickup ────────────────────────────────────────────────────────────
        else if (serviceType === "pickup") {
            const rows = await db
                .select({
                    id: pickupRequests.id,
                    customerName: pickupRequests.customerFullName,
                    customerPhone: pickupRequests.customerPhone,
                    pickupDate: pickupRequests.pickupTime,
                    returnDate: pickupRequests.returnTime,
                    pickupLocation: pickupRequests.pickupLocation,
                    dropoffLocation: pickupRequests.dropLocation,
                    status: pickupRequests.status,
                    totalFare: pickupRequests.price,
                    createdAt: pickupRequests.createdAt,
                    vehicleBrand: vehicleBrand.brandName,
                    vehicleModel: vehicleModel.modelName,
                    plateNumber: vehicle.plateNumber,
                    vehicleImage: vehicle.vehicleImage,
                    distanceKm: pickupRequests.distanceKm,
                    travelers: pickupRequests.travelers,
                    luggageCount: pickupRequests.luggageCount,
                    isReturnTrip: pickupRequests.isReturnTrip,
                })
                .from(pickupRequests)
                .leftJoin(vehicle, eq(pickupRequests.vehicleId, vehicle.vehicleId))
                .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
                .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
                .where(
                    and(
                        eq(pickupRequests.assignedEmployeeId, employeeId),
                        eq(pickupRequests.status, "ACCEPTED")
                    )
                )
                .orderBy(pickupRequests.pickupTime);

            // Convert decimal fields to numbers
            data = rows.map((r) => ({
                ...r,
                distanceKm: Number(r.distanceKm),
                totalFare: Number(r.totalFare),
            }));
        }

        // ── Airport Transfer ──────────────────────────────────────────────────
        else if (serviceType === "airport-transfer") {
            data = await db
                .select({
                    id: airportBookings.id,
                    customerName: airportBookings.customerFullName,
                    customerPhone: airportBookings.customerPhone,
                    pickupDate: airportBookings.pickupDate,
                    returnDate: airportBookings.dropDate,
                    pickupLocation: airportBookings.transferLocation,
                    dropoffLocation: airportBookings.airport,
                    status: airportBookings.status,
                    totalFare: null,
                    createdAt: airportBookings.createdAt,
                    vehicleBrand: vehicleBrand.brandName,
                    vehicleModel: vehicleModel.modelName,
                    plateNumber: vehicle.plateNumber,
                    vehicleImage: vehicle.vehicleImage,
                    transferType: airportBookings.transferType,
                    airport: airportBookings.airport,
                    passengers: airportBookings.passengers,
                    luggageCount: airportBookings.luggageCount,
                    pickupTime: airportBookings.pickupTime,
                    dropTime: airportBookings.dropTime,
                })
                .from(airportBookings)
                .leftJoin(vehicle, eq(airportBookings.vehicleId, vehicle.vehicleId))
                .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
                .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
                .where(
                    and(
                        eq(airportBookings.handledByEmployeeId, employeeId),
                        eq(airportBookings.status, "ACCEPTED")
                    )
                )
                .orderBy(airportBookings.pickupDate);
        } else {
            return NextResponse.json(
                { error: `Unknown serviceType: ${serviceType}` },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error: any) {
        console.error("[GET /api/employee/bookings]", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
