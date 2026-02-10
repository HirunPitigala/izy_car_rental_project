import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { booking } from "@/src/db/schema";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // Validate required fields
        if (!body.pickup_location || !body.dropoff_location || !body.start_datetime) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Map frontend fields to DB Schema
        // DB Schema: customerId, vehicleId, startDatetime, endDatetime, pickupLocation, dropoffLocation, distance, totalFare, reservationStatus
        // We will assume a default vehicleId or nullable if allowed, checking schema...
        // Schema says vehicleId references vehicle.vehicleId. It might be nullable?
        // Checking schema definition: `vehicleId: int("vehicle_id").references(...)`
        // It does NOT say `.notNull()`. So it is nullable.

        const newBooking = await db.insert(booking).values({
            userId: session.userId,
            serviceCategoryId: body.service_category_id || 1,
            pickupLocation: body.pickup_location,
            dropoffLocation: body.dropoff_location,
            rentalDate: body.start_datetime ? new Date(body.start_datetime) : null,
            distance: body.distance,
            totalFare: body.total_fare,
            bookingStatus: body.reservation_status || "PENDING",
            customerFullName: body.customer_full_name || session.user?.name || "Customer",
            customerPhoneNumber1: body.customer_phone_number1 || "0000000000",
        });

        const bookingId = (newBooking as any)[0]?.insertId;

        return NextResponse.json({
            success: true,
            bookingId: bookingId || "new"
        }, { status: 201 });

    } catch (error) {
        console.error("Booking Create Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
