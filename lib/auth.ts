
import { db } from "@/lib/db";
import { users } from "@/src/db/schema";
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
            userData = {
                name: "System Admin",
                email: process.env.ADMIN_EMAIL || null
            };
        } else {
            const [u] = await db.select({ name: users.name, email: users.email }).from(users).where(eq(users.id, userId));
            if (u) {
                userData = { name: u.name, email: u.email };
            }
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
