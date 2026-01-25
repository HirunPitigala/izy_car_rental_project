require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT),
    });

    console.log('Connected to database.');

    const columnsToAdd = [
        { name: 'status', type: 'VARCHAR(20)' },
        { name: 'service_category', type: 'VARCHAR(50)' },
        { name: 'rate_per_month', type: 'DECIMAL(10, 2)' },
        { name: 'image', type: 'LONGTEXT' },
        { name: 'created_at', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
        { name: 'seating_capacity', type: 'INT' }
    ];

    for (const col of columnsToAdd) {
        try {
            await connection.query(`ALTER TABLE vehicle ADD COLUMN ${col.name} ${col.type}`);
            console.log(`Added column ${col.name}`);
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log(`Column ${col.name} already exists.`);
            } else {
                console.error(`Error adding column ${col.name}:`, err.message);
            }
        }
    }

    await connection.end();
    console.log('Migration finished.');
}

migrate().catch(console.error);
