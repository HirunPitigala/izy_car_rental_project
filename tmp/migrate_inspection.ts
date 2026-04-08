
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT)
    });

    console.log("Starting migration...");

    try {
        // 1. Rename table
        console.log("Renaming 'checklist' to 'inspection'...");
        await connection.execute("RENAME TABLE checklist TO inspection");

        // 2. Rename columns and update types in 'inspection'
        console.log("Modifying 'inspection' table columns...");
        // checklist_id -> inspection_id
        await connection.execute("ALTER TABLE inspection CHANGE checklist_id inspection_id INT AUTO_INCREMENT");
        // remarks -> overall_remarks
        await connection.execute("ALTER TABLE inspection CHANGE remarks overall_remarks TEXT");
        // inspection_type -> ENUM('BEFORE', 'AFTER')
        // We'll map existing data if possible, but let's assume it might be 'before'/'after' case insensitive
        await connection.execute("UPDATE inspection SET inspection_type = 'BEFORE' WHERE UPPER(inspection_type) = 'BEFORE'");
        await connection.execute("UPDATE inspection SET inspection_type = 'AFTER' WHERE UPPER(inspection_type) = 'AFTER'");
        await connection.execute("ALTER TABLE inspection MODIFY inspection_type ENUM('BEFORE', 'AFTER') NOT NULL");
        // inspection_date -> DATETIME
        await connection.execute("ALTER TABLE inspection MODIFY inspection_date DATETIME DEFAULT CURRENT_TIMESTAMP");
        // booking_id should be NOT NULL as per requirement
        await connection.execute("ALTER TABLE inspection MODIFY booking_id INT NOT NULL");

        // 3. Create inspection_items table
        console.log("Creating 'inspection_items' table...");
        await connection.execute(`
            CREATE TABLE inspection_items (
                id INT PRIMARY KEY AUTO_INCREMENT,
                inspection_id INT NOT NULL,
                item_id INT NOT NULL,
                status ENUM('OK', 'NOT_OK') NOT NULL,
                remarks TEXT,
                FOREIGN KEY (inspection_id) REFERENCES inspection(inspection_id) ON DELETE CASCADE,
                FOREIGN KEY (item_id) REFERENCES item(item_id)
            )
        `);

        // 4. Create damage_reports table
        console.log("Creating 'damage_reports' table...");
        await connection.execute(`
            CREATE TABLE damage_reports (
                damage_id INT PRIMARY KEY AUTO_INCREMENT,
                inspection_id INT NOT NULL,
                damage_type ENUM('SMALL_MARK','SCRATCH','DENT','CRACK') NOT NULL,
                x_position FLOAT NOT NULL,
                y_position FLOAT NOT NULL,
                notes TEXT,
                FOREIGN KEY (inspection_id) REFERENCES inspection(inspection_id) ON DELETE CASCADE
            )
        `);

        console.log("Migration completed successfully!");
    } catch (error) {
        console.error("Migration failed:", error);
        throw error;
    } finally {
        await connection.end();
    }
}

migrate().catch(err => {
    console.error(err);
    process.exit(1);
});
