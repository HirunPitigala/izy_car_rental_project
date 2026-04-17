import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { driver } from '@/src/db/schema';
import type { Driver, NewDriver } from '../types';

/** Retrieve all drivers */
export async function getAllDrivers(): Promise<Driver[]> {
  return db.select().from(driver);
}

/** Retrieve a single driver by primary key */
export async function getDriverById(id: number): Promise<Driver | undefined> {
  const rows = await db.select().from(driver).where(eq(driver.driverId, id));
  return rows[0];
}

/** Retrieve all drivers assigned to a specific vehicle */
export async function getDriversByVehicleId(vehicleId: number): Promise<Driver[]> {
  return db.select().from(driver).where(eq(driver.vehicleId, vehicleId));
}

/** Retrieve all drivers managed by a specific admin */
export async function getDriversByAdminId(adminId: number): Promise<Driver[]> {
  return db.select().from(driver).where(eq(driver.adminId, adminId));
}

/** Retrieve all drivers filtered by availability status */
export async function getDriversByAvailability(status: string): Promise<Driver[]> {
  return db.select().from(driver).where(eq(driver.availabilityStatus, status));
}

/** Insert a new driver */
export async function createDriver(data: NewDriver): Promise<void> {
  await db.insert(driver).values(data);
}

/** Update an existing driver by ID */
export async function updateDriver(id: number, data: Partial<NewDriver>): Promise<void> {
  await db.update(driver).set(data).where(eq(driver.driverId, id));
}

/** Delete a driver by ID */
export async function deleteDriver(id: number): Promise<void> {
  await db.delete(driver).where(eq(driver.driverId, id));
}
