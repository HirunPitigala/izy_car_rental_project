
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function verify() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT)
    });

    const tables = ["inspection", "inspection_items", "damage_reports"];
    for (const table of tables) {
        console.log(`\n--- Table: ${table} ---`);
        try {
            const [cols]: any = await connection.execute(`DESCRIBE ${table}`);
            console.log(JSON.stringify(cols, null, 2));
        } catch (e) {
            console.error(`Error describing ${table}:`, e.message);
        }
    }

    await connection.end();
}

verify().catch(console.error);
