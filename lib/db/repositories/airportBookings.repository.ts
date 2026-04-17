import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { airportBookings } from '@/src/db/schema';
import type { AirportBooking, NewAirportBooking } from '../types';

/** Retrieve all airport bookings */
export async function getAllAirportBookings(): Promise<AirportBooking[]> {
  return db.select().from(airportBookings);
}

/** Retrieve a single airport booking by primary key */
export async function getAirportBookingById(
  id: number,
): Promise<AirportBooking | undefined> {
  const rows = await db.select().from(airportBookings).where(eq(airportBookings.id, id));
  return rows[0];
}

/** Retrieve all airport bookings made by a specific customer (user ID) */
export async function getAirportBookingsByCustomerId(
  customerId: number,
): Promise<AirportBooking[]> {
  return db
    .select()
    .from(airportBookings)
    .where(eq(airportBookings.customerId, customerId));
}

/** Retrieve all airport bookings for a specific vehicle */
export async function getAirportBookingsByVehicleId(
  vehicleId: number,
): Promise<AirportBooking[]> {
  return db
    .select()
    .from(airportBookings)
    .where(eq(airportBookings.vehicleId, vehicleId));
}

/** Retrieve all airport bookings handled by a specific employee */
export async function getAirportBookingsByEmployeeId(
  employeeId: number,
): Promise<AirportBooking[]> {
  return db
    .select()
    .from(airportBookings)
    .where(eq(airportBookings.handledByEmployeeId, employeeId));
}

/** Retrieve all airport bookings filtered by status */
export async function getAirportBookingsByStatus(
  status: string,
): Promise<AirportBooking[]> {
  return db.select().from(airportBookings).where(eq(airportBookings.status, status));
}

/** Retrieve all airport bookings filtered by transfer type (pickup / drop) */
export async function getAirportBookingsByTransferType(
  transferType: 'pickup' | 'drop',
): Promise<AirportBooking[]> {
  return db
    .select()
    .from(airportBookings)
    .where(eq(airportBookings.transferType, transferType));
}

/** Retrieve all airport bookings filtered by airport (katunayaka / mattala) */
export async function getAirportBookingsByAirport(
  airport: 'katunayaka' | 'mattala',
): Promise<AirportBooking[]> {
  return db
    .select()
    .from(airportBookings)
    .where(eq(airportBookings.airport, airport));
}

/** Insert a new airport booking */
export async function createAirportBooking(data: NewAirportBooking): Promise<void> {
  await db.insert(airportBookings).values(data);
}

/** Update an existing airport booking by ID */
export async function updateAirportBooking(
  id: number,
  data: Partial<NewAirportBooking>,
): Promise<void> {
  await db.update(airportBookings).set(data).where(eq(airportBookings.id, id));
}

/** Delete an airport booking by ID */
export async function deleteAirportBooking(id: number): Promise<void> {
  await db.delete(airportBookings).where(eq(airportBookings.id, id));
}
