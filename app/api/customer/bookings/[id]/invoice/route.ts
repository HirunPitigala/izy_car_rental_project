import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/src/db";
import { booking, vehicle, vehicleBrand, vehicleModel, users } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session || session.role !== "customer") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const bookingId = parseInt((await params).id);
        if (isNaN(bookingId)) {
            return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 });
        }

        const results = await db.select({
            bookingId: booking.bookingId,
            rentalDate: booking.rentalDate,
            returnDate: booking.returnDate,
            totalFare: booking.totalFare,
            status: booking.status,
            createdAt: booking.createdAt,
            customerName: booking.customerFullName,
            vehicle: {
                brand: vehicleBrand.brandName,
                model: vehicleModel.modelName,
                plateNumber: vehicle.plateNumber,
            }
        })
            .from(booking)
            .leftJoin(vehicle, eq(booking.vehicleId, vehicle.vehicleId))
            .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
            .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
            .where(
                and(
                    eq(booking.bookingId, bookingId),
                    eq(booking.userId, session.userId)
                )
            )
            .limit(1);

        if (results.length === 0) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: results[0] });

    } catch (error: any) {
        console.error("[GET /api/customer/bookings/[id]/invoice] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
