
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function verifyTables() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT)
    });

    const tablesToCheck = ["checklist", "item"];
    for (const table of tablesToCheck) {
        console.log(`\nInspecting ${table} table:`);
        try {
            const [cols]: any = await connection.execute(`DESCRIBE ${table}`);
            console.log(JSON.stringify(cols, null, 2));
        } catch (e) {
            console.log(`${table} table does not exist.`);
        }
    }

    await connection.end();
}

verifyTables().catch(console.error);
