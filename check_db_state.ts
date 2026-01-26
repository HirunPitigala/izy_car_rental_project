
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function checkAdmin() {
    const { db } = await import("./lib/db");
    const { users, admin } = await import("./src/db/schema");
    const { eq } = await import("drizzle-orm");

    const email = "admin@example.com";
    console.log(`Checking for user: ${email}`);

    try {
        const userEntry = await db.select().from(users).where(eq(users.email, email));
        console.log("Users table entry:", userEntry);

        const adminEntry = await db.select().from(admin).where(eq(admin.email, email));
        console.log("Admin table entry:", adminEntry);
    } catch (e) {
        console.error("Error querying DB:", e);
    }

    process.exit(0);
}

checkAdmin();
