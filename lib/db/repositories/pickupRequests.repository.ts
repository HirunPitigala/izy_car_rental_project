import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { pickupRequests } from '@/src/db/schema';
import type { PickupRequest, NewPickupRequest } from '../types';

/** Retrieve all pickup requests */
export async function getAllPickupRequests(): Promise<PickupRequest[]> {
  return db.select().from(pickupRequests);
}

/** Retrieve a single pickup request by primary key */
export async function getPickupRequestById(id: number): Promise<PickupRequest | undefined> {
  const rows = await db.select().from(pickupRequests).where(eq(pickupRequests.id, id));
  return rows[0];
}

/** Retrieve all pickup requests made by a specific customer (user ID) */
export async function getPickupRequestsByCustomerId(
  customerId: number,
): Promise<PickupRequest[]> {
  return db.select().from(pickupRequests).where(eq(pickupRequests.customerId, customerId));
}

/** Retrieve all pickup requests for a specific vehicle */
export async function getPickupRequestsByVehicleId(
  vehicleId: number,
): Promise<PickupRequest[]> {
  return db.select().from(pickupRequests).where(eq(pickupRequests.vehicleId, vehicleId));
}

/** Retrieve all pickup requests assigned to a specific employee */
export async function getPickupRequestsByEmployeeId(
  employeeId: number,
): Promise<PickupRequest[]> {
  return db
    .select()
    .from(pickupRequests)
    .where(eq(pickupRequests.assignedEmployeeId, employeeId));
}

/** Retrieve all pickup requests filtered by status */
export async function getPickupRequestsByStatus(status: string): Promise<PickupRequest[]> {
  return db.select().from(pickupRequests).where(eq(pickupRequests.status, status));
}

/** Insert a new pickup request */
export async function createPickupRequest(data: NewPickupRequest): Promise<void> {
  await db.insert(pickupRequests).values(data);
}

/** Update an existing pickup request by ID */
export async function updatePickupRequest(
  id: number,
  data: Partial<NewPickupRequest>,
): Promise<void> {
  await db.update(pickupRequests).set(data).where(eq(pickupRequests.id, id));
}

/** Delete a pickup request by ID */
export async function deletePickupRequest(id: number): Promise<void> {
  await db.delete(pickupRequests).where(eq(pickupRequests.id, id));
}
