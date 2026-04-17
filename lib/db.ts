// Re-export the canonical db instance and pool from src/db so that
// import { db } from "@/lib/db" works alongside the repo barrel.
export { db, pool } from '@/src/db';

// Re-export all repository namespaces and types from the barrel so that
// import { NotificationRepo, VehicleRepo, … } from "@/lib/db" continues to work.
// NOTE: @/lib/db resolves to this file (lib/db.ts) — TypeScript picks files
// over directories — so we must explicitly re-export lib/db/index here.
export * from './db/index';
