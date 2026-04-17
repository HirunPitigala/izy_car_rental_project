import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDashboardStats, getChartData, getYearlyChartData } from "@/lib/db/repositories/analytics.repository";

export async function GET() {
    try {
        const session = await getSession();
        if (!session || (session.role !== "admin" && session.role !== "manager")) {
            return NextResponse.json({ error: "Forbidden. Admin access only." }, { status: 403 });
        }

        const stats = await getDashboardStats();
        const last10Days = await getChartData(10);
        const last30Days = await getChartData(30);
        const last12Months = await getYearlyChartData();

        return NextResponse.json({
            success: true,
            data: {
                stats,
                charts: {
                    last10Days,
                    last30Days,
                    last12Months,
                }
            }
        });

    } catch (error: any) {
        console.error("[GET /api/admin/analytics] Error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
