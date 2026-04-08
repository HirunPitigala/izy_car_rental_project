
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { item } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const items = await db.select().from(item).where(eq(item.status, "active"));
        return NextResponse.json({ success: true, data: items });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
