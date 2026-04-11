import { NextResponse } from "next/server";
import { authService } from "@/src/modules/auth/auth.service";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    console.log("API: Received verification request for token:", token);

    if (!token) {
        console.error("API: Missing token in request");
        return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    try {
        const result = await authService.verifyEmail(token);
        console.log("API: Verification successful for token:", token);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("API: Verification error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
