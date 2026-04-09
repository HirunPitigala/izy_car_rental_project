import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { vehicleModel } from '@/src/db/schema';
import type { VehicleModel, NewVehicleModel } from '../types';

/** Retrieve all vehicle models */
export async function getAllVehicleModels(): Promise<VehicleModel[]> {
  return db.select().from(vehicleModel);
}

/** Retrieve a single vehicle model by primary key */
export async function getVehicleModelById(id: number): Promise<VehicleModel | undefined> {
  const rows = await db.select().from(vehicleModel).where(eq(vehicleModel.modelId, id));
  return rows[0];
}

/** Retrieve all models belonging to a specific brand */
export async function getVehicleModelsByBrandId(brandId: number): Promise<VehicleModel[]> {
  return db.select().from(vehicleModel).where(eq(vehicleModel.brandId, brandId));
}

/** Insert a new vehicle model */
export async function createVehicleModel(data: NewVehicleModel): Promise<void> {
  await db.insert(vehicleModel).values(data);
}

/** Update an existing vehicle model by ID */
export async function updateVehicleModel(
  id: number,
  data: Partial<NewVehicleModel>,
): Promise<void> {
  await db.update(vehicleModel).set(data).where(eq(vehicleModel.modelId, id));
}

/** Delete a vehicle model by ID */
export async function deleteVehicleModel(id: number): Promise<void> {
  await db.delete(vehicleModel).where(eq(vehicleModel.modelId, id));
}
