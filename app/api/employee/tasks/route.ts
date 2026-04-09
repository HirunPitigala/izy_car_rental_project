
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { booking, inspection, vehicle } from "@/src/db/schema";
import { getSession } from "@/lib/auth";
import { eq, or, and, inArray } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== "employee" && session.role !== "admin" && session.role !== "manager")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch bookings that are in relevant statuses for inspection
    // PENDING, ACCEPTED, PICKED_UP, RETURNED
    const bookings = await db.query.booking.findMany({
      where: or(
        eq(booking.status, "ACCEPTED"),
        eq(booking.status, "PICKED_UP"),
        eq(booking.status, "RETURNED")
      ),
      with: {
        vehicle: true,
        inspections: true,
      },
      orderBy: (booking, { desc }) => [desc(booking.createdAt)],
    });

    const tasks = bookings.map((b: any) => {
      let status: "PENDING_PICKUP" | "ACTIVE" | "PENDING_RETURN" | "COMPLETED" = "PENDING_PICKUP";
      
      const hasBefore = b.inspections?.some((i: any) => i.inspectionType === "BEFORE");
      const hasAfter = b.inspections?.some((i: any) => i.inspectionType === "AFTER");

      if (hasAfter) {
        status = "COMPLETED";
      } else if (hasBefore) {
          // If has BEFORE, it could be ACTIVE or PENDING_RETURN
          if (b.status === "RETURNED") {
              status = "PENDING_RETURN";
          } else {
              status = "ACTIVE";
          }
      } else {
        status = "PENDING_PICKUP";
      }

      return {
        ...b,
        inspectionStatus: status,
      };
    });

    return NextResponse.json({ success: true, data: tasks });
  } catch (error: any) {
    console.error("Error fetching employee tasks:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
