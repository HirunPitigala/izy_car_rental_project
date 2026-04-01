import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAllAirportBookings } from "@/lib/services/airportRentalService";

/**
 * GET /api/airport-rental/admin
 * Admin/Manager: fetch ALL airport bookings regardless of status.
 */
export async function GET() {
    try {
        const session = await getSession();
        if (!session || (session.role !== "admin" && session.role !== "manager")) {
            return NextResponse.json({ error: "Forbidden." }, { status: 403 });
        }

        const bookings = await getAllAirportBookings();
        return NextResponse.json({ success: true, data: bookings }, { status: 200 });
    } catch (error: any) {
        console.error("[GET /api/airport-rental/admin]", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
