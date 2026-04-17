import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { manager } from '@/src/db/schema';
import type { Manager, NewManager } from '../types';

/** Retrieve all managers */
export async function getAllManagers(): Promise<Manager[]> {
  return db.select().from(manager);
}

/** Retrieve a single manager by primary key */
export async function getManagerById(id: number): Promise<Manager | undefined> {
  const rows = await db.select().from(manager).where(eq(manager.managerId, id));
  return rows[0];
}

/** Retrieve a single manager by email */
export async function getManagerByEmail(email: string): Promise<Manager | undefined> {
  const rows = await db.select().from(manager).where(eq(manager.email, email));
  return rows[0];
}

/** Insert a new manager */
export async function createManager(data: NewManager): Promise<void> {
  await db.insert(manager).values(data);
}

/** Update an existing manager by ID */
export async function updateManager(
  id: number,
  data: Partial<NewManager>,
): Promise<void> {
  await db.update(manager).set(data).where(eq(manager.managerId, id));
}

/** Delete a manager by ID */
export async function deleteManager(id: number): Promise<void> {
  await db.delete(manager).where(eq(manager.managerId, id));
}
