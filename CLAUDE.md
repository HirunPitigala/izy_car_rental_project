# Car Rental System — CLAUDE.md

## Project Overview
Full-stack car rental SaaS platform called **IzyCar**. Customers can rent vehicles, book airport pickups, wedding cars, and pickup/delivery services. Admins, managers, and employees each have dedicated dashboards.

Built with Next.js App Router (v16), TypeScript, Drizzle ORM, and MySQL.

## Tech Stack
- **Framework:** Next.js 16.2.1 (App Router, React 19.2.3)
- **Language:** TypeScript 5 (strict mode)
- **Database:** MySQL via Drizzle ORM 0.45.1
- **Styling:** Tailwind CSS v4
- **Auth:** JWT (jose 6.1.3) + HTTP-only session cookies + bcrypt 6.0.0
- **Image hosting:** Cloudinary SDK 2.9.0
- **Email:** Nodemailer 7.0.12 (Gmail SMTP)
- **Maps:** Leaflet 1.9.4 + React Leaflet 5.0.0
- **Charts:** Recharts 3.6.0
- **Icons:** Lucide React 0.562.0
- **Runtime:** Node.js 20 (Alpine in Docker)
- **Misc:** uuid 13.0.0, clsx 2.1.1, tailwind-merge 3.4.0

## Commands

### Development
```bash
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Build for production (standalone output)
npm start          # Start production server
npm run lint       # Run ESLint
```

### Database
```bash
npx drizzle-kit generate   # Generate migration files from schema
npx drizzle-kit migrate    # Apply migrations to DB
npx ts-node migrate.ts     # Alternative migration runner
```

### Docker
```bash
docker-compose up          # Build and run containerized app
```

## Project Structure

```
c:\SDP\car-rental\
├── app/                                    # Next.js App Router pages & API routes
│   ├── layout.tsx                          # Root layout — NotificationProvider, Navbar, NotificationStream
│   ├── page.tsx                            # Home page
│   ├── contact/page.tsx
│   ├── verify-email/page.tsx
│   ├── register/                           # Registration pages
│   │   ├── page.tsx
│   │   ├── customer/page.tsx
│   │   ├── customer-public/page.tsx
│   │   ├── manager/page.tsx
│   │   └── employee/page.tsx
│   ├── (auth)/                             # Unauthenticated pages
│   │   ├── login/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (customer-only)/                    # Customer dashboard pages
│   │   ├── layout.tsx                      # Redirects employees away
│   │   ├── rent/
│   │   │   ├── page.tsx                    # Date/time selection
│   │   │   ├── available/page.tsx
│   │   │   ├── results/page.tsx            # Vehicle listing with filters
│   │   │   ├── [vehicleId]/page.tsx        # Vehicle detail
│   │   │   ├── status/page.tsx             # Booking status tracker
│   │   │   ├── agreement/page.tsx          # Booking form + T&Cs
│   │   │   ├── payment/page.tsx
│   │   │   └── invoice/page.tsx
│   │   ├── airport/
│   │   │   ├── page.tsx
│   │   │   ├── available/page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── bookings/page.tsx
│   │   ├── wedding/
│   │   │   ├── page.tsx
│   │   │   ├── available/page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── pickup-service/page.tsx
│   ├── unauthorized/page.tsx               # Shared unauthorized access page
│   ├── admin/                              # Admin dashboard pages
│   │   ├── layout.tsx                      # Role guard — redirects non-admins
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── components/                 # StatsCard, Charts, TopNav
│   │   ├── reports/
│   │   │   ├── page.tsx
│   │   │   ├── view/page.tsx
│   │   │   ├── daily/page.tsx
│   │   │   ├── weekly/page.tsx
│   │   │   ├── monthly/page.tsx
│   │   │   └── mockData.ts
│   │   ├── vehicles/
│   │   │   ├── page.tsx
│   │   │   ├── edit/[id]/page.tsx
│   │   │   ├── add/page.tsx
│   │   │   ├── rent-a-car/           (page, add, [id]/edit)
│   │   │   ├── airport-rental/       (page, add, [id]/edit)
│   │   │   ├── wedding-cars/         (page, add)
│   │   │   └── pickup-service/       (page, add, [id]/edit)
│   │   ├── bookings/
│   │   │   ├── requested/page.tsx          # Approve / reject bookings (all service types)
│   │   │   ├── airport-bookings/page.tsx
│   │   │   └── wedding-requests/page.tsx
│   │   ├── employees/page.tsx
│   │   └── hello/page.tsx                  # Debug test route
│   ├── customer/
│   │   ├── layout.tsx
│   │   └── dashboard/page.tsx
│   ├── manager/                            # Manager dashboard pages
│   │   ├── layout.tsx                      # Role guard
│   │   └── dashboard/page.tsx
│   ├── employee/                           # Employee dashboard pages
│   │   ├── layout.tsx                      # Role guard
│   │   ├── page.tsx
│   │   ├── pickup-requests/page.tsx
│   │   ├── airport-requests/page.tsx
│   │   └── bookings/
│   │       ├── requested/page.tsx
│   │       └── [id]/inspection/page.tsx
│   └── api/                                # API route handlers
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── admin/login/route.ts        # Hardcoded admin credential check
│       │   ├── logout/route.ts
│       │   ├── session/route.ts
│       │   ├── verify/route.ts             # POST — token-based email verification
│       │   ├── verify-email/route.ts
│       │   ├── forgot-password/route.ts
│       │   └── reset-password/route.ts
│       ├── register/
│       │   ├── customer/route.ts
│       │   ├── customer-public/route.ts
│       │   ├── manager/route.ts
│       │   └── employee/route.ts
│       ├── vehicles/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── admin/vehicles/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── bookings/
│       │   ├── route.ts                    # GET (list pending), PATCH (approve/reject)
│       │   └── create/route.ts             # POST — minimal booking creation
│       ├── pickup/
│       │   ├── search/route.ts
│       │   ├── book/route.ts
│       │   └── bookings/route.ts
│       ├── airport-rental/
│       │   ├── search/route.ts
│       │   ├── book/route.ts               # POST — notifies admins on creation
│       │   ├── bookings/route.ts           # GET + PATCH (approve/reject)
│       │   ├── customer/route.ts
│       │   └── admin/route.ts
│       ├── wedding/route.ts
│       ├── inspection/
│       │   ├── route.ts
│       │   ├── items/route.ts
│       │   └── booking/[id]/
│       │       ├── route.ts
│       │       └── details/route.ts
│       ├── employee/tasks/route.ts
│       ├── notifications/
│       │   ├── route.ts                    # GET — list user's notifications (newest-first)
│       │   ├── [id]/route.ts               # PATCH — mark as READ
│       │   └── stream/route.ts             # GET — SSE real-time stream
│       ├── upload/route.ts                 # POST — Cloudinary image upload
│       └── test-bcrypt/route.ts            # Debug route
├── components/                             # Reusable React components
│   ├── layout/
│   │   ├── Navbar.tsx                      # Role-based nav, scroll-aware, mobile menu
│   │   └── UserProfile.tsx
│   ├── notifications/
│   │   ├── NotificationContext.tsx         # SSE consumer, toast + panel state
│   │   ├── NotificationBadge.tsx           # Bell icon with unread count badge
│   │   └── NotificationStream.tsx          # Toast UI + sidebar panel
│   ├── admin/
│   │   ├── VehicleTable.tsx
│   │   ├── VehicleDetailModal.tsx
│   │   ├── VehicleForm.tsx
│   │   ├── RequestedBookingTable.tsx
│   │   └── BookingDetailModal.tsx
│   ├── rent/
│   │   ├── VehicleCard.tsx
│   │   ├── RentVehicleCard.tsx
│   │   ├── BookingForm.tsx
│   │   ├── BookingSummary.tsx
│   │   ├── AgreementForm.tsx
│   │   ├── InvoiceView.tsx
│   │   └── MapModal.tsx
│   └── employee/inspection/
│       ├── DamageCanvas.tsx
│       ├── ChecklistRow.tsx
│       ├── InspectionCard.tsx
│       └── InspectionComparisonTable.tsx
├── lib/                                    # Server-side utilities and services
│   ├── auth.ts                             # JWT encrypt/decrypt, getSession(), logDebug()
│   ├── db.ts                               # Re-exports db + pool from @/src/db (safe to import)
│   ├── email.ts                            # Nodemailer transporter + email functions
│   ├── notificationBroker.ts               # Global EventEmitter singleton for SSE
│   ├── cloudinary.ts                       # uploadToCloudinary(), uploadBase64ToCloudinary()
│   ├── price-helper.ts                     # calculateRentalPrice(), calculateFinalPrice()
│   ├── validation.ts                       # validateNIC(), validateAddress(), validatePostalCode()
│   ├── token.ts                            # Token generation utilities
│   ├── passwordUtils.ts                    # Password hashing helpers
│   ├── utils.ts
│   ├── constants.ts
│   ├── mockPickMe.ts                       # Stub data
│   ├── mockVehicles.ts                     # Stub data
│   ├── db/                                 # TypeScript database layer (repository pattern)
│   │   ├── types.ts                        # Inferred Select/Insert types for all 24 tables
│   │   ├── index.ts                        # Barrel export — import all repos from one place
│   │   └── repositories/                   # One file per table, full CRUD + filtered queries
│   │       ├── admin.repository.ts
│   │       ├── booking.repository.ts
│   │       ├── inspection.repository.ts
│   │       ├── inspectionItems.repository.ts
│   │       ├── damageReports.repository.ts
│   │       ├── driver.repository.ts
│   │       ├── employee.repository.ts
│   │       ├── item.repository.ts
│   │       ├── manager.repository.ts
│   │       ├── notification.repository.ts
│   │       ├── payment.repository.ts
│   │       ├── report.repository.ts
│   │       ├── review.repository.ts
│   │       ├── serviceCategory.repository.ts
│   │       ├── vehicleBrand.repository.ts
│   │       ├── vehicleModel.repository.ts
│   │       ├── vehicle.repository.ts
│   │       ├── users.repository.ts
│   │       ├── emailVerificationTokens.repository.ts
│   │       ├── passwordResetTokens.repository.ts
│   │       ├── pickupRequests.repository.ts
│   │       └── airportBookings.repository.ts
│   ├── actions/                            # Next.js server actions
│   │   ├── bookingActions.ts               # createBooking, updateBookingStatus, getPendingBookings
│   │   ├── pickupActions.ts                # getPendingPickups, updatePickupStatus
│   │   ├── vehicleActions.ts               # saveVehicle, getAvailableVehicles, getVehicleById
│   │   ├── weddingActions.ts               # getWeddingCars, getWeddingCarById, createWeddingCarInquiry, markWeddingInquiryContacted, addVehicleToWeddingCategory, removeVehicleFromWeddingCategory, getNonWeddingVehicles
│   │   ├── employeeActions.ts              # getAllEmployees, updateEmployeeStatus, deleteEmployee
│   │   └── notificationActions.ts          # sendNotification, notifyAdmins
│   └── services/                           # Business logic services
│       ├── airportRentalService.ts          # searchAvailableAirportVehicles, createAirportBooking, updateAirportBookingStatus
│       └── pickupService.ts                # searchAvailablePickupVehicles, createPickupBooking, updatePickupRequestStatus
├── src/                                    # Modular business logic
│   ├── db/                                 # Drizzle schema & relations — canonical DB instance
│   │   ├── schema.ts                       # All 24 table definitions
│   │   ├── relations.ts                    # Table relationships
│   │   └── index.ts                        # Exports db instance + all schema/relations
│   └── modules/auth/                       # Auth module (service, repository, DTOs)
│       ├── auth.service.ts
│       ├── auth.repository.ts
│       └── auth.dto.ts
├── drizzle/                                # Generated migration files
├── public/                                 # Static assets
├── drizzle.config.ts                       # Drizzle ORM configuration (schema: src/db/schema.ts)
├── next.config.ts                          # Standalone output, Cloudinary + Unsplash image domains
└── docker-compose.yml                      # Docker orchestration
```

## Database Schema (All 24 Tables)

| Table | Description |
|-------|-------------|
| `users` | Base user record (email, passwordHash, role, relatedId, name, phone, status, emailVerified, verificationToken, tokenExpiry) |
| `admin` | Admin profile (name, email, password) |
| `employee` | Employee profile (status: PENDING / ACTIVE) |
| `manager` | Manager profile |
| `driver` | Driver profile, linked to vehicle and admin |
| `vehicle` | Rentable vehicles with pricing, capacity, status, chassisNumber |
| `vehicleBrand` | Vehicle brand lookup |
| `vehicleModel` | Vehicle model lookup (belongs to brand) |
| `serviceCategory` | Service category lookup (regular, airport, pickup, wedding) |
| `booking` | Standard vehicle bookings (includes merged customer + guarantor fields) |
| `inspection` | BEFORE / AFTER vehicle inspections linked to a booking |
| `inspectionItems` | Per-item checklist results (OK / NOT_OK) for an inspection |
| `damageReports` | Damage markers (type, x/y position) linked to an inspection |
| `item` | Inspection checklist item catalog |
| `payment` | Payment records linked to a booking |
| `notification` | In-app notifications (notificationId, bookingId, message, notificationDate, status UNREAD/READ, adminId, userId) |
| `review` | Customer reviews (rating 1–5) linked to booking + vehicle |
| `report` | Manager-generated summary reports |
| `pickupRequests` | Pickup/delivery bookings (customerId, vehicleId, driverId, pickupLocation, dropLocation, pickupTime, returnTime, isReturnTrip, travelers, luggageCount, distanceKm, price, customerFullName, customerPhone, status, rejectionReason, assignedEmployeeId) |
| `airportBookings` | Airport transfer bookings (customerId, vehicleId, transferType: pickup/drop, airport: katunayaka/mattala, pickupDate, pickupTime, dropDate, dropTime, passengers, luggageCount, customerFullName, customerPhone, transferLocation, status, bookingType DEFAULT "airport_rental", rejectionReason, handledByEmployeeId) |
| `emailVerificationTokens` | Email verification token store |
| `passwordResetTokens` | Password reset token store |

**Booking status values:** `PENDING` → `ACCEPTED` / `REJECTED`
**Wedding status values:** `WEDDING_INQUIRY` → `WEDDING_CONTACTED`

Schema defined in: `src/db/schema.ts`
Relations defined in: `src/db/relations.ts`
TypeScript types: `lib/db/types.ts`

## Authentication & Roles

**Flow:** Login → bcrypt verify → JWT issued → stored in HTTP-only `session` cookie (7 days)

**Session type** (`UserSession`):
```ts
{ userId: number, relatedId: number, role: Role, expiresAt: Date, user: { name, email } }
```

**Roles:**
| Role | Dashboard | Notes |
|------|-----------|-------|
| `admin` | `/admin/*` | Hardcoded via `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars — **userId = 0, no DB row required** |
| `manager` | `/manager/*` | Database user |
| `customer` | `/(customer-only)/*` | Database user, status = "active" on registration |
| `employee` | `/employee/*` | Database user, status = "inactive" on registration (must be activated) |

**Key auth files:**
- `lib/auth.ts` — `getSession()`, `encrypt()`, `decrypt()`, `logDebug()`; imports `db` from `@/src/db`
- `src/modules/auth/auth.service.ts` — login/register logic; includes email verification and password reset flows
- `src/modules/auth/auth.repository.ts` — DB queries; `markEmailVerified()` sets `emailVerified: true` and `status: "active"`
- `src/modules/auth/auth.dto.ts` — `LoginDto`, `RegisterCustomerDto`, `RegisterManagerDto`, `RegisterEmployeeDto`

Route protection is done at **layout level** (redirect if wrong role), not middleware.

> **Important — single `db` instance:** Always import `db` from `@/src/db`. `lib/db.ts` now re-exports from `@/src/db`, so both paths resolve to the same instance — but direct use of `@/src/db` is preferred to keep imports explicit.

## Notification System

The notification system delivers **real-time in-app notifications** (via SSE) and **email notifications** when bookings are approved or rejected.

### Architecture
```
Server Action / API Route
        │
        ├─ notificationActions.ts::sendNotification()  ← writes to DB + fires EventEmitter
        │         └─ lib/notificationBroker.ts         ← global singleton EventEmitter
        │                   │
        │           app/api/notifications/stream/route.ts  ← SSE listener (subscribed per user)
        │                   │
        │           EventSource in browser (NotificationContext.tsx)
        │                   │
        │           NotificationStream.tsx + NotificationBadge.tsx
        │
        └─ lib/email.ts::sendBookingStatusEmail()      ← email (non-fatal, swallows errors)
```

### Key Files
| File | Role |
|------|------|
| `lib/notificationBroker.ts` | Global EventEmitter — stored on `global` to survive Next.js module splits |
| `lib/actions/notificationActions.ts` | `sendNotification(userId, msg, bookingId?)` and `notifyAdmins(msg, bookingId?)` |
| `app/api/notifications/stream/route.ts` | `GET /api/notifications/stream` — SSE, 30s heartbeat, user + admin channels |
| `app/api/notifications/route.ts` | `GET /api/notifications` — list user's notifications, newest-first |
| `app/api/notifications/[id]/route.ts` | `PATCH /api/notifications/:id` — mark as READ (ownership check) |
| `components/notifications/NotificationContext.tsx` | Client-side EventSource consumer, 20-notification cap, 5s toast auto-dismiss |
| `components/notifications/NotificationStream.tsx` | Toast UI (top-right) + sidebar panel |
| `components/notifications/NotificationBadge.tsx` | Bell icon with pulsing unread count badge |
| `lib/email.ts::sendBookingStatusEmail()` | Styled HTML email — green APPROVED / red DECLINED |

### Notification Trigger Points
| Event | Who is notified | Channel |
|-------|----------------|---------|
| Customer submits any booking | All admins & managers | `notification:admin` SSE channel + DB |
| Admin approves Rent-a-Car booking | Customer (in-app + email), assigned employee (in-app) | `notification:{userId}` |
| Admin rejects Rent-a-Car booking | Customer (in-app + email) | `notification:{userId}` |
| Admin approves Airport booking | Customer (in-app + email), assigned employee (in-app) | `notification:{userId}` |
| Admin rejects Airport booking | Customer (in-app + email) | `notification:{userId}` |
| Admin approves Pickup booking | Customer (in-app + email), assigned employee (in-app) | `notification:{userId}` |
| Admin rejects Pickup booking | Customer (in-app + email) | `notification:{userId}` |
| Wedding inquiry marked contacted | Customer (in-app) | `notification:{userId}` |

## Environment Variables

```env
# Database (MySQL)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=car_rental_system
DB_PORT=3306

# JWT
JWT_SECRET=<long-random-hex>

# Admin credentials (hardcoded bypass — no DB row needed)
ADMIN_EMAIL=admin@izycar.com
ADMIN_PASSWORD=

# Email (Gmail SMTP app password)
EMAIL_USER=izycarrental@gmail.com
EMAIL_PASS=

# App URL (used in email links)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cloudinary (image hosting)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Config file: `.env.local`

## Key Patterns & Conventions

1. **Repository layer** in `lib/db/repositories/` — primary way to query any table; typed CRUD + filtered getters
2. **Import pattern** — import repos via the barrel: `import { VehicleRepo, BookingRepo } from '@/lib/db'`
3. **Types** — always use inferred types from `lib/db/types.ts` (e.g. `Vehicle`, `NewBooking`); never write manual interfaces
4. **Server Actions** in `lib/actions/` — use for data mutations triggered from client components (`"use server"`)
5. **Service Layer** in `lib/services/` — complex business logic (availability checks, fare calculation); calls repositories internally
6. **API Routes** in `app/api/` — REST endpoints and SSE streaming; call repositories or services directly
7. **Session caching** — `getSession()` uses React `cache()` for per-request deduplication
8. **Image uploads** — always go through `/api/upload` → Cloudinary, never local storage; `saveFileToCloudinary()` returns `null` on network failure (non-fatal)
9. **Role-based redirects** — enforced in layout files, not middleware
10. **Raw Drizzle** — always import `db` from `@/src/db` (canonical instance); `lib/db.ts` re-exports from `@/src/db` and is safe but non-preferred
11. **NotificationBroker** — stored on `global` so server actions and route handlers share the same EventEmitter instance across Next.js module contexts
12. **Email notifications** — `sendBookingStatusEmail()` swallows its own errors; email failure never interrupts booking workflow
13. **Pricing multipliers** — `lib/price-helper.ts`: PICKUP 1.2×, AIRPORT 1.3×, WEDDING 1.5×, NORMAL 1.0×
14. **Distance estimation** — `pickupService.ts::estimateDistance()` is a hash-based stub, not a real geo API (replace for production)
15. **Wedding email workaround** — customer email is stored in the `dropoffLocation` varchar field (schema has no dedicated email column for wedding inquiries)

### Repository usage example
```ts
import { VehicleRepo, BookingRepo, type Vehicle } from '@/lib/db';

const vehicles: Vehicle[] = await VehicleRepo.getVehiclesByStatus('AVAILABLE');
const bookings = await BookingRepo.getBookingsByUserId(userId);
await BookingRepo.updateBooking(bookingId, { status: 'APPROVED' });
```

**Bulk insert variants** (non-standard, inspection only):
- `InspectionItemsRepo.createManyInspectionItems(data[])` — batch-insert checklist results
- `DamageReportsRepo.createManyDamageReports(data[])` — batch-insert damage markers

**Auth repository key methods** (`src/modules/auth/auth.repository.ts`):
- `saveVerificationToken(userId, token, expiresAt)` / `findToken(token)` / `deleteToken(id)`
- `saveResetToken(userId, token, expiresAt)` / `findResetToken(token)` / `deleteResetToken(userId)` / `deleteResetTokenById(id)`
- `markEmailVerified(userId)` — sets `emailVerified: true`, `status: "active"`

## Bug Fixes Applied (errorfix branch)

### 1. Dual Drizzle instance — `Unknown column 'users.id'`
- **Root cause:** `lib/auth.ts` imported `db` from `@/lib/db` while the rest of auth used `@/src/db`. Two separate Drizzle instances with mismatched internal table registries caused MySQL to reject the WHERE clause.
- **Fix:** Changed `lib/auth.ts` to import `db` from `@/src/db`.
- **Rule going forward:** Only ever import `db` from `@/src/db`.

### 2. Schema/DB mismatch — `email_verified_at`
- **Root cause:** `src/db/schema.ts` declared `emailVerifiedAt` on the `users` table, but this column does not exist in the actual MySQL database.
- **Fix:** Removed `emailVerifiedAt` from `src/db/schema.ts`. The `emailVerified` boolean column remains (exists in DB). New columns `verificationToken` and `tokenExpiry` were added directly to the `users` table for inline token storage alongside the `emailVerificationTokens` table.
- **Current state of `users` table verification columns:** `emailVerified boolean DEFAULT false`, `verificationToken varchar(255)`, `tokenExpiry datetime`
- **Downstream changes:**
  - `auth.repository.ts` — `markEmailVerified()` sets `emailVerified: true` and `status: "active"`
  - `lib/db/types.ts` — `User` / `NewUser` types auto-updated via `$inferSelect` / `$inferInsert`

### 3. NotificationBroker singleton isolation
- **Root cause:** Next.js compiles `"use server"` actions and API route handlers into separate bundles, each getting their own module instance. The old static-class singleton created two separate EventEmitter objects, so broker events fired from server actions were never received by the SSE route handler.
- **Fix:** Broker is now stored on `global` (`globalForBroker.notificationBroker`) so all module contexts share one instance.
- **File:** `lib/notificationBroker.ts`

### 4. Cloudinary upload crashes booking creation
- **Root cause:** `saveFileToCloudinary()` caught network errors (e.g. `ENOTFOUND`) but immediately re-threw them, propagating the error up to fail the entire booking.
- **Fix:** On catch, return `null` instead of rethrowing. The booking is inserted with `null` document paths (same outcome as when no file is provided).
- **File:** `lib/actions/bookingActions.ts`

## Branch Info
- Active development branch: `errorfix`
- Main branch: `main`
