import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vehicle } from "@/src/db/schema";
import { getSession } from "@/lib/auth";
import { desc } from "drizzle-orm";

export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const vehicles = await db.select().from(vehicle).orderBy(desc(vehicle.vehicleId));
        return NextResponse.json(vehicles);
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        const newVehicle = await db.insert(vehicle).values({
            brand: body.brand,
            model: body.model,
            plateNumber: body.plateNumber,
            seatingCapacity: parseInt(body.seatingCapacity) || parseInt(body.capacity) || 4,
            capacity: parseInt(body.capacity) || parseInt(body.seatingCapacity) || 4,
            transmissionType: body.transmissionType,
            fuelType: body.fuelType,
            luggageCapacity: parseInt(body.luggageCapacity) || 2,
            ratePerDay: body.ratePerDay,
            ratePerMonth: body.ratePerMonth,
            status: body.status || "AVAILABLE",
            serviceCategory: body.serviceCategory || "NORMAL",
            image: body.image, // Base64
            description: body.description,
            availabilityStatus: body.status || "AVAILABLE", // For legacy compatibility
        });

        return NextResponse.json({ success: true, message: "Vehicle created successfully", vehicle: newVehicle }, { status: 201 });
    } catch (error) {
        console.error("Error creating vehicle:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
