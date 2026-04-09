import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { inspection } from '@/src/db/schema';
import type { Inspection, NewInspection } from '../types';

/** Retrieve all inspections */
export async function getAllInspections(): Promise<Inspection[]> {
  return db.select().from(inspection);
}

/** Retrieve a single inspection by primary key */
export async function getInspectionById(id: number): Promise<Inspection | undefined> {
  const rows = await db.select().from(inspection).where(eq(inspection.inspectionId, id));
  return rows[0];
}

/** Retrieve all inspections for a specific booking */
export async function getInspectionsByBookingId(bookingId: number): Promise<Inspection[]> {
  return db.select().from(inspection).where(eq(inspection.bookingId, bookingId));
}

/** Retrieve all inspections performed by a specific employee */
export async function getInspectionsByEmployeeId(employeeId: number): Promise<Inspection[]> {
  return db.select().from(inspection).where(eq(inspection.employeeId, employeeId));
}

/** Retrieve inspections filtered by type (BEFORE / AFTER) */
export async function getInspectionsByType(
  type: 'BEFORE' | 'AFTER',
): Promise<Inspection[]> {
  return db.select().from(inspection).where(eq(inspection.inspectionType, type));
}

/** Insert a new inspection record */
export async function createInspection(data: NewInspection): Promise<void> {
  await db.insert(inspection).values(data);
}

/** Update an existing inspection by ID */
export async function updateInspection(
  id: number,
  data: Partial<NewInspection>,
): Promise<void> {
  await db.update(inspection).set(data).where(eq(inspection.inspectionId, id));
}

/** Delete an inspection by ID */
export async function deleteInspection(id: number): Promise<void> {
  await db.delete(inspection).where(eq(inspection.inspectionId, id));
}
