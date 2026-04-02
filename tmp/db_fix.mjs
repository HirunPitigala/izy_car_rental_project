import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function fixDb() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT),
    });

    console.log('Connected to MySQL.');

    try {
        console.log('Creating airport_bookings table...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS \`airport_bookings\` (
                \`id\` int AUTO_INCREMENT NOT NULL,
                \`customer_id\` int NOT NULL,
                \`vehicle_id\` int NOT NULL,
                \`transfer_type\` enum('pickup','drop') NOT NULL,
                \`airport\` enum('katunayaka','mattala') NOT NULL,
                \`pickup_date\` datetime,
                \`pickup_time\` time,
                \`drop_date\` datetime,
                \`drop_time\` time,
                \`passengers\` int NOT NULL,
                \`luggage_count\` int DEFAULT 0,
                \`customer_full_name\` varchar(100) NOT NULL,
                \`customer_phone\` varchar(20) NOT NULL,
                \`customer_email\` varchar(100),
                \`transfer_location\` varchar(255) NOT NULL,
                \`status\` varchar(20) DEFAULT 'requested',
                \`booking_type\` varchar(30) DEFAULT 'airport_rental',
                \`rejection_reason\` text,
                \`handled_by_employee_id\` int,
                \`created_at\` datetime DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        console.log('Table airport_bookings created or already exists.');
        
        // Add foreign keys if possible
        try {
            await connection.execute('ALTER TABLE \`airport_bookings\` ADD INDEX \`ab_customer_id_idx\` (\`customer_id\`)');
            await connection.execute('ALTER TABLE \`airport_bookings\` ADD INDEX \`ab_vehicle_id_idx\` (\`vehicle_id\`)');
        } catch (idxError) {
            console.log('Indexes might already exist.');
        }

    } catch (error) {
        console.error('Error fixing DB:', error);
    } finally {
        await connection.end();
    }
}

fixDb();
