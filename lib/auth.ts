
import { db } from "@/lib/db";
import { admin, manager, customer, employee } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export type Role = "admin" | "manager" | "customer" | "employee";

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export interface UserSession {
    userId: number;
    relatedId?: number; // The ID in the role-specific table (admin_id, customer_id, etc)
    role: Role;
    expiresAt: Date;
    user?: {
        name: string | null;
        email: string | null;
    };
}

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}

export async function getSession(): Promise<UserSession | null> {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session")?.value;

        if (!sessionToken) {
            return null;
        }

        const decoded = await decrypt(sessionToken);
        if (!decoded) {
            return null;
        }

        const role = decoded.role as Role;
        const userId = decoded.userId as number;
        const relatedId = decoded.relatedId as number | undefined;

        // Fetch basic user info based on role to display in navbar
        let userData: { name: string | null; email: string | null } | undefined;

        // Use relatedId if available (new auth), otherwise fallback to userId (old auth)
        const idToUse = relatedId || userId;

        if (role === 'admin') {
            const [u] = await db.select({ name: admin.name, email: admin.email }).from(admin).where(eq(admin.adminId, idToUse));
            userData = u;
        } else if (role === 'manager') {
            const [u] = await db.select({ name: manager.name, email: manager.email }).from(manager).where(eq(manager.managerId, idToUse));
            userData = u;
        } else if (role === 'customer') {
            const [u] = await db.select({ name: customer.fullName, email: customer.email }).from(customer).where(eq(customer.customerId, idToUse));
            if (u) userData = { name: u.name, email: u.email };
        } else if (role === 'employee') {
            const [u] = await db.select({ name: employee.name, email: employee.email }).from(employee).where(eq(employee.employeeId, idToUse));
            userData = u;
        }

        return {
            userId: userId,
            relatedId: relatedId,
            role: role,
            expiresAt: new Date(decoded.exp * 1000),
            user: userData
        };
    } catch (error) {
        // console.error("Error fetching session:", error);
        return null;
    }
}
