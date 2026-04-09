import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
    validateAirportBooking,
    createAirportBooking,
} from "@/lib/services/airportRentalService";
import { notifyAdmins } from "@/lib/actions/notificationActions";

/**
 * POST /api/airport-rental/book
 * Requires: customer auth session.
 * Body: {
 *   vehicle_id, transfer_type, airport, transfer_date, transfer_time,
 *   passengers, luggage_count,
 *   customer_full_name, customer_phone, customer_email?,
 *   transfer_location
 * }
 */
export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized — please log in." }, { status: 401 });
        }

        const body = await req.json();

        const {
            vehicle_id,
            transfer_type,
            airport,
            pickupDate,
            pickupTime,
            dropDate,
            dropTime,
            passengers,
            luggage_count,
            customer_full_name,
            customer_phone,

            transfer_location,
        } = body;

        const bookingData = {
            customerId: session.userId,
            vehicleId: parseInt(vehicle_id, 10),
            transferType: String(transfer_type).toLowerCase() as "pickup" | "drop",
            airport: String(airport).toLowerCase() as "katunayaka" | "mattala",
            pickupDate: pickupDate,
            pickupTime: pickupTime,
            dropDate: dropDate,
            dropTime: dropTime,
            passengers: parseInt(passengers ?? "1", 10),
            luggageCount: parseInt(luggage_count ?? "0", 10),
            customerFullName: customer_full_name ?? session.user?.name ?? "Customer",
            customerPhone: customer_phone ?? "",

            transferLocation: transfer_location,
        };

        const errors = validateAirportBooking(bookingData);
        if (errors.length > 0) {
            return NextResponse.json({ error: "Validation failed.", details: errors }, { status: 422 });
        }

        const bookingId = await createAirportBooking(bookingData);
        
        // Notify Admins
        await notifyAdmins(`New Airport Transfer request from ${bookingData.customerFullName} for ${bookingData.airport}`, bookingId);
        
        return NextResponse.json({ success: true, bookingId }, { status: 201 });
    } catch (error: any) {
        console.error("[POST /api/airport-rental/book]", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
