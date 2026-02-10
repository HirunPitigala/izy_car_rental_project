
import dotenv from "dotenv";
import fs from "fs";
dotenv.config({ path: ".env.local" });

async function inspect() {
    const { pool } = await import("./lib/db");

    let output = "";
    try {
        const [categories] = await pool.query("SELECT * FROM service_category");
        output += "CATEGORIES:\n" + JSON.stringify(categories, null, 2) + "\n\n";

        const [vehicles] = await pool.query("SELECT vehicle_id, plate_no, category_id, status FROM vehicle");
        output += "VEHICLES:\n" + JSON.stringify(vehicles, null, 2) + "\n";

        fs.writeFileSync("inspect_output.txt", output);
        console.log("Inspection complete. Results written to inspect_output.txt");
    } catch (err: any) {
        console.error("DB_ERROR:", err);
        fs.writeFileSync("inspect_output.txt", "ERROR: " + err.message);
    }

    process.exit(0);
}

inspect().catch((err: any) => {
    console.error("GLOBAL_ERROR:", err);
    process.exit(1);
});
