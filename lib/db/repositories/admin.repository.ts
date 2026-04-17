import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { admin } from '@/src/db/schema';
import type { Admin, NewAdmin } from '../types';

/** Retrieve all admin records */
export async function getAllAdmins(): Promise<Admin[]> {
  return db.select().from(admin);
}

/** Retrieve a single admin by primary key */
export async function getAdminById(id: number): Promise<Admin | undefined> {
  const rows = await db.select().from(admin).where(eq(admin.adminId, id));
  return rows[0];
}

/** Retrieve a single admin by email */
export async function getAdminByEmail(email: string): Promise<Admin | undefined> {
  const rows = await db.select().from(admin).where(eq(admin.email, email));
  return rows[0];
}

/** Insert a new admin record */
export async function createAdmin(data: NewAdmin): Promise<void> {
  await db.insert(admin).values(data);
}

/** Update an existing admin by ID */
export async function updateAdmin(id: number, data: Partial<NewAdmin>): Promise<void> {
  await db.update(admin).set(data).where(eq(admin.adminId, id));
}

/** Delete an admin by ID */
export async function deleteAdmin(id: number): Promise<void> {
  await db.delete(admin).where(eq(admin.adminId, id));
}
