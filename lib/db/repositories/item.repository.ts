import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { item } from '@/src/db/schema';
import type { Item, NewItem } from '../types';

/** Retrieve all checklist items */
export async function getAllItems(): Promise<Item[]> {
  return db.select().from(item);
}

/** Retrieve a single checklist item by primary key */
export async function getItemById(id: number): Promise<Item | undefined> {
  const rows = await db.select().from(item).where(eq(item.itemId, id));
  return rows[0];
}

/** Retrieve all items filtered by status */
export async function getItemsByStatus(status: string): Promise<Item[]> {
  return db.select().from(item).where(eq(item.status, status));
}

/** Insert a new checklist item */
export async function createItem(data: NewItem): Promise<void> {
  await db.insert(item).values(data);
}

/** Update an existing checklist item by ID */
export async function updateItem(id: number, data: Partial<NewItem>): Promise<void> {
  await db.update(item).set(data).where(eq(item.itemId, id));
}

/** Delete a checklist item by ID */
export async function deleteItem(id: number): Promise<void> {
  await db.delete(item).where(eq(item.itemId, id));
}
