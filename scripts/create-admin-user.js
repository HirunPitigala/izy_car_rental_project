
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function createAdmin() {
    console.log('Connecting to database...');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`Database: ${process.env.DB_NAME}`);

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT) || 3306
    });

    try {
        const email = 'admin@example.com';
        // Password: admin123
        const hash = '$2b$10$0.3oQg7GgFDms6n2Dq.23O8b2Kqig5Mng72m/Jc68rnJjjwv.vD8';
        const name = 'Admin User';

        console.log(`Checking if admin ${email} exists...`);
        const [rows] = await connection.execute(
            'SELECT * FROM admin WHERE email = ?',
            [email]
        );

        if (rows.length > 0) {
            console.log('Admin user already exists!');
        } else {
            console.log('Creating admin user...');
            const [result] = await connection.execute(
                'INSERT INTO admin (name, email, password) VALUES (?, ?, ?)',
                [name, email, hash]
            );
            console.log('Admin user created successfully!');
            console.log('Insert ID:', result.insertId);
        }

    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await connection.end();
    }
}

createAdmin();
