"use server";

import { db } from "@/src/db";
import { vehicle } from "@/src/db/schema";
import { eq, and, sql, or, lt } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function lockVehicle(vehicleId: number) {
    try {
        const session = await getSession();
        if (!session) {
            return { success: false, error: "Authentication required to lock a vehicle." };
        }

        const userId = session.userId;

        // 1. Verify existence and current lock state
        const [v] = await db.select({
            isLocked: vehicle.isLocked,
            lockedBy: vehicle.lockedBy,
            lockExpiresAt: vehicle.lockExpiresAt,
            status: vehicle.status,
        })
        .from(vehicle)
        .where(eq(vehicle.vehicleId, vehicleId));

        if (!v) {
            return { success: false, error: "Vehicle not found." };
        }

        if (v.status !== "AVAILABLE") {
            return { success: false, error: "Vehicle is no longer available." };
        }

        const now = new Date();

        // 2. Can we lock it?
        // We can lock if: it's not locked OR the lock has expired OR it's already locked by us
        const isLockExpired = v.lockExpiresAt ? new Date(v.lockExpiresAt) < now : false;
        
        if (v.isLocked && !isLockExpired && v.lockedBy !== userId) {
            return { success: false, error: "This vehicle is currently being booked by another user." };
        }

        // 3. Acquire lock (10 minutes)
        const expiry = new Date(now.getTime() + 10 * 60000);

        await db.update(vehicle)
            .set({
                isLocked: true,
                lockedBy: userId,
                lockExpiresAt: expiry,
            })
            .where(eq(vehicle.vehicleId, vehicleId));

        return { success: true };
    } catch (error) {
        console.error("Error locking vehicle:", error);
        return { success: false, error: "Failed to lock vehicle." };
    }
}

export async function unlockVehicle(vehicleId: number) {
    try {
        const session = await getSession();
        if (!session) return { success: false, error: "Authentication required." };

        const userId = session.userId;

        // Ensure we only unlock if we own the lock
        const [v] = await db.select({
            lockedBy: vehicle.lockedBy,
        })
        .from(vehicle)
        .where(eq(vehicle.vehicleId, vehicleId));

        if (!v) return { success: false, error: "Vehicle not found" };

        if (v.lockedBy !== userId) {
            return { success: false, error: "You do not own the lock on this vehicle." };
        }

        await db.update(vehicle)
            .set({
                isLocked: false,
                lockedBy: null,
                lockExpiresAt: null,
            })
            .where(eq(vehicle.vehicleId, vehicleId));

        return { success: true };
    } catch (error) {
        console.error("Error unlocking vehicle:", error);
        return { success: false, error: "Failed to unlock vehicle." };
    }
}
