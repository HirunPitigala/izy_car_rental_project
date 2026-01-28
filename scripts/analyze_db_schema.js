const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function analyzeSchema() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    try {
        console.log('Analyzing database schema...');

        // Get Tables
        const [tables] = await connection.execute(`
            SELECT TABLE_NAME 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = ?
        `, [process.env.DB_NAME]);

        const schema = {};

        for (const row of tables) {
            const tableName = row.TABLE_NAME;

            // Get Columns
            const [columns] = await connection.execute(`
                SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY
                FROM information_schema.COLUMNS 
                WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
            `, [process.env.DB_NAME, tableName]);

            // Get Foreign Keys
            const [fks] = await connection.execute(`
                SELECT 
                    CONSTRAINT_NAME, 
                    COLUMN_NAME, 
                    REFERENCED_TABLE_NAME, 
                    REFERENCED_COLUMN_NAME
                FROM information_schema.KEY_COLUMN_USAGE
                WHERE TABLE_SCHEMA = ? 
                AND TABLE_NAME = ? 
                AND REFERENCED_TABLE_NAME IS NOT NULL
            `, [process.env.DB_NAME, tableName]);

            schema[tableName] = {
                columns: columns.map(c => ({
                    name: c.COLUMN_NAME,
                    type: c.DATA_TYPE,
                    nullable: c.IS_NULLABLE === 'YES',
                    key: c.COLUMN_KEY
                })),
                foreignKeys: fks.map(fk => ({
                    constraintName: fk.CONSTRAINT_NAME,
                    column: fk.COLUMN_NAME,
                    refTable: fk.REFERENCED_TABLE_NAME,
                    refColumn: fk.REFERENCED_COLUMN_NAME
                }))
            };
        }

        console.log(JSON.stringify(schema, null, 2));

    } catch (error) {
        console.error('Error analyzing schema:', error);
    } finally {
        await connection.end();
    }
}

analyzeSchema();
