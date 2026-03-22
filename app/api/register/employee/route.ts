import { NextResponse } from "next/server";
import { authService } from "@/src/modules/auth/auth.service";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        // Only Admin can register employees
        const session = await getSession();
        if (!session || session.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized. Only administrators can perform this action." },
                { status: 403 }
            );
        }

        const body = await req.json();

        // Basic validation
        if (!body.email || !body.password || !body.confirmPassword) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        const result = await authService.registerEmployee({
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

        console.error("Employee registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
