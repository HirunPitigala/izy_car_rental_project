import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { vehicleBrand } from '@/src/db/schema';
import type { VehicleBrand, NewVehicleBrand } from '../types';

/** Retrieve all vehicle brands */
export async function getAllVehicleBrands(): Promise<VehicleBrand[]> {
  return db.select().from(vehicleBrand);
}

/** Retrieve a single vehicle brand by primary key */
export async function getVehicleBrandById(id: number): Promise<VehicleBrand | undefined> {
  const rows = await db.select().from(vehicleBrand).where(eq(vehicleBrand.brandId, id));
  return rows[0];
}

/** Retrieve a vehicle brand by exact name */
export async function getVehicleBrandByName(
  name: string,
): Promise<VehicleBrand | undefined> {
  const rows = await db
    .select()
    .from(vehicleBrand)
    .where(eq(vehicleBrand.brandName, name));
  return rows[0];
}

/** Insert a new vehicle brand */
export async function createVehicleBrand(data: NewVehicleBrand): Promise<void> {
  await db.insert(vehicleBrand).values(data);
}

/** Update an existing vehicle brand by ID */
export async function updateVehicleBrand(
  id: number,
  data: Partial<NewVehicleBrand>,
): Promise<void> {
  await db.update(vehicleBrand).set(data).where(eq(vehicleBrand.brandId, id));
}

/** Delete a vehicle brand by ID */
export async function deleteVehicleBrand(id: number): Promise<void> {
  await db.delete(vehicleBrand).where(eq(vehicleBrand.brandId, id));
}
