
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inspection, inspectionItems, damageReports, item } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const bookingId = parseInt(params.id);

  if (isNaN(bookingId)) {
    return NextResponse.json({ success: false, message: "Invalid booking ID" }, { status: 400 });
  }

  try {
    const inspections = await db.query.inspection.findMany({
      where: eq(inspection.bookingId, bookingId),
      with: {
        items: {
          with: {
            item: true,
          },
        },
        damageReports: true,
      },
    });

    return NextResponse.json({ success: true, data: inspections });
  } catch (error: any) {
    console.error("Error fetching inspections:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
