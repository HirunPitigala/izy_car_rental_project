import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { inspectionItems } from '@/src/db/schema';
import type { InspectionItem, NewInspectionItem } from '../types';

/** Retrieve all inspection items */
export async function getAllInspectionItems(): Promise<InspectionItem[]> {
  return db.select().from(inspectionItems);
}

/** Retrieve a single inspection item by primary key */
export async function getInspectionItemById(id: number): Promise<InspectionItem | undefined> {
  const rows = await db.select().from(inspectionItems).where(eq(inspectionItems.id, id));
  return rows[0];
}

/** Retrieve all items belonging to a specific inspection */
export async function getInspectionItemsByInspectionId(
  inspectionId: number,
): Promise<InspectionItem[]> {
  return db
    .select()
    .from(inspectionItems)
    .where(eq(inspectionItems.inspectionId, inspectionId));
}

/** Retrieve all inspection records for a specific checklist item */
export async function getInspectionItemsByItemId(itemId: number): Promise<InspectionItem[]> {
  return db.select().from(inspectionItems).where(eq(inspectionItems.itemId, itemId));
}

/** Insert a new inspection item record */
export async function createInspectionItem(data: NewInspectionItem): Promise<void> {
  await db.insert(inspectionItems).values(data);
}

/** Bulk-insert multiple inspection items for one inspection */
export async function createManyInspectionItems(
  data: NewInspectionItem[],
): Promise<void> {
  await db.insert(inspectionItems).values(data);
}

/** Update an existing inspection item by ID */
export async function updateInspectionItem(
  id: number,
  data: Partial<NewInspectionItem>,
): Promise<void> {
  await db.update(inspectionItems).set(data).where(eq(inspectionItems.id, id));
}

/** Delete an inspection item by ID */
export async function deleteInspectionItem(id: number): Promise<void> {
  await db.delete(inspectionItems).where(eq(inspectionItems.id, id));
}
