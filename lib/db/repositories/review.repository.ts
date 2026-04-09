import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { review } from '@/src/db/schema';
import type { Review, NewReview } from '../types';

/** Retrieve all reviews */
export async function getAllReviews(): Promise<Review[]> {
  return db.select().from(review);
}

/** Retrieve a single review by primary key */
export async function getReviewById(id: number): Promise<Review | undefined> {
  const rows = await db.select().from(review).where(eq(review.reviewId, id));
  return rows[0];
}

/** Retrieve all reviews for a specific booking */
export async function getReviewsByBookingId(bookingId: number): Promise<Review[]> {
  return db.select().from(review).where(eq(review.bookingId, bookingId));
}

/** Retrieve all reviews for a specific vehicle */
export async function getReviewsByVehicleId(vehicleId: number): Promise<Review[]> {
  return db.select().from(review).where(eq(review.vehicleId, vehicleId));
}

/** Insert a new review */
export async function createReview(data: NewReview): Promise<void> {
  await db.insert(review).values(data);
}

/** Update an existing review by ID */
export async function updateReview(id: number, data: Partial<NewReview>): Promise<void> {
  await db.update(review).set(data).where(eq(review.reviewId, id));
}

/** Delete a review by ID */
export async function deleteReview(id: number): Promise<void> {
  await db.delete(review).where(eq(review.reviewId, id));
}
