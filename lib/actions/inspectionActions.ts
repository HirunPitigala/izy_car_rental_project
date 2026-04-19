"use server";

import { db } from "@/src/db";
import { item, inspection, inspectionItems, damageReports, employee, booking } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";

const DEFAULT_ITEMS = [
    "Wiper Blades 3",
    "Hub Caps",
    "Badges Fitted to the Vehicle",
    "Spare Wheel",
    "Jack and Handle",
    "Wheel Brace",
    "Cassette Android / DVD / Normal",
    "Reverse Camera",
    "Air Pump",
    "Window winders working",
    "Seat Front (R)",
    "Seat Front (L)",
    "Seat Rear (R)",
    "Seat Rear (L)",
    "Carpets Rubber / Velvet",
    "Make of Tires Front (R)",
    "Make of Tires Front (L)",
    "Make of Tires Rear (R)",
    "Make of Tires Rear (L)",
    "A/C Vents 4",
    "Antenna",
    "Vehicle Insurance",
    "Vehicle Renewal Licence",
    "Side Mirror (L)",
    "Side Mirror (R)",
    "Battery Make & Number",
    "Fuel Level"
];

export async function getOrSeedChecklistItems() {
    try {
        const session = await getSession();
        if (!session || (session.role !== "admin" && session.role !== "manager" && session.role !== "employee")) {
            return [];
        }

        const existingItems = await db.select().from(item);

        if (existingItems.length === 0) {
            // Seed defaults
            await db.insert(item).values(
                DEFAULT_ITEMS.map((name) => ({
                    itemName: name,
                    status: "ACTIVE"
                }))
            );
            return await db.select().from(item);
        }
        return existingItems;
    } catch (error) {
        console.error("Error seeding or fetching checklist items:", error);
        return [];
    }
}

export interface InspectionSubmissionData {
    bookingId: number;
    employeeId: number;
    inspectionType: "BEFORE" | "AFTER";
    overallRemarks?: string;
    items: {
        itemId: number;
        status: "OK" | "NOT_OK";
        remarks?: string | null;
    }[];
    damages: {
        type: "SMALL_MARK" | "SCRATCH" | "DENT" | "CRACK";
        x: number;
        y: number;
        notes?: string | null;
    }[];
}

export async function saveInspection(data: InspectionSubmissionData) {
    try {
        const session = await getSession();
        if (!session || (session.role !== "admin" && session.role !== "manager" && session.role !== "employee")) {
            return { success: false, error: "Unauthorized" };
        }

        // Check if one already exists
        const existing = await db.select().from(inspection).where(
            and(
                eq(inspection.bookingId, data.bookingId),
                eq(inspection.inspectionType, data.inspectionType)
            )
        );

        let currentInspectionId: number;

        if (existing.length > 0) {
            // Overwrite existing by deleting related rows (transactional or cascading)
            currentInspectionId = existing[0].inspectionId;
            // Depending on cascade settings, manual delete might be needed
            await db.delete(inspectionItems).where(eq(inspectionItems.inspectionId, currentInspectionId));
            await db.delete(damageReports).where(eq(damageReports.inspectionId, currentInspectionId));
            
            await db.update(inspection).set({ overallRemarks: data.overallRemarks || null, employeeId: data.employeeId })
                    .where(eq(inspection.inspectionId, currentInspectionId));
        } else {
            const [insertResult] = await (db.insert(inspection) as any).values({
                bookingId: data.bookingId,
                employeeId: data.employeeId,
                inspectionType: data.inspectionType,
                overallRemarks: data.overallRemarks || null
            });
            currentInspectionId = (insertResult as any).insertId;
        }

        // Insert items
        if (data.items && data.items.length > 0) {
            await db.insert(inspectionItems).values(
                data.items.map(i => ({
                    inspectionId: currentInspectionId,
                    itemId: i.itemId,
                    status: i.status,
                    remarks: i.remarks || null
                }))
            );
        }

        // Insert damages
        if (data.damages && data.damages.length > 0) {
            await db.insert(damageReports).values(
                data.damages.map(d => ({
                    inspectionId: currentInspectionId,
                    damageType: d.type,
                    xPosition: d.x,
                    yPosition: d.y,
                    notes: d.notes || null
                }))
            );
        }

        return { success: true };
    } catch (error) {
        console.error("Error saving inspection:", error);
        return { success: false, error: "Failed to save inspection" };
    }
}

export async function getInspection(bookingId: number, type: "BEFORE" | "AFTER") {
    try {
        const session = await getSession();
        if (!session || (session.role !== "admin" && session.role !== "manager" && session.role !== "employee")) {
            return { success: false, error: "Unauthorized" };
        }

        const [insp] = await db.select().from(inspection).where(
            and(
                eq(inspection.bookingId, bookingId),
                eq(inspection.inspectionType, type)
            )
        );

        if (!insp) return { success: true, data: null };

        const items = await db.select().from(inspectionItems).where(eq(inspectionItems.inspectionId, insp.inspectionId));
        const damages = await db.select().from(damageReports).where(eq(damageReports.inspectionId, insp.inspectionId));

        return {
            success: true,
            data: {
                ...insp,
                items,
                damages
            }
        };
    } catch (error) {
        console.error("Error retrieving inspection:", error);
        return { success: false, error: "Failed to fetch inspection details" };
    }
}
