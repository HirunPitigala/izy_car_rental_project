const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function migrateUsers() {
    console.log('Connecting to database...');
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT) || 3306
    });

    try {
        // 1. Create users table if not exists (Physical check)
        console.log('Ensuring users table exists...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(100) UNIQUE,
                password_hash VARCHAR(255),
                role VARCHAR(20),
                related_id INT,
                status VARCHAR(20) DEFAULT 'active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. Clear existing users to avoid duplicates if re-run
        console.log('Clearing existing users...');
        await connection.execute('DELETE FROM users');

        // 3. Migrate Admins
        console.log('Migrating admins...');
        const [admins] = await connection.execute('SELECT * FROM admin');
        for (const user of admins) {
            await connection.execute(
                'INSERT IGNORE INTO users (email, password_hash, role, related_id) VALUES (?, ?, ?, ?)',
                [user.email, user.password, 'admin', user.admin_id]
            );
        }

        // 4. Migrate Managers
        console.log('Migrating managers...');
        const [managers] = await connection.execute('SELECT * FROM manager');
        for (const user of managers) {
            await connection.execute(
                'INSERT IGNORE INTO users (email, password_hash, role, related_id) VALUES (?, ?, ?, ?)',
                [user.email, user.password, 'manager', user.manager_id]
            );
        }

        // 5. Migrate Employees
        console.log('Migrating employees...');
        const [employees] = await connection.execute('SELECT * FROM employee');
        for (const user of employees) {
            await connection.execute(
                'INSERT IGNORE INTO users (email, password_hash, role, related_id) VALUES (?, ?, ?, ?)',
                [user.email, user.password, 'employee', user.employee_id]
            );
        }

        // 6. Migrate Customers
        console.log('Migrating customers...');
        const [customers] = await connection.execute('SELECT * FROM customer');
        for (const user of customers) {
            // Note: customer table uses 'email' but sometimes 'username' for login
            // The requirement says authenticate against email/username. 
            // We'll prioritize email as the unique identifier in the users table.
            if (user.email) {
                await connection.execute(
                    'INSERT IGNORE INTO users (email, password_hash, role, related_id) VALUES (?, ?, ?, ?)',
                    [user.email, user.password, 'customer', user.customer_id]
                );
            }
        }

        console.log('Migration completed successfully!');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await connection.end();
    }
}

migrateUsers();
