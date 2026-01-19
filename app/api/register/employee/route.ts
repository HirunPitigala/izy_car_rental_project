import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { employee } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { name, email, phone, password, confirmPassword } = body;

        // 1️⃣ Basic validation
        if (!name || !email || !phone || !password || !confirmPassword) {
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

        // 2️⃣ Check if email already exists
        const existing = await db
            .select()
            .from(employee)
            .where(eq(employee.email, email));

        if (existing.length > 0) {
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 409 }
            );
        }

        // 3️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4️⃣ Insert into database
        await db.insert(employee).values({
            name: name,
            email: email,
            phone: phone,
            password: hashedPassword,
        });

        // 5️⃣ Success response
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
