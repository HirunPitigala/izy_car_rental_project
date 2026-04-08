
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inspection, inspectionItems, damageReports, booking } from "@/src/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || (session.role !== "employee" && session.role !== "admin" && session.role !== "manager")) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { bookingId, inspectionType, overallRemarks, items, damages } = body;

    if (!bookingId || !inspectionType) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Check if inspection already exists
    const existing = await db.select().from(inspection).where(
      and(
        eq(inspection.bookingId, bookingId),
        eq(inspection.inspectionType, inspectionType)
      )
    );

    if (existing.length > 0) {
      return NextResponse.json({ 
        success: false, 
        message: `Inspection of type ${inspectionType} already exists for this booking` 
      }, { status: 400 });
    }

    const result = await db.transaction(async (tx) => {
      // 1. Create inspection
      const [insertResult]: any = await tx.insert(inspection).values({
        bookingId,
        employeeId: session.relatedId,
        inspectionType,
        overallRemarks,
      });

      const inspectionId = insertResult.insertId;

      // 2. Create inspection items
      if (items && items.length > 0) {
        await tx.insert(inspectionItems).values(
          items.map((it: any) => ({
            inspectionId,
            itemId: it.itemId,
            status: it.status,
            remarks: it.remarks || "",
          }))
        );
      }

      // 3. Create damage reports
      if (damages && damages.length > 0) {
        await tx.insert(damageReports).values(
          damages.map((d: any) => ({
            inspectionId,
            damageType: d.damageType,
            xPosition: d.xPosition,
            yPosition: d.yPosition,
            notes: d.notes || "",
          }))
        );
      }

      // 4. Update booking status based on inspection type
      const newStatus = inspectionType === "BEFORE" ? "PICKED_UP" : "RETURNED";
      await tx.update(booking).set({ 
        bookingStatus: newStatus 
      }).where(eq(booking.bookingId, bookingId));

      return { inspectionId, status: newStatus };
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Inspection error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
