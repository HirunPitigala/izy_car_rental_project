import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { manager } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            fullName, // Frontend sends 'fullName', mapping to 'name' in DB
            email,
            phone,
            password,
        } = body;

        // 1️⃣ Basic validation
        if (!fullName || !email || !phone || !password) {
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

        // 2️⃣ Check if email already exists
        const existing = await db
            .select()
            .from(manager)
            .where(eq(manager.email, email));

        if (existing.length > 0) {
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 409 }
            );
        }

        // 3️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4️⃣ Insert into database
        await db.insert(manager).values({
            name: fullName,
            email: email,
            phone: phone,
            password: hashedPassword,
        });

        // 5️⃣ Success response
        return NextResponse.json(
            { success: true, message: "Manager registered successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Manager registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
