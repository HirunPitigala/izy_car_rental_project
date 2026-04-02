import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getWeddingCarInquiries, markWeddingInquiryContacted } from "@/lib/actions/weddingActions";

/**
 * GET /api/wedding
 * Employee / Admin: fetch wedding car inquiries.
 */
export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session || (session.role !== "employee" && session.role !== "admin" && session.role !== "manager")) {
            return NextResponse.json({ error: "Forbidden." }, { status: 403 });
        }

        const result = await getWeddingCarInquiries();
        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error("[GET /api/wedding] Error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}

/**
 * PATCH /api/wedding
 * Employee / Admin: mark wedding inquiry as contacted.
 * Body: { id: number }
 */
export async function PATCH(req: Request) {
    try {
        const session = await getSession();
        if (!session || (session.role !== "employee" && session.role !== "admin" && session.role !== "manager")) {
            return NextResponse.json({ error: "Forbidden." }, { status: 403 });
        }

        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: "id is required." }, { status: 400 });
        }

        const result = await markWeddingInquiryContacted(id);
        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error("[PATCH /api/wedding] Error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
