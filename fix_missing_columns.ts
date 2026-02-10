
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function fix() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT)
    });

    console.log("Checking for 'rejection_reason' column...");
    try {
        await connection.execute("SELECT rejection_reason FROM booking LIMIT 1");
        console.log("Column 'rejection_reason' already exists.");
    } catch (e: any) {
        if (e.code === 'ER_BAD_FIELD_ERROR') {
            console.log("Column 'rejection_reason' missing, adding it...");
            await connection.execute("ALTER TABLE booking ADD COLUMN rejection_reason TEXT");
            console.log("Added 'rejection_reason' column.");
        } else {
            console.error("Error checking column:", e);
        }
    }

    await connection.end();
}

fix().catch(console.error);
