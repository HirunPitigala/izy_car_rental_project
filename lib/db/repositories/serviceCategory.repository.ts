import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { serviceCategory } from '@/src/db/schema';
import type { ServiceCategory, NewServiceCategory } from '../types';

/** Retrieve all service categories */
export async function getAllServiceCategories(): Promise<ServiceCategory[]> {
  return db.select().from(serviceCategory);
}

/** Retrieve a single service category by primary key */
export async function getServiceCategoryById(
  id: number,
): Promise<ServiceCategory | undefined> {
  const rows = await db
    .select()
    .from(serviceCategory)
    .where(eq(serviceCategory.categoryId, id));
  return rows[0];
}

/** Retrieve a service category by exact name */
export async function getServiceCategoryByName(
  name: string,
): Promise<ServiceCategory | undefined> {
  const rows = await db
    .select()
    .from(serviceCategory)
    .where(eq(serviceCategory.categoryName, name));
  return rows[0];
}

/** Insert a new service category */
export async function createServiceCategory(data: NewServiceCategory): Promise<void> {
  await db.insert(serviceCategory).values(data);
}

/** Update an existing service category by ID */
export async function updateServiceCategory(
  id: number,
  data: Partial<NewServiceCategory>,
): Promise<void> {
  await db.update(serviceCategory).set(data).where(eq(serviceCategory.categoryId, id));
}

/** Delete a service category by ID */
export async function deleteServiceCategory(id: number): Promise<void> {
  await db.delete(serviceCategory).where(eq(serviceCategory.categoryId, id));
}
