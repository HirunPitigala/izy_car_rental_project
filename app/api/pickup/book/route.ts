import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
    validatePickupBooking,
    createPickupBooking,
    calculateFare,
    estimateDistance,
} from "@/lib/services/pickupService";
import { notifyAdmins } from "@/lib/actions/notificationActions";

/**
 * POST /api/pickup/book
 * Requires: customer auth session.
 * Body: {
 *   vehicle_id, pickup_location, drop_location,
 *   pickup_datetime, return_datetime?, is_return_trip,
 *   travelers, luggage_count,
 *   customer_full_name, customer_phone,
 *   distance_km?, price?           ← optional, server will calculate if omitted
 * }
 */
export async function POST(req: Request) {
    try {
        // ── Auth ──────────────────────────────────────────────
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized — please log in." }, { status: 401 });
        }

        // ── Parse body ────────────────────────────────────────
        const body = await req.json();

        const {
            vehicle_id,
            pickup_location,
            drop_location,
            pickup_datetime,
            return_datetime,
            is_return_trip,
            travelers,
            luggage_count,
            customer_full_name,
            customer_phone,
            price_per_km,
        } = body;

        // ── Required field check ──────────────────────────────
        if (!vehicle_id || !pickup_location || !drop_location || !pickup_datetime) {
            return NextResponse.json(
                { error: "Missing required fields: vehicle_id, pickup_location, drop_location, pickup_datetime." },
                { status: 400 }
            );
        }

        // ── Resolve dates ─────────────────────────────────────
        const pickupTime = new Date(pickup_datetime);
        const returnTime =
            is_return_trip && return_datetime ? new Date(return_datetime) : null;

        // ── Distance & Fare calculation ───────────────────────
        const distanceKm: number =
            typeof body.distance_km === "number" && body.distance_km > 0
                ? body.distance_km
                : estimateDistance(pickup_location, drop_location);

        const resolvedPricePerKm =
            typeof price_per_km === "number" && price_per_km > 0 ? price_per_km : 100; // LKR 100/km fallback
        const price =
            typeof body.price === "number" && body.price > 0
                ? body.price
                : calculateFare(distanceKm, resolvedPricePerKm, !!is_return_trip);

        // ── Build booking data ────────────────────────────────
        const bookingData = {
            customerId: session.userId,
            vehicleId: parseInt(vehicle_id, 10),
            pickupLocation: pickup_location,
            dropLocation: drop_location,
            pickupTime,
            returnTime,
            isReturnTrip: !!is_return_trip,
            travelers: parseInt(travelers ?? "1", 10),
            luggageCount: parseInt(luggage_count ?? "0", 10),
            distanceKm,
            price,
            customerFullName: customer_full_name ?? session.user?.name ?? "Customer",
            customerPhone: customer_phone ?? "0000000000",
        };

        // ── Validate ──────────────────────────────────────────
        const errors = validatePickupBooking(bookingData);
        if (errors.length > 0) {
            return NextResponse.json({ error: "Validation failed.", details: errors }, { status: 422 });
        }

        // ── Persist ───────────────────────────────────────────
        const bookingId = await createPickupBooking(bookingData);

        // ── Notify Admins ─────────────────────────────────────
        await notifyAdmins(`New Pickup request from ${bookingData.customerFullName} (${bookingData.pickupLocation} -> ${bookingData.dropLocation})`, bookingId);

        return NextResponse.json(
            { success: true, bookingId, distanceKm, price },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("[/api/pickup/book] Error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
