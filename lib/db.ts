// Re-export the canonical db instance and pool from src/db.
// All files importing from @/lib/db automatically share the same singleton
// Drizzle instance and MySQL connection pool — no second drizzle() call here.
export { db, pool } from '@/src/db';
