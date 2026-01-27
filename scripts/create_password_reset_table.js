const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function createPasswordResetTokensTable() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    try {
        console.log('Creating password_reset_tokens table...');

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS password_reset_tokens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                token VARCHAR(255) NOT NULL UNIQUE,
                expires_at DATETIME NOT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_token (token),
                INDEX idx_expires_at (expires_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        console.log('✅ password_reset_tokens table created successfully!');

        // Verify the table was created
        const [rows] = await connection.execute(`
            SHOW TABLES LIKE 'password_reset_tokens'
        `);

        if (rows.length > 0) {
            console.log('✅ Table verified in database');
        }

    } catch (error) {
        console.error('❌ Error creating table:', error.message);
        throw error;
    } finally {
        await connection.end();
    }
}

createPasswordResetTokensTable()
    .then(() => {
        console.log('Migration completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Migration failed:', error);
        process.exit(1);
    });
