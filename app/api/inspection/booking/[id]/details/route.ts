
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { booking, vehicle, serviceCategory } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const bookingId = parseInt(params.id);

  if (isNaN(bookingId)) {
    return NextResponse.json({ success: false, message: "Invalid booking ID" }, { status: 400 });
  }

  try {
    const data = await db.query.booking.findFirst({
      where: eq(booking.bookingId, bookingId),
      with: {
        vehicle: {
            with: {
                brand: true,
                model: true,
                category: true,
            }
        },
      },
    });

    if (!data) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error fetching booking details:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
