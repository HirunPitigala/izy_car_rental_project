import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
    validateAirportBooking,
    createAirportBooking,
} from "@/lib/services/airportRentalService";
import { notifyAdmins } from "@/lib/actions/notificationActions";
import { saveFileToCloudinary } from "@/lib/actions/bookingActions";

/**
 * POST /api/airport-rental/book
 * Requires: customer auth session.
 * Body: FormData containing:
 *   vehicle_id, transfer_type, airport, transfer_date, transfer_time,
 *   passengers, luggage_count,
 *   customer_full_name, customer_phone,
 *   transfer_location, paymentslip (File)
 */
export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized — please log in." }, { status: 401 });
        }

        const formData = await req.formData();

        const vehicle_id = formData.get("vehicle_id") as string;
        const transfer_type = formData.get("transfer_type") as string;
        const airport = formData.get("airport") as string;
        const pickupDate = formData.get("pickupDate") as string;
        const pickupTime = formData.get("pickupTime") as string;
        const dropDate = formData.get("dropDate") as string;
        const dropTime = formData.get("dropTime") as string;
        const passengers = formData.get("passengers") as string;
        const luggage_count = formData.get("luggage_count") as string;
        const customer_full_name = formData.get("customer_full_name") as string;
        const customer_phone = formData.get("customer_phone") as string;
        const transfer_location = formData.get("transfer_location") as string;
        const paymentslipPath = formData.get("paymentslip") as string | null;

        if (!paymentslipPath || paymentslipPath.length === 0) {
            return NextResponse.json({ success: false, error: "Payment slip is required." }, { status: 400 });
        }

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
            customerFullName: customer_full_name || session.user?.name || "Customer",
            customerPhone: customer_phone || "",
            transferLocation: transfer_location,
            paymentslip: paymentslipPath || undefined,
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
        return NextResponse.json({ error: error.message || "Internal server error." }, { status: 500 });
    }
}
