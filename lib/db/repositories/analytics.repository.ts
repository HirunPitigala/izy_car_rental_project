import { db } from '@/src/db';
import { users, booking, vehicle, payment } from '@/src/db/schema';
import { eq, and, gte, lt, lte, sql, count, sum } from 'drizzle-orm';

export interface AnalyticsStats {
    totalCustomersToday: number;
    vehiclesOnRent: number;
    overdueVehicles: number;
    todayIncome: number;
}

export interface ChartData {
    name: string;
    customers: number;
    reservations: number;
    income: number;
}

export async function getDashboardStats(): Promise<AnalyticsStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 1. Total Customers Today
    const [customerCount] = await db
        .select({ value: count() })
        .from(users)
        .where(
            and(
                eq(users.role, 'CUSTOMER'),
                gte(users.createdAt, today),
                lt(users.createdAt, tomorrow)
            )
        );

    // 2. Vehicles on Rent
    const [rentedCount] = await db
        .select({ value: count() })
        .from(vehicle)
        .where(eq(vehicle.status, 'RENTED'));

    // 3. Overdue Vehicles
    const [overdueCount] = await db
        .select({ value: count() })
        .from(booking)
        .where(
            and(
                lt(booking.returnDate, new Date()),
                sql`${booking.status} NOT IN ('COMPLETED', 'CANCELLED', 'REJECTED')`
            )
        );

    // 4. Today's Income
    const [incomeSum] = await db
        .select({ value: sum(payment.amount) })
        .from(payment)
        .where(
            and(
                gte(payment.paymentDate, today.toISOString()),
                lt(payment.paymentDate, tomorrow.toISOString())
            )
        );

    return {
        totalCustomersToday: customerCount?.value || 0,
        vehiclesOnRent: rentedCount?.value || 0,
        overdueVehicles: overdueCount?.value || 0,
        todayIncome: parseFloat(incomeSum?.value || '0'),
    };
}

export async function getChartData(days: number): Promise<ChartData[]> {
    const result: ChartData[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        
        const nextD = new Date(d);
        nextD.setDate(nextD.getDate() + 1);

        const name = days === 10 ? `Day ${days - i}` : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

        // Customers
        const [cCount] = await db
            .select({ value: count() })
            .from(users)
            .where(and(eq(users.role, 'CUSTOMER'), gte(users.createdAt, d), lt(users.createdAt, nextD)));

        // Reservations
        const [rCount] = await db
            .select({ value: count() })
            .from(booking)
            .where(and(gte(booking.createdAt, d), lt(booking.createdAt, nextD)));

        // Income
        const [iSum] = await db
            .select({ value: sum(payment.amount) })
            .from(payment)
            .where(and(gte(payment.paymentDate, d.toISOString()), lt(payment.paymentDate, nextD.toISOString())));

        result.push({
            name,
            customers: cCount?.value || 0,
            reservations: rCount?.value || 0,
            income: parseFloat(iSum?.value || '0'),
        });
    }

    return result;
}

export async function getYearlyChartData(): Promise<ChartData[]> {
    const result: ChartData[] = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        
        const name = d.toLocaleDateString(undefined, { month: 'short' });

        // Customers
        const [cCount] = await db
            .select({ value: count() })
            .from(users)
            .where(and(eq(users.role, 'CUSTOMER'), gte(users.createdAt, d), lt(users.createdAt, nextMonth)));

        // Reservations
        const [rCount] = await db
            .select({ value: count() })
            .from(booking)
            .where(and(gte(booking.createdAt, d), lt(booking.createdAt, nextMonth)));

        // Income
        const [iSum] = await db
            .select({ value: sum(payment.amount) })
            .from(payment)
            .where(and(gte(payment.paymentDate, d.toISOString()), lt(payment.paymentDate, nextMonth.toISOString())));

        result.push({
            name,
            customers: cCount?.value || 0,
            reservations: rCount?.value || 0,
            income: parseFloat(iSum?.value || '0'),
        });
    }

    return result;
}
