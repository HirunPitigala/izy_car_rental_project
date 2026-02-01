import { NextResponse } from "next/server";
import { authService } from "@/src/modules/auth/auth.service";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
        return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    try {
        const result = await authService.verifyEmail(token);
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
