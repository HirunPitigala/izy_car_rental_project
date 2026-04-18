"use server";

import { db } from "@/src/db";
import { review, users, booking, employee, vehicle, vehicleBrand, vehicleModel } from "@/src/db/schema";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { eq, and, desc, sql, asc } from "drizzle-orm";

export interface ReviewSubmission {
    bookingId: number;
    vehicleId: number;
    employeeId?: number | null;
    rating: number;
    comment: string;
}

export async function submitReview(data: ReviewSubmission) {
    try {
        const session = await getSession();
        if (!session) {
            return { success: false, error: "Authentication required" };
        }

        // 1. Verify booking exists, belongs to user, and is eligible for review
        const [b] = await db.select()
            .from(booking)
            .where(
                and(
                    eq(booking.bookingId, data.bookingId),
                    eq(booking.userId, session.userId)
                )
            );

        if (!b) {
            return { success: false, error: "Booking not found or unauthorized" };
        }

        // Eligibility check
        const eligibleStatuses = ["RETURNED", "COMPLETED"];
        if (!eligibleStatuses.includes(b.status || "")) {
            return { success: false, error: "Reviews are only allowed after service completion" };
        }

        // 2. Check if a review already exists for this booking
        const [existing] = await db.select()
            .from(review)
            .where(eq(review.bookingId, data.bookingId));

        if (existing) {
            return { success: false, error: "You have already reviewed this service" };
        }

        // 3. Insert review
        // SECURITY FIX (A04): Use vehicleId from the verified booking (b), not client input.
        await db.insert(review).values({
            bookingId: data.bookingId,
            userId: session.userId,
            vehicleId: b.vehicleId!, 
            employeeId: data.employeeId || b.assignedEmployeeId,
            rating: data.rating,
            comment: data.comment,
        });

        revalidatePath(`/rent/${data.vehicleId}`);
        revalidatePath("/customer/dashboard");

        return { success: true };
    } catch (error) {
        console.error("Error submitting review:", error);
        return { success: false, error: "Failed to submit review" };
    }
}

export async function getVehicleReviews(vehicleId: number) {
    try {
        const results = await db.select({
            reviewId: review.reviewId,
            rating: review.rating,
            comment: review.comment,
            reviewDate: review.reviewDate,
            customerName: users.name,
        })
        .from(review)
        .leftJoin(users, eq(review.userId, users.userId))
        .where(eq(review.vehicleId, vehicleId))
        .orderBy(desc(review.reviewDate));

        return { success: true, data: results };
    } catch (error) {
        console.error("Error fetching vehicle reviews:", error);
        return { success: false, error: "Failed to fetch reviews" };
    }
}

export async function getVehicleRatingStats(vehicleId: number) {
    try {
        // SECURITY NOTE (A03 — Injection): These sql<> template literals are safe
        // because they reference Drizzle ORM column objects, NOT raw user strings.
        // ⚠️  NEVER interpolate user-supplied input directly into sql<> blocks.
        const [stats] = await db.select({
            averageRating: sql<number>`AVG(${review.rating})`,
            totalReviews: sql<number>`COUNT(${review.reviewId})`,
        })
        .from(review)
        .where(eq(review.vehicleId, vehicleId));

        return {
            success: true,
            data: {
                averageRating: Number(Number(stats?.averageRating || 0).toFixed(1)),
                totalReviews: Number(stats?.totalReviews || 0),
            }
        };
    } catch (error) {
        console.error("Error fetching rating stats:", error);
        return { success: false, error: "Failed to fetch rating stats" };
    }
}

export async function getAllReviewsForAdmin() {
    try {
        const session = await getSession();
        if (!session || session.role !== "admin") {
            return { success: false, error: "Unauthorized" };
        }

        const results = await db.select({
            reviewId: review.reviewId,
            rating: review.rating,
            comment: review.comment,
            reviewDate: review.reviewDate,
            customerName: users.name,
            vehicle: {
                vehicleId: vehicle.vehicleId,
                plateNumber: vehicle.plateNumber,
                brand: vehicleBrand.brandName,
                model: vehicleModel.modelName,
            }
        })
        .from(review)
        .leftJoin(users, eq(review.userId, users.userId))
        .leftJoin(vehicle, eq(review.vehicleId, vehicle.vehicleId))
        .leftJoin(vehicleBrand, eq(vehicle.brandId, vehicleBrand.brandId))
        .leftJoin(vehicleModel, eq(vehicle.modelId, vehicleModel.modelId))
        .orderBy(desc(review.reviewDate));

        // Group by vehicle plate number
        const grouped = results.reduce((acc: any, curr: any) => {
            const plate = curr.vehicle.plateNumber;
            if (!acc[plate]) {
                acc[plate] = {
                    vehicleInfo: curr.vehicle,
                    reviews: []
                };
            }
            acc[plate].reviews.push({
                reviewId: curr.reviewId,
                rating: curr.rating,
                comment: curr.comment,
                reviewDate: curr.reviewDate,
                customerName: curr.customerName
            });
            return acc;
        }, {});

        return { success: true, data: Object.values(grouped) };
    } catch (error) {
        console.error("Error fetching all reviews:", error);
        return { success: false, error: "Failed to fetch reviews" };
    }
}

export async function updateReviewAdmin(reviewId: number, data: { rating: number; comment: string }) {
    try {
        const session = await getSession();
        if (!session || session.role !== "admin") {
            return { success: false, error: "Unauthorized" };
        }

        await db.update(review)
            .set({
                rating: data.rating,
                comment: data.comment
            })
            .where(eq(review.reviewId, reviewId));

        revalidatePath("/admin/reviews");
        return { success: true };
    } catch (error) {
        console.error("Error updating review:", error);
        return { success: false, error: "Failed to update review" };
    }
}

export async function deleteReviewAdmin(reviewId: number) {
    try {
        const session = await getSession();
        if (!session || session.role !== "admin") {
            return { success: false, error: "Unauthorized" };
        }

        await db.delete(review)
            .where(eq(review.reviewId, reviewId));

        revalidatePath("/admin/reviews");
        return { success: true };
    } catch (error) {
        console.error("Error deleting review:", error);
        return { success: false, error: "Failed to delete review" };
    }
}
