
import { db } from "@/lib/db";
import { session, admin, manager, customer, employee } from "@/src/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { cookies } from "next/headers";

export type Role = "admin" | "manager" | "customer" | "employee";

export interface UserSession {
    id: string;
    userId: number;
    role: Role;
    expiresAt: Date;
    user?: {
        name: string | null;
        email: string | null;
    };
}

export async function getSession(): Promise<UserSession | null> {
    try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get("session_id")?.value;

        if (!sessionId) {
            return null;
        }

        // Find valid session
        const [sessionData] = await db
            .select()
            .from(session)
            .where(
                and(
                    eq(session.id, sessionId),
                    gt(session.expiresAt, new Date()) // Check if not expired
                )
            )
            .limit(1);

        if (!sessionData) {
            return null;
        }

        // Fetch basic user info based on role to display in navbar
        let userData: { name: string | null; email: string | null } | undefined;
        const role = sessionData.role as Role;

        if (role === 'admin') {
            const [u] = await db.select({ name: admin.name, email: admin.email }).from(admin).where(eq(admin.adminId, sessionData.userId));
            userData = u;
        } else if (role === 'manager') {
            const [u] = await db.select({ name: manager.name, email: manager.email }).from(manager).where(eq(manager.managerId, sessionData.userId));
            userData = u;
        } else if (role === 'customer') {
            const [u] = await db.select({ name: customer.fullName, email: customer.email }).from(customer).where(eq(customer.customerId, sessionData.userId));
            // Map fullName to name for consistency
            if (u) userData = { name: u.name, email: u.email };
        } else if (role === 'employee') {
            const [u] = await db.select({ name: employee.name, email: employee.email }).from(employee).where(eq(employee.employeeId, sessionData.userId));
            userData = u;
        }

        return {
            id: sessionData.id,
            userId: sessionData.userId,
            role: role,
            expiresAt: sessionData.expiresAt,
            user: userData
        };
    } catch (error) {
        console.error("Error fetching session:", error);
        return null;
    }
}
