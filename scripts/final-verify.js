
const { db } = require('./lib/db');
const { admin } = require('./src/db/schema');
const { eq } = require('drizzle-orm');
const bcrypt = require('bcrypt');
const fs = require('fs');

async function finalVerify() {
    let output = '';
    try {
        const email = 'admin@example.com';
        const [adminUser] = await db.select().from(admin).where(eq(admin.email, email)).limit(1);

        if (!adminUser) {
            output += 'ERROR: Admin user not found via Drizzle schema!\n';
        } else {
            output += `Admin found in Drizzle: id=${adminUser.adminId}, name=${adminUser.name}, email=${adminUser.email}\n`;

            const testPassword = 'admin123';
            const match = await bcrypt.compare(testPassword, adminUser.password);
            output += `Bcrypt match for "${testPassword}": ${match ? 'YES' : 'NO'}\n`;
        }
    } catch (error) {
        output += `Error: ${error.message}\n`;
    } finally {
        fs.writeFileSync('scripts/final_verify.txt', output);
        process.exit(0);
    }
}

finalVerify();
