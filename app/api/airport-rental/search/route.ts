import { NextResponse } from "next/server";
import { searchAvailableAirportVehicles } from "@/lib/services/airportRentalService";

/**
 * GET /api/airport-rental/search?passengers=N&luggage=N
 * Public endpoint — returns available Airport Rental vehicles.
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const passengers = parseInt(searchParams.get("passengers") ?? "1", 10);
        const luggage = parseInt(searchParams.get("luggage") ?? "0", 10);

        if (isNaN(passengers) || passengers <= 0) {
            return NextResponse.json({ error: "passengers must be a positive integer." }, { status: 400 });
        }
        if (isNaN(luggage) || luggage < 0) {
            return NextResponse.json({ error: "luggage must be a non-negative integer." }, { status: 400 });
        }

        const vehicles = await searchAvailableAirportVehicles(passengers, luggage);
        return NextResponse.json({ success: true, data: vehicles }, { status: 200 });
    } catch (error: any) {
        console.error("[GET /api/airport-rental/search]", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
