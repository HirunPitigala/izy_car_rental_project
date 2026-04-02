import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPendingBookings, updateBookingStatus } from "@/lib/actions/bookingActions";

/**
 * GET /api/bookings?status=PENDING
 * Employee / Admin: fetch standard car rental bookings.
 */
export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session || (session.role !== "employee" && session.role !== "admin" && session.role !== "manager")) {
            return NextResponse.json({ error: "Forbidden." }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        // Standard bookings use "PENDING", "ACCEPTED", "REJECTED"
        const status = (searchParams.get("status") ?? "PENDING").toUpperCase();

        if (status === "PENDING") {
            const result = await getPendingBookings();
            return NextResponse.json(result, { status: 200 });
        }
        
        // For other statuses, we can add more action helpers if needed.
        return NextResponse.json({ success: true, data: [] }, { status: 200 });
    } catch (error: any) {
        console.error("[GET /api/bookings] Error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}

/**
 * PATCH /api/bookings
 * Employee / Admin: accept or reject a standard booking.
 * Body: { id: number, status: "ACCEPTED" | "REJECTED", rejection_reason?: string }
 */
export async function PATCH(req: Request) {
    try {
        const session = await getSession();
        if (!session || (session.role !== "employee" && session.role !== "admin" && session.role !== "manager")) {
            return NextResponse.json({ error: "Forbidden." }, { status: 403 });
        }

        const body = await req.json();
        const { id, status, rejection_reason } = body;

        if (!id || !status) {
            return NextResponse.json({ error: "id and status are required." }, { status: 400 });
        }

        const formData = new FormData();
        if (rejection_reason) formData.append("rejectionReason", rejection_reason);

        const result = await updateBookingStatus(id, status, formData);
        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error("[PATCH /api/bookings] Error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
