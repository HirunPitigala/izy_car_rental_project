import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { notification } from '@/src/db/schema';
import type { Notification, NewNotification } from '../types';

/** Retrieve all notifications */
export async function getAllNotifications(): Promise<Notification[]> {
  return db.select().from(notification);
}

/** Retrieve a single notification by primary key */
export async function getNotificationById(id: number): Promise<Notification | undefined> {
  const rows = await db
    .select()
    .from(notification)
    .where(eq(notification.notificationId, id));
  return rows[0];
}

/** Retrieve all notifications for a specific user */
export async function getNotificationsByUserId(userId: number): Promise<Notification[]> {
  return db.select().from(notification).where(eq(notification.userId, userId));
}

/** Retrieve all notifications linked to a specific booking */
export async function getNotificationsByBookingId(
  bookingId: number,
): Promise<Notification[]> {
  return db.select().from(notification).where(eq(notification.bookingId, bookingId));
}

/** Retrieve all notifications for a specific admin */
export async function getNotificationsByAdminId(adminId: number): Promise<Notification[]> {
  return db.select().from(notification).where(eq(notification.adminId, adminId));
}

/** Retrieve all notifications filtered by status (e.g. READ, UNREAD) */
export async function getNotificationsByStatus(status: string): Promise<Notification[]> {
  return db.select().from(notification).where(eq(notification.status, status));
}

/** Insert a new notification */
export async function createNotification(data: NewNotification): Promise<void> {
  await db.insert(notification).values(data);
}

/** Update an existing notification by ID */
export async function updateNotification(
  id: number,
  data: Partial<NewNotification>,
): Promise<void> {
  await db.update(notification).set(data).where(eq(notification.notificationId, id));
}

/** Delete a notification by ID */
export async function deleteNotification(id: number): Promise<void> {
  await db.delete(notification).where(eq(notification.notificationId, id));
}
