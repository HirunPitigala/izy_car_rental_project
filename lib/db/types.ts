/**
 * TypeScript types inferred directly from the Drizzle ORM schema.
 * These types exactly mirror the database tables — do not modify manually.
 *
 * SelectType  = shape of a row returned by SELECT
 * InsertType  = shape expected when inserting (autoincrement / defaults are optional)
 */

import {
  admin,
  booking,
  inspection,
  inspectionItems,
  damageReports,
  driver,
  employee,
  item,
  manager,
  notification,
  payment,
  report,
  review,
  serviceCategory,
  vehicleBrand,
  vehicleModel,
  vehicle,
  users,
  emailVerificationTokens,
  passwordResetTokens,
  pickupRequests,
  airportBookings,
} from '@/src/db/schema';

// ─── Admin ────────────────────────────────────────────────────────────────────
export type Admin    = typeof admin.$inferSelect;
export type NewAdmin = typeof admin.$inferInsert;

// ─── Booking ──────────────────────────────────────────────────────────────────
export type Booking    = typeof booking.$inferSelect;
export type NewBooking = typeof booking.$inferInsert;

// ─── Inspection ───────────────────────────────────────────────────────────────
export type Inspection    = typeof inspection.$inferSelect;
export type NewInspection = typeof inspection.$inferInsert;

// ─── Inspection Items ─────────────────────────────────────────────────────────
export type InspectionItem    = typeof inspectionItems.$inferSelect;
export type NewInspectionItem = typeof inspectionItems.$inferInsert;

// ─── Damage Reports ───────────────────────────────────────────────────────────
export type DamageReport    = typeof damageReports.$inferSelect;
export type NewDamageReport = typeof damageReports.$inferInsert;

// ─── Driver ───────────────────────────────────────────────────────────────────
export type Driver    = typeof driver.$inferSelect;
export type NewDriver = typeof driver.$inferInsert;

// ─── Employee ─────────────────────────────────────────────────────────────────
export type Employee    = typeof employee.$inferSelect;
export type NewEmployee = typeof employee.$inferInsert;

// ─── Item (inspection checklist) ──────────────────────────────────────────────
export type Item    = typeof item.$inferSelect;
export type NewItem = typeof item.$inferInsert;

// ─── Manager ──────────────────────────────────────────────────────────────────
export type Manager    = typeof manager.$inferSelect;
export type NewManager = typeof manager.$inferInsert;

// ─── Notification ─────────────────────────────────────────────────────────────
export type Notification    = typeof notification.$inferSelect;
export type NewNotification = typeof notification.$inferInsert;

// ─── Payment ──────────────────────────────────────────────────────────────────
export type Payment    = typeof payment.$inferSelect;
export type NewPayment = typeof payment.$inferInsert;

// ─── Report ───────────────────────────────────────────────────────────────────
export type Report    = typeof report.$inferSelect;
export type NewReport = typeof report.$inferInsert;

// ─── Review ───────────────────────────────────────────────────────────────────
export type Review    = typeof review.$inferSelect;
export type NewReview = typeof review.$inferInsert;

// ─── Service Category ─────────────────────────────────────────────────────────
export type ServiceCategory    = typeof serviceCategory.$inferSelect;
export type NewServiceCategory = typeof serviceCategory.$inferInsert;

// ─── Vehicle Brand ────────────────────────────────────────────────────────────
export type VehicleBrand    = typeof vehicleBrand.$inferSelect;
export type NewVehicleBrand = typeof vehicleBrand.$inferInsert;

// ─── Vehicle Model ────────────────────────────────────────────────────────────
export type VehicleModel    = typeof vehicleModel.$inferSelect;
export type NewVehicleModel = typeof vehicleModel.$inferInsert;

// ─── Vehicle ──────────────────────────────────────────────────────────────────
export type Vehicle    = typeof vehicle.$inferSelect;
export type NewVehicle = typeof vehicle.$inferInsert;

// ─── Users ────────────────────────────────────────────────────────────────────
export type User    = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// ─── Email Verification Tokens ────────────────────────────────────────────────
export type EmailVerificationToken    = typeof emailVerificationTokens.$inferSelect;
export type NewEmailVerificationToken = typeof emailVerificationTokens.$inferInsert;

// ─── Password Reset Tokens ────────────────────────────────────────────────────
export type PasswordResetToken    = typeof passwordResetTokens.$inferSelect;
export type NewPasswordResetToken = typeof passwordResetTokens.$inferInsert;

// ─── Pickup Requests ──────────────────────────────────────────────────────────
export type PickupRequest    = typeof pickupRequests.$inferSelect;
export type NewPickupRequest = typeof pickupRequests.$inferInsert;

// ─── Airport Bookings ─────────────────────────────────────────────────────────
export type AirportBooking    = typeof airportBookings.$inferSelect;
export type NewAirportBooking = typeof airportBookings.$inferInsert;
