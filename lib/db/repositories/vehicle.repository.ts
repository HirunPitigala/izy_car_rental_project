import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { vehicle } from '@/src/db/schema';
import type { Vehicle, NewVehicle } from '../types';

/** Retrieve all vehicles */
export async function getAllVehicles(): Promise<Vehicle[]> {
  return db.select().from(vehicle);
}

/** Retrieve a single vehicle by primary key */
export async function getVehicleById(id: number): Promise<Vehicle | undefined> {
  const rows = await db.select().from(vehicle).where(eq(vehicle.vehicleId, id));
  return rows[0];
}

/** Retrieve a vehicle by plate number */
export async function getVehicleByPlateNumber(
  plateNumber: string,
): Promise<Vehicle | undefined> {
  const rows = await db
    .select()
    .from(vehicle)
    .where(eq(vehicle.plateNumber, plateNumber));
  return rows[0];
}

/** Retrieve all vehicles in a specific service category */
export async function getVehiclesByCategoryId(categoryId: number): Promise<Vehicle[]> {
  return db.select().from(vehicle).where(eq(vehicle.categoryId, categoryId));
}

/** Retrieve all vehicles of a specific brand */
export async function getVehiclesByBrandId(brandId: number): Promise<Vehicle[]> {
  return db.select().from(vehicle).where(eq(vehicle.brandId, brandId));
}

/** Retrieve all vehicles of a specific model */
export async function getVehiclesByModelId(modelId: number): Promise<Vehicle[]> {
  return db.select().from(vehicle).where(eq(vehicle.modelId, modelId));
}

/** Retrieve all vehicles filtered by status (e.g. AVAILABLE, RENTED) */
export async function getVehiclesByStatus(status: string): Promise<Vehicle[]> {
  return db.select().from(vehicle).where(eq(vehicle.status, status));
}

/** Insert a new vehicle */
export async function createVehicle(data: NewVehicle): Promise<void> {
  await db.insert(vehicle).values(data);
}

/** Update an existing vehicle by ID */
export async function updateVehicle(
  id: number,
  data: Partial<NewVehicle>,
): Promise<void> {
  await db.update(vehicle).set(data).where(eq(vehicle.vehicleId, id));
}

/** Delete a vehicle by ID */
export async function deleteVehicle(id: number): Promise<void> {
  await db.delete(vehicle).where(eq(vehicle.vehicleId, id));
}
