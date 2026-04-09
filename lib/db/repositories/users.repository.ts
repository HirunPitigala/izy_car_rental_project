import { eq } from 'drizzle-orm';
import { db } from '@/src/db';
import { users } from '@/src/db/schema';
import type { User, NewUser } from '../types';

/** Retrieve all users */
export async function getAllUsers(): Promise<User[]> {
  return db.select().from(users);
}

/** Retrieve a single user by primary key */
export async function getUserById(id: number): Promise<User | undefined> {
  const rows = await db.select().from(users).where(eq(users.userId, id));
  return rows[0];
}

/** Retrieve a user by email address */
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const rows = await db.select().from(users).where(eq(users.email, email));
  return rows[0];
}

/** Retrieve all users filtered by role (admin, manager, customer, employee) */
export async function getUsersByRole(role: string): Promise<User[]> {
  return db.select().from(users).where(eq(users.role, role));
}

/** Retrieve all users filtered by account status */
export async function getUsersByStatus(status: string): Promise<User[]> {
  return db.select().from(users).where(eq(users.status, status));
}

/** Retrieve a user by their related role-specific ID (relatedId) */
export async function getUserByRelatedId(relatedId: number): Promise<User | undefined> {
  const rows = await db.select().from(users).where(eq(users.relatedId, relatedId));
  return rows[0];
}

/** Insert a new user */
export async function createUser(data: NewUser): Promise<void> {
  await db.insert(users).values(data);
}

/** Update an existing user by ID */
export async function updateUser(id: number, data: Partial<NewUser>): Promise<void> {
  await db.update(users).set(data).where(eq(users.userId, id));
}

/** Delete a user by ID */
export async function deleteUser(id: number): Promise<void> {
  await db.delete(users).where(eq(users.userId, id));
}
