import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import * as relations from './relations';


const g = global as typeof global & { __mysqlPool?: ReturnType<typeof mysql.createPool> };

if (!g.__mysqlPool) {
    g.__mysqlPool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });
}

export const pool = g.__mysqlPool!;

// Module-level db instance — each Next.js bundle gets its own instance but
// they all share the same underlying pool (above). Since every bundle imports
// the same schema, the instances are functionally identical with no risk of
// the "mismatched table registry" bug that required the global singleton for pool.
export const db = drizzle(pool, { schema: { ...schema, ...relations }, mode: 'default' });

export * from './schema';
export * from './relations';
