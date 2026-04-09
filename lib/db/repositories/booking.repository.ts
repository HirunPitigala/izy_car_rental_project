import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { booking } from '@/src/db/schema';
import type { Booking, NewBooking } from '../types';

/** Retrieve all bookings */
export async function getAllBookings(): Promise<Booking[]> {
  return db.select().from(booking);
}

/** Retrieve a single booking by primary key */
export async function getBookingById(id: number): Promise<Booking | undefined> {
  const rows = await db.select().from(booking).where(eq(booking.bookingId, id));
  return rows[0];
}

/** Retrieve all bookings for a specific user */
export async function getBookingsByUserId(userId: number): Promise<Booking[]> {
  return db.select().from(booking).where(eq(booking.userId, userId));
}

/** Retrieve all bookings for a specific vehicle */
export async function getBookingsByVehicleId(vehicleId: number): Promise<Booking[]> {
  return db.select().from(booking).where(eq(booking.vehicleId, vehicleId));
}

/** Retrieve all bookings assigned to a specific employee */
export async function getBookingsByEmployeeId(employeeId: number): Promise<Booking[]> {
  return db.select().from(booking).where(eq(booking.assignedEmployeeId, employeeId));
}

/** Retrieve all bookings filtered by status */
export async function getBookingsByStatus(status: string): Promise<Booking[]> {
  return db.select().from(booking).where(eq(booking.status, status));
}

/** Insert a new booking */
export async function createBooking(data: NewBooking): Promise<void> {
  await db.insert(booking).values(data);
}

/** Update an existing booking by ID */
export async function updateBooking(id: number, data: Partial<NewBooking>): Promise<void> {
  await db.update(booking).set(data).where(eq(booking.bookingId, id));
}

/** Delete a booking by ID */
export async function deleteBooking(id: number): Promise<void> {
  await db.delete(booking).where(eq(booking.bookingId, id));
}
