import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { employee } from '@/src/db/schema';
import type { Employee, NewEmployee } from '../types';

/** Retrieve all employees */
export async function getAllEmployees(): Promise<Employee[]> {
  return db.select().from(employee);
}

/** Retrieve a single employee by primary key */
export async function getEmployeeById(id: number): Promise<Employee | undefined> {
  const rows = await db.select().from(employee).where(eq(employee.employeeId, id));
  return rows[0];
}

/** Retrieve a single employee by email */
export async function getEmployeeByEmail(email: string): Promise<Employee | undefined> {
  const rows = await db.select().from(employee).where(eq(employee.email, email));
  return rows[0];
}

/** Retrieve all employees filtered by status (e.g. PENDING, ACTIVE) */
export async function getEmployeesByStatus(status: string): Promise<Employee[]> {
  return db.select().from(employee).where(eq(employee.status, status));
}

/** Insert a new employee */
export async function createEmployee(data: NewEmployee): Promise<void> {
  await db.insert(employee).values(data);
}

/** Update an existing employee by ID */
export async function updateEmployee(
  id: number,
  data: Partial<NewEmployee>,
): Promise<void> {
  await db.update(employee).set(data).where(eq(employee.employeeId, id));
}

/** Delete an employee by ID */
export async function deleteEmployee(id: number): Promise<void> {
  await db.delete(employee).where(eq(employee.employeeId, id));
}
