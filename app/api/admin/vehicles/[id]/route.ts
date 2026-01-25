import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vehicle } from "@/src/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session || session.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const [foundVehicle] = await db
            .select()
            .from(vehicle)
            .where(eq(vehicle.vehicleId, parseInt(id)));

        if (!foundVehicle) {
            return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
        }

        return NextResponse.json(foundVehicle);
    } catch (error) {
        console.error("Error fetching vehicle:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session || session.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();

        await db
            .update(vehicle)
            .set({
                brand: body.brand,
                model: body.model,
                plateNumber: body.plateNumber,
                seatingCapacity: parseInt(body.seatingCapacity) || parseInt(body.capacity),
                capacity: parseInt(body.capacity) || parseInt(body.seatingCapacity),
                transmissionType: body.transmissionType,
                fuelType: body.fuelType,
                luggageCapacity: parseInt(body.luggageCapacity),
                ratePerDay: body.ratePerDay,
                ratePerMonth: body.ratePerMonth,
                status: body.status || "AVAILABLE",
                serviceCategory: body.serviceCategory || "NORMAL",
                image: body.image, // Base64
                description: body.description,
                availabilityStatus: body.status || "AVAILABLE", // For legacy compatibility
            })
            .where(eq(vehicle.vehicleId, parseInt(id)));

        return NextResponse.json({ success: true, message: "Vehicle updated successfully" });
    } catch (error) {
        console.error("Error updating vehicle:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session || session.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await db.delete(vehicle).where(eq(vehicle.vehicleId, parseInt(id)));

        return NextResponse.json({ success: true, message: "Vehicle deleted successfully" });
    } catch (error) {
        console.error("Error deleting vehicle:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
