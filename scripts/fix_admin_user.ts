
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function fixAdmin() {
    console.log("Starting admin user fix...");
    const { db } = await import("../lib/db");
    const { users, admin } = await import("../src/db/schema");
    const { eq } = await import("drizzle-orm");

    const email = "admin@example.com";

    try {
        // 1. Get admin details
        const [adminUser] = await db.select().from(admin).where(eq(admin.email, email));

        if (!adminUser) {
            console.error("CRITICAL: Admin user not found in 'admin' table. Cannot sync.");
            process.exit(1);
        }

        console.log("Found admin user in 'admin' table:", adminUser);

        // 2. Check if already exists in users
        const [existingUser] = await db.select().from(users).where(eq(users.email, email));

        if (existingUser) {
            console.log("User already exists in 'users' table. Updating to ensure sync...");
            await db.update(users).set({
                passwordHash: adminUser.password,
                role: "admin",
                relatedId: adminUser.adminId,
                status: "active"
            }).where(eq(users.id, existingUser.id));
            console.log("Successfully updated admin in 'users' table.");
        } else {
            console.log("User missing from 'users' table. Creating...");

            await db.insert(users).values({
                email: adminUser.email,
                passwordHash: adminUser.password, // Copying the hashed password directly
                role: "admin",
                relatedId: adminUser.adminId,
                status: "active",
                emailVerified: true, // Assuming admin is verified
                emailVerifiedAt: new Date()
            });

            console.log("Successfully inserted admin into 'users' table.");
        }

    } catch (e) {
        console.error("Error running fix:", e);
    }

    console.log("Done.");
    process.exit(0);
}

fixAdmin();
