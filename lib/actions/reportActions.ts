"use server";

import { db } from "@/src/db";
import { booking, vehicle, vehicleBrand, vehicleModel, serviceCategory } from "@/src/db/schema";
import { eq, and, gte, lte, sql, sum, count } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function getDailyReportData(dateStr: string) {
    try {
        const session = await getSession();
        if (!session || (session.role !== "admin" && session.role !== "manager")) {
            return { success: false, error: "Unauthorized" };
        }

        const start = `${dateStr} 00:00:00`;
        const end = `${dateStr} 23:59:59`;

        const results = await db.select({
            id: booking.bookingId,
            customerName: booking.customerFullName,
            email: sql<string>`(SELECT email FROM users WHERE users.user_id = ${booking.userId})`,
            phoneNumber: booking.customerPhoneNumber1,
            licenseNumber: booking.customerLicenseNo,
            address: booking.customerAddress,
            vehicleNumber: vehicle.plateNumber,
            vehicleName: sql<string>`CONCAT(${vehicleBrand.brandName}, ' ', ${vehicleModel.modelName})`,
            revenue: booking.totalFare,
            date: booking.rentalDate,
            status: booking.status
        })
        .from(booking)
        .leftJoin(vehicle, eq(booking.vehicleId, vehicle.vehicleId))
        .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
        .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
        .where(
            and(
                gte(booking.rentalDate, new Date(start)),
                lte(booking.rentalDate, new Date(end))
            )
        )
        .orderBy(booking.rentalDate);

        // Sum revenue
        const totalRevenue = results.reduce((acc, curr) => acc + parseFloat(curr.revenue?.toString() || "0"), 0);

        return {
            success: true,
            data: {
                date: dateStr,
                totalRevenue,
                reservations: results
            }
        };
    } catch (error) {
        console.error("Daily report error:", error);
        return { success: false, error: "Failed to fetch daily report" };
    }
}

export async function getWeeklyReportData(startDate: string, endDate: string) {
    try {
        const session = await getSession();
        if (!session || (session.role !== "admin" && session.role !== "manager")) {
            return { success: false, error: "Unauthorized" };
        }

        const start = `${startDate} 00:00:00`;
        const end = `${endDate} 23:59:59`;

        const results = await db.select({
            id: booking.bookingId,
            customerName: booking.customerFullName,
            revenue: booking.totalFare,
            date: booking.rentalDate,
            vehicleNumber: vehicle.plateNumber,
            status: booking.status
        })
        .from(booking)
        .leftJoin(vehicle, eq(booking.vehicleId, vehicle.vehicleId))
        .where(
            and(
                gte(booking.rentalDate, new Date(start)),
                lte(booking.rentalDate, new Date(end))
            )
        )
        .orderBy(booking.rentalDate);

        // Calculate daily breakdown
        const totalRevenue = results.reduce((acc, curr) => acc + parseFloat(curr.revenue?.toString() || "0"), 0);
        
        return {
            success: true,
            data: {
                range: `${startDate} - ${endDate}`,
                totalRevenue,
                reservations: results
            }
        };
    } catch (error) {
        console.error("Weekly report error:", error);
        return { success: false, error: "Failed to fetch weekly report" };
    }
}

export async function getMonthlyReportData(year: number, month: number) {
    try {
        const session = await getSession();
        if (!session || (session.role !== "admin" && session.role !== "manager")) {
            return { success: false, error: "Unauthorized" };
        }

        // month is 1-indexed here for SQL comfort
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01 00:00:00`;
        const lastDay = new Date(year, month, 0).getDate();
        const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay} 23:59:59`;

        const results = await db.select({
            id: booking.bookingId,
            customerName: booking.customerFullName,
            revenue: booking.totalFare,
            date: booking.rentalDate,
            vehicleNumber: vehicle.plateNumber,
            status: booking.status
        })
        .from(booking)
        .leftJoin(vehicle, eq(booking.vehicleId, vehicle.vehicleId))
        .where(
            and(
                gte(booking.rentalDate, new Date(startDate)),
                lte(booking.rentalDate, new Date(endDate))
            )
        )
        .orderBy(booking.rentalDate);

        const totalRevenue = results.reduce((acc, curr) => acc + parseFloat(curr.revenue?.toString() || "0"), 0);

        return {
            success: true,
            data: {
                month: new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' }),
                totalRevenue,
                reservations: results
            }
        };
    } catch (error) {
        console.error("Monthly report error:", error);
        return { success: false, error: "Failed to fetch monthly report" };
    }
}
