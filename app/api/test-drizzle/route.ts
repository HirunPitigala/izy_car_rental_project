import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { vehicle, customer } from '@/src/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
    try {
        // Test 1: Query all vehicles (limit to 5 for testing)
        const vehicles = await db.select().from(vehicle).limit(5);

        // Test 2: Query all customers (limit to 5 for testing)
        const customers = await db.select().from(customer).limit(5);

        // Test 3: Query a specific vehicle by ID (if exists)
        const specificVehicle = await db
            .select()
            .from(vehicle)
            .where(eq(vehicle.vehicleId, 1))
            .limit(1);

        // Test 4: Count total vehicles
        const vehicleCount = await db.select().from(vehicle);

        // Test 5: Count total customers
        const customerCount = await db.select().from(customer);

        return NextResponse.json({
            success: true,
            message: 'Drizzle ORM is working correctly!',
            data: {
                vehicles: {
                    count: vehicleCount.length,
                    sample: vehicles,
                },
                customers: {
                    count: customerCount.length,
                    sample: customers,
                },
                specificVehicle: specificVehicle.length > 0 ? specificVehicle[0] : null,
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to query database',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
