/**
 * Barrel export for all database repositories.
 *
 * Usage example:
 *   import { AdminRepo, BookingRepo, VehicleRepo } from '@/lib/db';
 *   const admins = await AdminRepo.getAllAdmins();
 */

// ─── Types ────────────────────────────────────────────────────────────────────
export * from './types';

// ─── Admin ────────────────────────────────────────────────────────────────────
export * as AdminRepo from './repositories/admin.repository';

// ─── Booking ──────────────────────────────────────────────────────────────────
export * as BookingRepo from './repositories/booking.repository';

// ─── Inspection ───────────────────────────────────────────────────────────────
export * as InspectionRepo from './repositories/inspection.repository';

// ─── Inspection Items ─────────────────────────────────────────────────────────
export * as InspectionItemsRepo from './repositories/inspectionItems.repository';

// ─── Damage Reports ───────────────────────────────────────────────────────────
export * as DamageReportsRepo from './repositories/damageReports.repository';

// ─── Driver ───────────────────────────────────────────────────────────────────
export * as DriverRepo from './repositories/driver.repository';

// ─── Employee ─────────────────────────────────────────────────────────────────
export * as EmployeeRepo from './repositories/employee.repository';

// ─── Item (inspection checklist) ──────────────────────────────────────────────
export * as ItemRepo from './repositories/item.repository';

// ─── Manager ──────────────────────────────────────────────────────────────────
export * as ManagerRepo from './repositories/manager.repository';

// ─── Notification ─────────────────────────────────────────────────────────────
export * as NotificationRepo from './repositories/notification.repository';

// ─── Payment ──────────────────────────────────────────────────────────────────
export * as PaymentRepo from './repositories/payment.repository';

// ─── Report ───────────────────────────────────────────────────────────────────
export * as ReportRepo from './repositories/report.repository';

// ─── Review ───────────────────────────────────────────────────────────────────
export * as ReviewRepo from './repositories/review.repository';

// ─── Service Category ─────────────────────────────────────────────────────────
export * as ServiceCategoryRepo from './repositories/serviceCategory.repository';

// ─── Vehicle Brand ────────────────────────────────────────────────────────────
export * as VehicleBrandRepo from './repositories/vehicleBrand.repository';

// ─── Vehicle Model ────────────────────────────────────────────────────────────
export * as VehicleModelRepo from './repositories/vehicleModel.repository';

// ─── Vehicle ──────────────────────────────────────────────────────────────────
export * as VehicleRepo from './repositories/vehicle.repository';

// ─── Users ────────────────────────────────────────────────────────────────────
export * as UsersRepo from './repositories/users.repository';

// ─── Email Verification Tokens ────────────────────────────────────────────────
export * as EmailVerificationTokensRepo from './repositories/emailVerificationTokens.repository';

// ─── Password Reset Tokens ────────────────────────────────────────────────────
export * as PasswordResetTokensRepo from './repositories/passwordResetTokens.repository';

// ─── Pickup Requests ──────────────────────────────────────────────────────────
export * as PickupRequestsRepo from './repositories/pickupRequests.repository';

// ─── Airport Bookings ─────────────────────────────────────────────────────────
export * as AirportBookingsRepo from './repositories/airportBookings.repository';
