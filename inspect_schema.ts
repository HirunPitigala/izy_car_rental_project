import "dotenv/config";
import mysql from "mysql2/promise";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT),
    });

    console.log("Connected to DB.");

    try {
        const [tables] = await connection.query("SHOW TABLES");

        let vehicleColumns = [];
        try {
            [vehicleColumns] = await connection.query("DESCRIBE vehicle") as any;
        } catch (e) { }

        let brandColumns = [];
        try {
            [brandColumns] = await connection.query("DESCRIBE vehicle_brand") as any;
        } catch (e) { }

        let modelColumns = [];
        try {
            [modelColumns] = await connection.query("DESCRIBE vehicle_model") as any;
        } catch (e) { }

        let categoryColumns = [];
        try {
            [categoryColumns] = await connection.query("DESCRIBE service_category") as any;
        } catch (e) { }

        const dump = { tables, vehicleColumns, brandColumns, modelColumns, categoryColumns };
        fs.writeFileSync('schema_dump.json', JSON.stringify(dump, null, 2));
        console.log("Dumped to schema_dump.json");

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await connection.end();
    }
}

main();
