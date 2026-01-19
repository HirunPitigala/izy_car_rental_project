import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db"; // adjust path if your db file is elsewhere
import { customer } from "@/drizzle/schema"; // adjust path if schema file is elsewhere
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            fullName,
            email,
            phone,
            password,
            confirmPassword,
        } = body;

        // 1️⃣ Basic validation
        if (!fullName || !email || !phone || !password || !confirmPassword) {
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
            .from(customer)
            .where(eq(customer.email, email));

        if (existing.length > 0) {
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 409 }
            );
        }

        // 3️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4️⃣ Insert into database
        await db.insert(customer).values({
            fullName: fullName,
            email: email,
            phone: phone,
            password: hashedPassword,

            // Optional fields (can be null for now)
            nic: null,
            address: null,
            username: email, // using email as username for now
            licenseNumber: null,

            registrationDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD
            termsAccepted: 1, // true
        });

        // 5️⃣ Success response
        return NextResponse.json(
            { success: true, message: "Customer registered successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
