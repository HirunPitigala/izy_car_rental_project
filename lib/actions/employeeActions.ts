"use server";

import { db } from "@/lib/db";
import { employee, users } from "@/src/db/schema";
import { asc, eq } from "drizzle-orm";

/**
 * Fetches all employees from the database, ordered by name.
 * Used for admin booking assignment.
 */
export async function getAllEmployees() {
    try {
        const results = await db.select({
            employeeId: employee.employeeId,
            name: employee.name,
            email: employee.email,
            phone: employee.phone,
            status: employee.status,
        })
        .from(employee)
        .orderBy(asc(employee.name));

        return { success: true, data: results };
    } catch (error) {
        console.error("Fetch Employees Error:", error);
        return { success: false, error: "Failed to fetch employees" };
    }
}

export async function updateEmployeeStatus(employeeId: number, status: string) {
    try {
        await db.update(employee)
            .set({ status })
            .where(eq(employee.employeeId, employeeId));

        // If approved, ensure the associated user record is also active
        if (status === "APPROVED") {
            const [emp] = await db.select().from(employee).where(eq(employee.employeeId, employeeId));
            if (emp) {
                await db.update(users)
                    .set({ status: "active" })
                    .where(eq(users.email, emp.email!));
            }
        } else if (status === "DEACTIVATED") {
            const [emp] = await db.select().from(employee).where(eq(employee.employeeId, employeeId));
            if (emp) {
                await db.update(users)
                    .set({ status: "inactive" })
                    .where(eq(users.email, emp.email!));
            }
        }

        return { success: true };
    } catch (error) {
        console.error("Update Employee Status Error:", error);
        return { success: false, error: "Failed to update employee status" };
    }
}

export async function deleteEmployee(employeeId: number) {
    try {
        // Find employee email first to delete user record
        const [emp] = await db.select().from(employee).where(eq(employee.employeeId, employeeId));
        
        if (emp) {
            // 1. Delete user record
            await db.delete(users).where(eq(users.email, emp.email!));
            // 2. Delete employee record
            await db.delete(employee).where(eq(employee.employeeId, employeeId));
        }

        return { success: true };
    } catch (error) {
        console.error("Delete Employee Error:", error);
        return { success: false, error: "Failed to delete employee. They may have assigned tasks." };
    }
}
