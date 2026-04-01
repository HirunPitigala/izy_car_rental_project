import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
    validateAirportBooking,
    createAirportBooking,
} from "@/lib/services/airportRentalService";

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
            transfer_date,
            transfer_time,
            passengers,
            luggage_count,
            customer_full_name,
            customer_phone,
            customer_email,
            transfer_location,
        } = body;

        if (!vehicle_id || !transfer_type || !airport || !transfer_date || !transfer_time || !transfer_location) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );
        }

        const bookingData = {
            customerId: session.userId,
            vehicleId: parseInt(vehicle_id, 10),
            transferType: String(transfer_type).toUpperCase() as "PICKUP" | "DROP",
            airport: String(airport).toUpperCase() as "BANDARANAYAKE" | "MATTALA",
            transferDate: transfer_date,
            transferTime: transfer_time,
            passengers: parseInt(passengers ?? "1", 10),
            luggageCount: parseInt(luggage_count ?? "0", 10),
            customerFullName: customer_full_name ?? session.user?.name ?? "Customer",
            customerPhone: customer_phone ?? "",
            customerEmail: customer_email ?? undefined,
            transferLocation: transfer_location,
        };

        const errors = validateAirportBooking(bookingData);
        if (errors.length > 0) {
            return NextResponse.json({ error: "Validation failed.", details: errors }, { status: 422 });
        }

        const bookingId = await createAirportBooking(bookingData);
        return NextResponse.json({ success: true, bookingId }, { status: 201 });
    } catch (error: any) {
        console.error("[POST /api/airport-rental/book]", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
