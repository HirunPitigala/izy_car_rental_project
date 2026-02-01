import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import * as relations from './relations';

// Create MySQL connection pool
export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Create Drizzle instance with schema and relations
export const db = drizzle(pool, { schema: { ...schema, ...relations }, mode: 'default' });

export * from './schema';
export * from './relations';
