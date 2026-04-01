import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getCustomerAirportBookings } from "@/lib/services/airportRentalService";

/**
 * GET /api/airport-rental/customer
 * Customer: fetch their own airport bookings.
 */
export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        }

        const bookings = await getCustomerAirportBookings(session.userId);
        return NextResponse.json({ success: true, data: bookings }, { status: 200 });
    } catch (error: any) {
        console.error("[GET /api/airport-rental/customer]", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
