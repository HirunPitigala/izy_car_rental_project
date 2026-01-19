import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

const result = await db.execute(sql`SELECT 1 + 1 AS result`)
