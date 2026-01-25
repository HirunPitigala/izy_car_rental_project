import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { employee, users } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { email, password, confirmPassword } = body;

        // 1️⃣ Basic validation
        if (!email || !password || !confirmPassword) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { error: "Passwords do not match" },
                { status: 400 }
            );
        }

        // 2️⃣ Check if email already exists in users table (central auth)
        const existingInUsers = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

        if (existingInUsers.length > 0) {
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 409 }
            );
        }

        // 3️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4️⃣ Insert into employee table
        const [result] = await db.insert(employee).values({
            name: "New Employee", // Default name
            email: email,
            phone: "", // Default phone
            password: hashedPassword,
        });

        const employeeId = (result as any).insertId;

        // 5️⃣ Insert into central users table for authentication
        await db.insert(users).values({
            email: email,
            passwordHash: hashedPassword,
            role: "employee",
            relatedId: employeeId,
            status: "active"
        });

        // 6️⃣ Success response
        return NextResponse.json(
            { success: true, message: "Employee registered successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Employee registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
