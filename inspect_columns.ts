
import dotenv from "dotenv";
import fs from "fs";
dotenv.config({ path: ".env.local" });

async function inspect() {
    const { pool } = await import("./lib/db");

    let output = "";
    try {
        const [bookingColumns] = await pool.query("SHOW COLUMNS FROM booking");
        output += "BOOKING_COLUMNS:\n" + JSON.stringify(bookingColumns, null, 2) + "\n\n";

        const [vehicleColumns] = await pool.query("SHOW COLUMNS FROM vehicle");
        output += "VEHICLE_COLUMNS:\n" + JSON.stringify(vehicleColumns, null, 2) + "\n\n";

        const [categoryColumns] = await pool.query("SHOW COLUMNS FROM service_category");
        output += "CATEGORY_COLUMNS:\n" + JSON.stringify(categoryColumns, null, 2) + "\n";

        fs.writeFileSync("inspect_columns.txt", output);
        console.log("Inspection complete. Results written to inspect_columns.txt");
    } catch (err: any) {
        console.error("DB_ERROR:", err);
        fs.writeFileSync("inspect_columns.txt", "ERROR: " + err.message);
    }

    process.exit(0);
}

inspect().catch((err: any) => {
    console.error("GLOBAL_ERROR:", err);
    process.exit(1);
});
