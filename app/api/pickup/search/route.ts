import { NextResponse } from "next/server";
import { searchAvailablePickupVehicles } from "@/lib/services/pickupService";

/**
 * POST /api/pickup/search
 * Body: { travelers: number, luggage: number }
 * Returns: array of available Pickup-category vehicles.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const travelers = parseInt(body.travelers ?? "1", 10);
        const luggage = parseInt(body.luggage ?? "0", 10);

        if (!travelers || travelers <= 0) {
            return NextResponse.json(
                { error: "travelers must be a positive integer." },
                { status: 400 }
            );
        }

        const vehicles = await searchAvailablePickupVehicles(travelers, luggage);

        return NextResponse.json({ success: true, data: vehicles }, { status: 200 });
    } catch (error: any) {
        console.error("[/api/pickup/search] Error:", error);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}
