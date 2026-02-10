
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "fs";

async function inspectTable() {
    const logData: string[] = [];
    const log = (msg: string) => {
        console.log(msg);
        logData.push(msg);
    };

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT)
    });

    log("Listing tables...");
    const [tables]: any = await connection.execute("SHOW TABLES");
    log("Tables: " + JSON.stringify(tables.map((t: any) => Object.values(t)[0])));

    try {
        log("\nInspecting 'booking' table columns...");
        const [bookingCols]: any = await connection.execute("DESCRIBE booking");
        bookingCols.forEach((row: any) => {
            log(`Column: ${row.Field}, Type: ${row.Type}`);
        });
    } catch (e) {
        log("'booking' table does not exist or error describing it.");
    }

    try {
        log("\nChecking 'service_category' table data...");
        const [categories]: any = await connection.execute("SELECT * FROM service_category");
        log("Categories: " + JSON.stringify(categories, null, 2));
    } catch (e) {
        log("Error reading service_category");
    }

    try {
        log("\nChecking 'users' table (first 5)...");
        const [users]: any = await connection.execute("SELECT id, email, role FROM users LIMIT 5");
        log("Users: " + JSON.stringify(users, null, 2));
    } catch (e) {
        log("Error reading users");
    }

    await connection.end();
    fs.writeFileSync("db_inspection.txt", logData.join("\n"));
}

inspectTable().catch(console.error);
