import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vehicle, vehicleBrand, vehicleModel, serviceCategory } from "@/src/db/schema";
import { getSession } from "@/lib/auth";
import { desc, eq, sql, and } from "drizzle-orm";

export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const vehicles = await db.select({
            vehicleId: vehicle.vehicleId,
            brand: vehicleBrand.brandName,
            model: vehicleModel.modelName,
            plateNumber: vehicle.plateNumber,
            capacity: vehicle.capacity,
            seatingCapacity: vehicle.seatingCapacity,
            transmissionType: vehicle.transmissionType,
            fuelType: vehicle.fuelType,
            luggageCapacity: vehicle.luggageCapacity,
            availabilityStatus: vehicle.availabilityStatus,
            status: vehicle.status,
            serviceCategory: serviceCategory.categoryName,
            ratePerDay: vehicle.ratePerDay,
            ratePerMonth: vehicle.ratePerMonth,
            image: vehicle.image,
            imageUrl: vehicle.imageUrl,
            description: vehicle.description,
            createdAt: vehicle.createdAt,
        })
            .from(vehicle)
            .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
            .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
            .leftJoin(serviceCategory, eq(vehicle.categoryId, serviceCategory.categoryId))
            .orderBy(desc(vehicle.vehicleId));

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

        // 1. Handle Brand (Find or Create)
        let brandId: number | undefined;
        if (body.brand) {
            const [existingBrand] = await db.select().from(vehicleBrand).where(eq(vehicleBrand.brandName, body.brand));
            if (existingBrand) {
                brandId = existingBrand.brandId;
            } else {
                const [result] = await db.insert(vehicleBrand).values({ brandName: body.brand });
                brandId = (result as any).insertId;
            }
        }

        // 2. Handle Model (Find or Create)
        let modelId: number | undefined;
        if (body.model && brandId) {
            const [existingModel] = await db.select().from(vehicleModel).where(sql`${vehicleModel.modelName} = ${body.model} AND ${vehicleModel.brandId} = ${brandId}`);
            if (existingModel) {
                modelId = existingModel.modelId;
            } else {
                const [result] = await db.insert(vehicleModel).values({ brandId, modelName: body.model });
                modelId = (result as any).insertId;
            }
        }

        // 3. Handle Category (Find)
        let categoryId: number | undefined;
        if (body.serviceCategory) {
            const [existingCategory] = await db.select().from(serviceCategory).where(eq(serviceCategory.categoryName, body.serviceCategory));
            if (existingCategory) {
                categoryId = existingCategory.categoryId;
            }
        }

        const [newVehicleResult] = await db.insert(vehicle).values({
            brand: body.brand, // Legacy
            brandId: brandId,
            model: body.model, // Legacy
            modelId: modelId,
            plateNumber: body.plateNumber,
            seatingCapacity: parseInt(body.seatingCapacity) || parseInt(body.capacity) || 4,
            capacity: parseInt(body.capacity) || parseInt(body.seatingCapacity) || 4,
            transmissionType: body.transmissionType,
            fuelType: body.fuelType,
            luggageCapacity: parseInt(body.luggageCapacity) || 2,
            ratePerDay: body.ratePerDay,
            ratePerMonth: body.ratePerMonth,
            status: body.status || "AVAILABLE",
            serviceCategory: body.serviceCategory || "NORMAL", // Legacy
            categoryId: categoryId,
            image: body.image, // Base64
            description: body.description,
            availabilityStatus: body.status || "AVAILABLE", // For legacy compatibility
        });

        const newVehicleId = (newVehicleResult as any).insertId;
        const [newVehicle] = await db.select().from(vehicle).where(eq(vehicle.vehicleId, newVehicleId));

        return NextResponse.json({ success: true, message: "Vehicle created successfully", vehicle: newVehicle }, { status: 201 });
    } catch (error) {
        console.error("Error creating vehicle:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
