import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db"; // adjust path if your db file is elsewhere
import { customer, users } from "@/src/db/schema"; // adjust path if schema file is elsewhere
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { email, password, confirmPassword } = body;

        //  Basic validation
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

        //  Check if email already exists in users table (central auth)
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

        //  Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into customer table
        const [result] = await db.insert(customer).values({
            fullName: "New Customer",
            email: email,
            phone: "",
            password: hashedPassword,

            // Optional fields (can be null for now)
            nic: null,
            address: null,
            username: email, // using email as username for now
            licenseNumber: null,

            registrationDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD
            termsAccepted: 1, // true
        });

        const customerId = (result as any).insertId;

        // Insert into central users table for authentication
        await db.insert(users).values({
            email: email,
            passwordHash: hashedPassword,
            role: "customer",
            relatedId: customerId,
            status: "active"
        });

        //  Success response
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
