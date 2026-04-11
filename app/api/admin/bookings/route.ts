import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/src/db";
import { booking, vehicle, vehicleBrand, vehicleModel, users } from "@/src/db/schema";
import { eq, and, lt, desc } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session || (session.role !== "admin" && session.role !== "manager")) {
            return NextResponse.json({ error: "Forbidden. Admin access only." }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status")?.toLowerCase();
        const isPast = searchParams.get("past") === "true";

        const conditions = [];

        // Handle Status
        if (status) {
            if (status === "pending") {
                conditions.push(eq(booking.status, "PENDING"));
            } else if (status === "approved") {
                conditions.push(eq(booking.status, "ACCEPTED"));
            } else if (status === "rejected") {
                conditions.push(eq(booking.status, "REJECTED"));
            }
        }

        // Handle Past Bookings
        if (isPast) {
            conditions.push(lt(booking.returnDate, new Date()));
        }

        const results = await db.select({
            bookingId: booking.bookingId,
            customerName: booking.customerFullName,
            customerPhone: booking.customerPhoneNumber1,
            rentalDate: booking.rentalDate,
            returnDate: booking.returnDate,
            totalFare: booking.totalFare,
            status: booking.status,
            rejectionReason: booking.rejectionReason,
            createdAt: booking.createdAt,
            userEmail: users.email,
            vehicle: {
                brand: vehicleBrand.brandName,
                model: vehicleModel.modelName,
                plateNumber: vehicle.plateNumber,
            }
        })
            .from(booking)
            .leftJoin(users, eq(booking.userId, users.userId))
            .leftJoin(vehicle, eq(booking.vehicleId, vehicle.vehicleId))
            .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
            .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(desc(booking.createdAt));

        return NextResponse.json({ success: true, data: results }, { status: 200 });

    } catch (error: any) {
        console.error("[GET /api/admin/bookings] Error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
