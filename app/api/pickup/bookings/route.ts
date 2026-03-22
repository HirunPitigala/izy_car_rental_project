import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
    getPickupRequestsByStatus,
    updatePickupRequestStatus,
} from "@/lib/services/pickupService";

/**
 * GET /api/pickup/bookings?status=PENDING
 * Employee / Admin: fetch pickup requests filtered by status.
 */
export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session || (session.role !== "employee" && session.role !== "admin" && session.role !== "manager")) {
            return NextResponse.json({ error: "Forbidden." }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const status = (searchParams.get("status") ?? "PENDING").toUpperCase();

        const requests = await getPickupRequestsByStatus(status);
        return NextResponse.json({ success: true, data: requests }, { status: 200 });
    } catch (error: any) {
        console.error("[GET /api/pickup/bookings] Error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}

/**
 * PATCH /api/pickup/bookings
 * Employee / Admin: accept or reject a pickup request.
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
            return NextResponse.json(
                { error: "id and status are required." },
                { status: 400 }
            );
        }

        const upperStatus = String(status).toUpperCase();
        if (upperStatus !== "ACCEPTED" && upperStatus !== "REJECTED") {
            return NextResponse.json(
                { error: "status must be ACCEPTED or REJECTED." },
                { status: 400 }
            );
        }

        if (upperStatus === "REJECTED" && !rejection_reason?.trim()) {
            return NextResponse.json(
                { error: "rejection_reason is required when rejecting a booking." },
                { status: 400 }
            );
        }

        await updatePickupRequestStatus(
            parseInt(id, 10),
            upperStatus as "ACCEPTED" | "REJECTED",
            rejection_reason
        );

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error("[PATCH /api/pickup/bookings] Error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
