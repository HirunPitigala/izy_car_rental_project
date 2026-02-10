
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

    console.log("Fixing BLOB columns...");

    const columns = [
        "customer_driving_licence_pdf",
        "customer_id_pdf",
        "guarantee_nic_pdf",
        "guarantee_license_pdf"
    ];

    for (const col of columns) {
        try {
            console.log(`Resetting ${col} to VARCHAR(255)...`);
            // Drop the column first to remove any old blob data
            try {
                await connection.execute(`ALTER TABLE booking DROP COLUMN ${col}`);
                console.log(`Dropped ${col}`);
            } catch (e: any) {
                // Ignore if column doesn't exist
            }

            // Add it back as VARCHAR
            await connection.execute(`ALTER TABLE booking ADD COLUMN ${col} VARCHAR(255)`);
            console.log(`Added ${col} as VARCHAR(255)`);
        } catch (e: any) {
            console.error(`Error processing ${col}:`, e.message);
        }
    }

    await connection.end();
}

fix().catch(console.error);
