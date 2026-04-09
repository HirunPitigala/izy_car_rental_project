import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { payment } from '@/src/db/schema';
import type { Payment, NewPayment } from '../types';

/** Retrieve all payments */
export async function getAllPayments(): Promise<Payment[]> {
  return db.select().from(payment);
}

/** Retrieve a single payment by primary key */
export async function getPaymentById(id: number): Promise<Payment | undefined> {
  const rows = await db.select().from(payment).where(eq(payment.paymentId, id));
  return rows[0];
}

/** Retrieve all payments linked to a specific booking */
export async function getPaymentsByBookingId(bookingId: number): Promise<Payment[]> {
  return db.select().from(payment).where(eq(payment.bookingId, bookingId));
}

/** Retrieve a payment by invoice number */
export async function getPaymentByInvoiceNumber(
  invoiceNumber: string,
): Promise<Payment | undefined> {
  const rows = await db
    .select()
    .from(payment)
    .where(eq(payment.invoiceNumber, invoiceNumber));
  return rows[0];
}

/** Retrieve all payments filtered by status */
export async function getPaymentsByStatus(status: string): Promise<Payment[]> {
  return db.select().from(payment).where(eq(payment.paymentStatus, status));
}

/** Insert a new payment */
export async function createPayment(data: NewPayment): Promise<void> {
  await db.insert(payment).values(data);
}

/** Update an existing payment by ID */
export async function updatePayment(
  id: number,
  data: Partial<NewPayment>,
): Promise<void> {
  await db.update(payment).set(data).where(eq(payment.paymentId, id));
}

/** Delete a payment by ID */
export async function deletePayment(id: number): Promise<void> {
  await db.delete(payment).where(eq(payment.paymentId, id));
}
