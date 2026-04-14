import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import bcrypt from 'bcrypt';

async function seed() {
    console.log('🌱 Seeding analytics data...');

    try {
        // Dynamic imports to ensure env vars are loaded before db initialization
        const { db } = await import('../src/db');
        const { users, booking, vehicle, payment, vehicleBrand, vehicleModel, serviceCategory } = await import('../src/db/schema');
        const { sql } = await import('drizzle-orm');

        const formatDate = (date: Date) => date.toISOString().slice(0, 19).replace('T', ' ');

        console.log('Creating base data...');
        const [brandResult] = await db.insert(vehicleBrand).values({ brandName: 'Toyota' }).onDuplicateKeyUpdate({ set: { brandName: 'Toyota' } });
        const brandId = (brandResult as any).insertId || 1;

        const [modelResult] = await db.insert(vehicleModel).values({ brandId, modelName: 'Premio' }).onDuplicateKeyUpdate({ set: { modelName: 'Premio' } });
        const modelId = (modelResult as any).insertId || 1;

        const [catResult] = await db.insert(serviceCategory).values({ categoryName: 'Luxury' }).onDuplicateKeyUpdate({ set: { categoryName: 'Luxury' } });
        const categoryId = (catResult as any).insertId || 1;

        console.log('Creating vehicles...');
        const vehiclesData = [
            { plateNumber: 'WP CAB-1234', brandId, modelId, categoryId, seatingCapacity: 5, luggageCapacity: 2, transmission: 'Auto', fuelType: 'Petrol', rentPerHour: '500', rentPerDay: '5000', rentPerMonth: '120000', maxKmsPerDay: 100, extraKmPrice: '50', minRentalDays: 1, status: 'AVAILABLE' },
            { plateNumber: 'WP CAB-5678', brandId, modelId, categoryId, seatingCapacity: 5, luggageCapacity: 2, transmission: 'Auto', fuelType: 'Petrol', rentPerHour: '500', rentPerDay: '5000', rentPerMonth: '120000', maxKmsPerDay: 100, extraKmPrice: '50', minRentalDays: 1, status: 'RENTED' },
            { plateNumber: 'WP CAB-9012', brandId, modelId, categoryId, seatingCapacity: 5, luggageCapacity: 2, transmission: 'Auto', fuelType: 'Petrol', rentPerHour: '500', rentPerDay: '5000', rentPerMonth: '120000', maxKmsPerDay: 100, extraKmPrice: '50', minRentalDays: 1, status: 'RENTED' },
        ];

        for (const v of vehiclesData) {
            await db.insert(vehicle).values(v).onDuplicateKeyUpdate({ set: { status: v.status } });
        }

        const [allVehicles] = await db.select().from(vehicle).limit(1);
        const vid = allVehicles.vehicleId;

        console.log('Creating customers...');
        const passHash = await bcrypt.hash('password123', 10);
        const now = new Date();
        
        for (let i = 0; i < 20; i++) {
            const createdAt = new Date(now);
            createdAt.setDate(now.getDate() - Math.floor(Math.random() * 45)); 
            
            await db.insert(users).values({
                name: `Customer ${i}`,
                email: `customer${i}@example.com`,
                passwordHash: passHash,
                role: 'CUSTOMER',
                status: 'active',
                createdAt: createdAt
            }).onDuplicateKeyUpdate({ set: { role: 'CUSTOMER' } });
        }

        const customers = await db.select().from(users).where(sql`${users.role} = 'CUSTOMER'`);

        console.log('Creating bookings and payments...');
        for (let i = 0; i < 40; i++) {
            const customer = customers[Math.floor(Math.random() * customers.length)];
            const createdAt = new Date(now);
            createdAt.setDate(now.getDate() - Math.floor(Math.random() * 60)); 
            
            const rentalDate = new Date(createdAt);
            rentalDate.setDate(rentalDate.getDate() + 2);
            const returnDate = new Date(rentalDate);
            returnDate.setDate(returnDate.getDate() + 3);

            const [bookingResult] = await db.insert(booking).values({
                userId: customer.userId,
                vehicleId: vid,
                serviceCategoryId: categoryId,
                customerFullName: customer.name!,
                customerPhoneNumber1: '0771234567',
                customerPhoneNumber2: '0711234567',
                customerLicenseNo: 'B1234567',
                customerNicNo: '123456789V',
                customerAddress: '123 Main St, Colombo',
                pickupLocation: 'Colombo',
                dropoffLocation: 'Colombo',
                rentalDate: rentalDate,
                returnDate: returnDate,
                totalFare: '15000',
                status: i % 5 === 0 ? 'PENDING' : 'ACCEPTED',
                createdAt: createdAt
            });

            const bId = (bookingResult as any).insertId;

            if (i % 2 === 0) {
                const payDate = new Date(createdAt);
                payDate.setDate(payDate.getDate() + 1);
                
                await db.insert(payment).values({
                    bookingId: bId,
                    amount: '15000',
                    paymentMethod: 'CASH',
                    paymentDate: formatDate(payDate),
                    paymentStatus: 'PAID',
                    invoiceNumber: `INV-${Date.now()}-${i}`
                });
            }
        }

        console.log('✅ Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding:', err);
        process.exit(1);
    }
}

seed();
