import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
    getAirportBookingsByStatus,
    updateAirportBookingStatus,
} from "@/lib/services/airportRentalService";
import { sendNotification } from "@/lib/actions/notificationActions";
import { sendBookingStatusEmail } from "@/lib/email";
import { db } from "@/lib/db";
import { airportBookings, users } from "@/src/db/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/airport-rental/bookings?status=PENDING
 * Employee / Admin / Manager: list airport bookings by status.
 */
export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session || (session.role !== "employee" && session.role !== "admin" && session.role !== "manager")) {
            return NextResponse.json({ error: "Forbidden." }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const status = (searchParams.get("status") ?? "PENDING").toUpperCase();
        const employeeId = searchParams.get("employeeId") ? parseInt(searchParams.get("employeeId")!) : undefined;

        const bookings = await getAirportBookingsByStatus(status, employeeId);
        return NextResponse.json({ success: true, data: bookings }, { status: 200 });
    } catch (error: any) {
        console.error("[GET /api/airport-rental/bookings]", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}

/**
 * PATCH /api/airport-rental/bookings
 * Employee / Admin: accept or reject an airport booking.
 * Body: { id, status: "ACCEPTED" | "REJECTED", rejection_reason? }
 */
export async function PATCH(req: Request) {
    try {
        const session = await getSession();
        if (!session || (session.role !== "employee" && session.role !== "admin" && session.role !== "manager")) {
            return NextResponse.json({ error: "Forbidden." }, { status: 403 });
        }

        const body = await req.json();
        const { id, status, rejection_reason, employeeId: assignedEmployeeId } = body;

        if (!id || !status) {
            return NextResponse.json({ error: "id and status are required." }, { status: 400 });
        }

        const upperStatus = String(status).toUpperCase();
        if (upperStatus !== "ACCEPTED" && upperStatus !== "REJECTED") {
            return NextResponse.json({ error: "status must be ACCEPTED or REJECTED." }, { status: 400 });
        }

        if (upperStatus === "REJECTED" && !rejection_reason?.trim()) {
            return NextResponse.json(
                { error: "rejection_reason is required when rejecting a booking." },
                { status: 400 }
            );
        }

        // Determine employeeId
        // If Admin/Manager provides it in body, use that. 
        // Otherwise, if current user is an employee, use theirs.
        const isAdmin = session.role === "admin" || session.role === "manager";
        const employeeId = isAdmin ? (assignedEmployeeId ?? undefined) : (session.relatedId ?? undefined);

        await updateAirportBookingStatus(
            parseInt(id, 10),
            upperStatus as "ACCEPTED" | "REJECTED",
            rejection_reason,
            employeeId
        );

        // Handle Notifications
        const [a] = await db.select().from(airportBookings).where(eq(airportBookings.id, parseInt(id, 10)));
        if (a) {
            const [u] = await db.select({ email: users.email, name: users.name })
                .from(users).where(eq(users.userId, a.customerId));

            if (upperStatus === "ACCEPTED") {
                // 1. Notify Customer — in-app + email
                if (a.customerId) {
                    try { await sendNotification(a.customerId, `Your Airport booking (#${id}) has been ACCEPTED.`, parseInt(id, 10), "airport-transfer"); }
                    catch (e) { console.error("Notification error:", e); }
                    try { if (u?.email) await sendBookingStatusEmail(u.email, u.name ?? "Customer", parseInt(id, 10), "Airport Transfer", "ACCEPTED"); }
                    catch (e) { console.error("Email error:", e); }
                }
                // 2. Notify Assigned Employee — serviceType enables navigation
                if (employeeId) {
                    try {
                        const [empUser] = await db.select({ id: users.userId }).from(users).where(eq(users.relatedId, employeeId));
                        if (empUser) await sendNotification(empUser.id, `New Booking Assigned - Airport booking #${id}`, parseInt(id, 10), "airport-transfer");
                    } catch (e) { console.error("Employee notification error:", e); }
                }
            } else if (upperStatus === "REJECTED") {
                // Notify Customer — in-app + email
                if (a.customerId) {
                    try { await sendNotification(a.customerId, `Your Airport booking (#${id}) has been REJECTED.`, parseInt(id, 10), "airport-transfer"); }
                    catch (e) { console.error("Notification error:", e); }
                    try { if (u?.email) await sendBookingStatusEmail(u.email, u.name ?? "Customer", parseInt(id, 10), "Airport Transfer", "REJECTED", rejection_reason ?? undefined); }
                    catch (e) { console.error("Email error:", e); }
                }
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error("[PATCH /api/airport-rental/bookings]", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
