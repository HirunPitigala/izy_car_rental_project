
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function resetAdmin() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT) || 3306
    });

    try {
        const email = 'admin@example.com';
        const password = 'admin123';
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        const name = 'Admin User';

        console.log(`Resetting admin ${email}...`);

        // Delete existing
        await connection.execute('DELETE FROM admin WHERE email = ?', [email]);

        // Insert fresh
        await connection.execute(
            'INSERT INTO admin (name, email, password) VALUES (?, ?, ?)',
            [name, email, hash]
        );

        console.log('Admin user reset successfully!');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('New Hash:', hash);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await connection.end();
    }
}

resetAdmin();
