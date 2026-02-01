import { NextResponse } from "next/server";
import { authService } from "@/src/modules/auth/auth.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Basic validation before service call
        if (!body.email || !body.password || !body.confirmPassword) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        const result = await authService.registerCustomer({
            email: body.email,
            password: body.password,
            confirmPassword: body.confirmPassword
        });

        return NextResponse.json(
            { success: true, message: result.message },
            { status: 201 }
        );

    } catch (error: any) {
        if (error.message === "Passwords do not match" ||
            error.message === "Email already exists" ||
            error.message.includes("Password")) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        console.error("Registration error details:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
