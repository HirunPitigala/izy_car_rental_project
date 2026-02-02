"use server";

import { db } from "@/lib/db";
import { vehicle, vehicleBrand, vehicleModel, serviceCategory } from "@/src/db/schema";
import { eq, sql, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getVehiclesByCategory(categoryName: string) {
    try {
        const vehicles = await db.select({
            vehicleId: vehicle.vehicleId,
            brand: vehicleBrand.brandName,
            model: vehicleModel.modelName,
            plateNumber: vehicle.plateNumber,
            capacity: vehicle.capacity,
            seatingCapacity: vehicle.seatingCapacity,
            passengerCapacity: vehicle.passengerCapacity,
            transmissionType: vehicle.transmissionType,
            fuelType: vehicle.fuelType,
            luggageCapacity: vehicle.luggageCapacity,
            rentPerHour: vehicle.rentPerHour,
            rentPerDay: vehicle.rentPerDay,
            rentPerMonth: vehicle.rentPerMonth,
            maxMileagePerDay: vehicle.maxMileagePerDay,
            extraMileageCharge: vehicle.extraMileageCharge,
            minRentalPeriod: vehicle.minRentalPeriod,
            maxRentalPeriod: vehicle.maxRentalPeriod,
            availabilityStatus: vehicle.availabilityStatus,
            status: vehicle.status,
            serviceCategory: serviceCategory.categoryName,
            image: vehicle.image,
            description: vehicle.description,
            createdAt: vehicle.createdAt,
        })
            .from(vehicle)
            .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
            .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
            .innerJoin(serviceCategory, eq(vehicle.categoryId, serviceCategory.categoryId))
            .where(eq(serviceCategory.categoryName, categoryName))
            .orderBy(desc(vehicle.vehicleId));

        return { success: true, data: vehicles };
    } catch (error) {
        console.error("Error fetching vehicles by category:", error);
        return { success: false, error: "Failed to fetch vehicles" };
    }
}

export async function getVehicleById(id: number) {
    try {
        const [v] = await db.select({
            vehicleId: vehicle.vehicleId,
            brand: vehicleBrand.brandName,
            model: vehicleModel.modelName,
            plateNumber: vehicle.plateNumber,
            capacity: vehicle.capacity,
            seatingCapacity: vehicle.seatingCapacity,
            passengerCapacity: vehicle.passengerCapacity,
            transmissionType: vehicle.transmissionType,
            fuelType: vehicle.fuelType,
            luggageCapacity: vehicle.luggageCapacity,
            rentPerHour: vehicle.rentPerHour,
            rentPerDay: vehicle.rentPerDay,
            rentPerMonth: vehicle.rentPerMonth,
            maxMileagePerDay: vehicle.maxMileagePerDay,
            extraMileageCharge: vehicle.extraMileageCharge,
            minRentalPeriod: vehicle.minRentalPeriod,
            maxRentalPeriod: vehicle.maxRentalPeriod,
            availabilityStatus: vehicle.availabilityStatus,
            status: vehicle.status,
            categoryId: vehicle.categoryId,
            serviceCategory: serviceCategory.categoryName,
            image: vehicle.image,
            description: vehicle.description,
            brandId: vehicle.brandId,
            modelId: vehicle.modelId,
        })
            .from(vehicle)
            .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
            .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
            .leftJoin(serviceCategory, eq(vehicle.categoryId, serviceCategory.categoryId))
            .where(eq(vehicle.vehicleId, id));

        return { success: true, data: v };
    } catch (error) {
        console.error("Error fetching vehicle by id:", error);
        return { success: false, error: "Failed to fetch vehicle details" };
    }
}

async function getOrCreateBrand(brandName: string) {
    const [existing] = await db.select().from(vehicleBrand).where(eq(vehicleBrand.brandName, brandName));
    if (existing) return existing.brandId;

    const [result] = await db.insert(vehicleBrand).values({ brandName });
    return (result as any).insertId;
}

async function getOrCreateModel(brandId: number, modelName: string) {
    const [existing] = await db.select().from(vehicleModel).where(
        and(eq(vehicleModel.brandId, brandId), eq(vehicleModel.modelName, modelName))
    );
    if (existing) return existing.modelId;

    const [result] = await db.insert(vehicleModel).values({ brandId, modelName });
    return (result as any).insertId;
}

export async function saveVehicle(data: any) {
    try {
        const brandId = await getOrCreateBrand(data.brand);
        const modelId = await getOrCreateModel(brandId, data.model);

        // Find category ID
        const [category] = await db.select().from(serviceCategory).where(eq(serviceCategory.categoryName, data.serviceCategory));
        if (!category) throw new Error(`Category ${data.serviceCategory} not found`);

        const vehicleData = {
            brand: data.brand,
            brandId,
            model: data.model,
            modelId,
            plateNumber: data.plateNumber,
            seatingCapacity: parseInt(data.seatingCapacity),
            passengerCapacity: parseInt(data.passengerCapacity),
            capacity: parseInt(data.seatingCapacity), // Backward compatibility
            transmissionType: data.transmissionType,
            fuelType: data.fuelType,
            luggageCapacity: parseInt(data.luggageCapacity),
            rentPerHour: data.rentPerHour,
            rentPerDay: data.rentPerDay,
            rentPerMonth: data.rentPerMonth,
            ratePerDay: data.rentPerDay, // Backward compatibility
            ratePerMonth: data.rentPerMonth, // Backward compatibility
            maxMileagePerDay: parseInt(data.maxMileagePerDay),
            extraMileageCharge: data.extraMileageCharge,
            minRentalPeriod: parseInt(data.minRentalPeriod),
            maxRentalPeriod: parseInt(data.maxRentalPeriod),
            status: data.status,
            availabilityStatus: data.status, // Backward compatibility
            categoryId: category.categoryId,
            serviceCategory: data.serviceCategory, // Backward compatibility
            image: data.image,
            description: data.description,
        };

        if (data.vehicleId) {
            await db.update(vehicle).set(vehicleData).where(eq(vehicle.vehicleId, data.vehicleId));
        } else {
            await db.insert(vehicle).values(vehicleData);
        }

        revalidatePath("/admin/vehicles");
        return { success: true };
    } catch (error: any) {
        console.error("Error saving vehicle:", error);
        return { success: false, error: error.message || "Failed to save vehicle" };
    }
}
