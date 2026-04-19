import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "mysql",
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        host: process.env.DB_HOST!,
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_NAME!,
        port: Number(process.env.DB_PORT),
    }
});
