import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { migrate } from "drizzle-orm/mysql2/migrator";

async function main() {
    const { db, pool } = await import("./lib/db.ts");
    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("Migrations complete!");
    await pool.end();
}

main().catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
});
