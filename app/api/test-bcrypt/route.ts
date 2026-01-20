
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET() {
    const password = "admin123";
    const hash = await bcrypt.hash(password, 10);
    const match = await bcrypt.compare(password, hash);
    return NextResponse.json({
        password,
        hash,
        match,
        bcryptVersion: "bcrypt (native)"
    });
}
