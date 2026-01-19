import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { admin, manager, employee, customer, session } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        let user = null;
        let role = "";
        let userId: number | undefined;

        // 1. Check Admin
        if (!user) {
            try {
                const [adminUser] = await db.select().from(admin).where(eq(admin.email, email)).limit(1);
                if (adminUser && adminUser.password) {
                    const passwordMatch = await bcrypt.compare(password, adminUser.password);
                    if (passwordMatch) {
                        user = adminUser;
                        role = "admin";
                        userId = adminUser.adminId;
                    } else {
                        // Found user but wrong password - strict security
                        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
                    }
                }
            } catch (e) {
                console.error("Error querying admin:", e);
            }
        }

        // 2. Check Manager
        if (!user) {
            try {
                const [managerUser] = await db.select().from(manager).where(eq(manager.email, email)).limit(1);
                if (managerUser && managerUser.password) {
                    const passwordMatch = await bcrypt.compare(password, managerUser.password);
                    if (passwordMatch) {
                        user = managerUser;
                        role = "manager";
                        userId = managerUser.managerId;
                    } else {
                        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
                    }
                }
            } catch (e) {
                console.error("Error querying manager:", e);
            }
        }

        // 3. Check Employee
        if (!user) {
            try {
                const [employeeUser] = await db.select().from(employee).where(eq(employee.email, email)).limit(1);
                if (employeeUser && employeeUser.password) {
                    const passwordMatch = await bcrypt.compare(password, employeeUser.password);
                    if (passwordMatch) {
                        user = employeeUser;
                        role = "employee";
                        userId = employeeUser.employeeId;
                    } else {
                        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
                    }
                }
            } catch (e) {
                console.error("Error querying employee:", e);
            }
        }

        // 4. Check Customer
        if (!user) {
            try {
                const [customerUser] = await db.select().from(customer).where(eq(customer.email, email)).limit(1);
                if (customerUser && customerUser.password) {
                    const passwordMatch = await bcrypt.compare(password, customerUser.password);
                    if (passwordMatch) {
                        user = customerUser;
                        role = "customer";
                        userId = customerUser.customerId;
                    } else {
                        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
                    }
                }
            } catch (e) {
                console.error("Error querying customer:", e);
            }
        }

        if (!user || !role || !userId) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // --- Session Creation ---
        const sessionId = uuidv4();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

        await db.insert(session).values({
            id: sessionId,
            userId: userId,
            role: role,
            expiresAt: expiresAt,
        });

        const cookieStore = await cookies();
        cookieStore.set("session_id", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: expiresAt,
        });

        return NextResponse.json({ role });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
