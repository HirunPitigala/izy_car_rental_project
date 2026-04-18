import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
    validatePickupBooking,
    createPickupBooking,
    calculateFare,
    estimateDistance,
} from "@/lib/services/pickupService";
import { notifyAdmins } from "@/lib/actions/notificationActions";
import { saveFileToCloudinary } from "@/lib/actions/bookingActions";

/**
 * POST /api/pickup/book
 * Requires: customer auth session.
 * Body: FormData containing:
 *   vehicle_id, pickup_location, drop_location,
 *   pickup_datetime, return_datetime?, is_return_trip,
 *   travelers, luggage_count,
 *   customer_full_name, customer_phone, paymentslip (File)
 *   distance_km?, price?           ← optional, server will calculate if omitted
 */
export async function POST(req: Request) {
    try {
        // ── Auth ──────────────────────────────────────────────
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized — please log in." }, { status: 401 });
        }

        // ── Parse FormData ────────────────────────────────────
        const formData = await req.formData();

        const vehicle_id = formData.get("vehicle_id") as string;
        const pickup_location = formData.get("pickup_location") as string;
        const drop_location = formData.get("drop_location") as string;
        const pickup_datetime = formData.get("pickup_datetime") as string;
        const return_datetime = formData.get("return_datetime") as string;
        const is_return_trip = formData.get("is_return_trip") === "true";
        const travelers = formData.get("travelers") as string;
        const luggage_count = formData.get("luggage_count") as string;
        const customer_full_name = formData.get("customer_full_name") as string;
        const customer_phone = formData.get("customer_phone") as string;
        const price_per_km = parseFloat(formData.get("price_per_km") as string || "0");
        const distance_km_raw = parseFloat(formData.get("distance_km") as string || "0");
        const price_raw = parseFloat(formData.get("price") as string || "0");
        const paymentslipPath = formData.get("paymentslip") as string | null;

        // ── Required field check ──────────────────────────────
        if (!vehicle_id || !pickup_location || !drop_location || !pickup_datetime) {
            return NextResponse.json(
                { error: "Missing required fields: vehicle_id, pickup_location, drop_location, pickup_datetime." },
                { status: 400 }
            );
        }

        if (!paymentslipPath || paymentslipPath.length === 0) {
            return NextResponse.json({ success: false, error: "Payment slip is required." }, { status: 400 });
        }

        // ── Resolve dates ─────────────────────────────────────
        const pickupTime = new Date(pickup_datetime);
        const returnTime =
            is_return_trip && return_datetime ? new Date(return_datetime) : null;

        // ── Distance & Fare calculation ───────────────────────
        // SECURITY FIX (A08): Never trust client-supplied distance or price.
        // We force server-side estimation and calculation to prevent price manipulation.
        const distanceKm = estimateDistance(pickup_location, drop_location);
        
        // Use the requested price_per_km if valid, otherwise fallback to standard rate
        const resolvedPricePerKm = price_per_km > 0 ? price_per_km : 100; // LKR 100/km default fallback
        
        const price = calculateFare(distanceKm, resolvedPricePerKm, is_return_trip);

        // ── Build booking data ────────────────────────────────
        const bookingData = {
            customerId: session.userId,
            vehicleId: parseInt(vehicle_id, 10),
            pickupLocation: pickup_location,
            dropLocation: drop_location,
            pickupTime,
            returnTime,
            isReturnTrip: is_return_trip,
            travelers: parseInt(travelers ?? "1", 10),
            luggageCount: parseInt(luggage_count ?? "0", 10),
            distanceKm,
            price,
            customerFullName: customer_full_name || session.user?.name || "Customer",
            customerPhone: customer_phone || "0000000000",
            paymentslip: paymentslipPath || undefined,
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
