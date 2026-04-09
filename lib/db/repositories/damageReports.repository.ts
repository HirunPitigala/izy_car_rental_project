import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { damageReports } from '@/src/db/schema';
import type { DamageReport, NewDamageReport } from '../types';

/** Retrieve all damage reports */
export async function getAllDamageReports(): Promise<DamageReport[]> {
  return db.select().from(damageReports);
}

/** Retrieve a single damage report by primary key */
export async function getDamageReportById(id: number): Promise<DamageReport | undefined> {
  const rows = await db.select().from(damageReports).where(eq(damageReports.damageId, id));
  return rows[0];
}

/** Retrieve all damage reports for a specific inspection */
export async function getDamageReportsByInspectionId(
  inspectionId: number,
): Promise<DamageReport[]> {
  return db
    .select()
    .from(damageReports)
    .where(eq(damageReports.inspectionId, inspectionId));
}

/** Insert a new damage report */
export async function createDamageReport(data: NewDamageReport): Promise<void> {
  await db.insert(damageReports).values(data);
}

/** Bulk-insert multiple damage reports for one inspection */
export async function createManyDamageReports(data: NewDamageReport[]): Promise<void> {
  await db.insert(damageReports).values(data);
}

/** Update an existing damage report by ID */
export async function updateDamageReport(
  id: number,
  data: Partial<NewDamageReport>,
): Promise<void> {
  await db.update(damageReports).set(data).where(eq(damageReports.damageId, id));
}

/** Delete a damage report by ID */
export async function deleteDamageReport(id: number): Promise<void> {
  await db.delete(damageReports).where(eq(damageReports.damageId, id));
}
