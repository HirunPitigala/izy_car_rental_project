
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function verifyAdmin() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT) || 3306
    });

    let output = '';
    try {
        const email = 'admin@example.com';
        const [rows] = await connection.execute('SELECT * FROM admin WHERE email = ?', [email]);

        if (rows.length === 0) {
            output += 'ERROR: Admin user not found in database!\n';
        } else {
            const admin = rows[0];
            output += `Admin found: id=${admin.admin_id}, name=${admin.name}, email=${admin.email}\n`;

            const testPassword = 'admin123';
            const match = await bcrypt.compare(testPassword, admin.password);
            output += `Password comparison check for "${testPassword}": ${match ? 'MATCHES' : 'FAILED'}\n`;
            output += `Hash in DB: ${admin.password}\n`;

            // Check if user is typing different case? 
            // The image shows exactly admin@example.com
        }
    } catch (error) {
        output += `Error: ${error.message}\n`;
    } finally {
        await connection.end();
        fs.writeFileSync('scripts/verify_result.txt', output);
        console.log('Verification finished, check scripts/verify_result.txt');
    }
}

verifyAdmin();
