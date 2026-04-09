# Car Rental System — CLAUDE.md

## Project Overview
Full-stack car rental SaaS platform called **IzyCar**. Customers can rent vehicles, book airport pickups, wedding cars, and pickup/delivery services. Admins, managers, and employees each have dedicated dashboards.

Built with Next.js App Router (v16), TypeScript, Drizzle ORM, and MySQL.

## Tech Stack
- **Framework:** Next.js 16 (App Router, React 19)
- **Language:** TypeScript 5 (strict mode)
- **Database:** MySQL via Drizzle ORM 0.45
- **Styling:** Tailwind CSS v4
- **Auth:** JWT (jose) + HTTP-only session cookies + bcrypt
- **Image hosting:** Cloudinary
- **Email:** Nodemailer (Gmail SMTP)
- **Maps:** Leaflet + React Leaflet
- **Charts:** Recharts
- **Icons:** Lucide React
- **Runtime:** Node.js 20 (Alpine in Docker)

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
├── app/                        # Next.js App Router pages & API routes
│   ├── (auth)/                 # Login page (unauthenticated)
│   ├── (customer-only)/        # Customer dashboard pages
│   │   ├── airport/[id]/       # Airport rental booking
│   │   ├── pickup-service/     # Pickup service booking
│   │   ├── rent/               # Vehicle rental flow
│   │   └── wedding/            # Wedding car booking
│   ├── admin/                  # Admin dashboard pages
│   ├── manager/                # Manager dashboard pages
│   ├── employee/               # Employee dashboard pages
│   └── api/                    # API route handlers
│       ├── auth/               # Login, logout, verify-email, reset-password
│       ├── register/           # Customer/employee/manager registration
│       ├── vehicles/           # Vehicle CRUD
│       ├── bookings/           # Booking management
│       ├── airport-rental/     # Airport rental service
│       ├── pickup/             # Pickup service
│       ├── wedding/            # Wedding service
│       ├── inspection/         # Vehicle inspection checklists
│       ├── employee/tasks/     # Employee task management
│       ├── notifications/stream/ # SSE real-time notifications
│       └── upload/             # Cloudinary image upload
├── components/                 # Reusable React components
│   ├── admin/                  # Admin-specific components (VehicleForm, etc.)
│   ├── employee/               # Employee components (InspectionCard, etc.)
│   ├── layout/                 # Shared layout (Navbar)
│   ├── notifications/          # Notification UI
│   └── rent/                   # Rental flow components
├── lib/                        # Server-side utilities and services
│   ├── auth.ts                 # JWT encrypt/decrypt, getSession()
│   ├── db.ts                   # MySQL connection pool + Drizzle instance
│   ├── email.ts                # Nodemailer transporter
│   ├── cloudinary.ts           # Image upload wrapper
│   ├── price-helper.ts         # Pricing calculations
│   ├── db/                     # TypeScript database layer (repository pattern)
│   │   ├── types.ts            # Inferred Select/Insert types for all 22 tables
│   │   ├── index.ts            # Barrel export — import all repos from one place
│   │   └── repositories/       # One file per table, full CRUD + filtered queries
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
│   ├── actions/                # Next.js server actions
│   │   ├── bookingActions.ts
│   │   ├── pickupActions.ts
│   │   ├── vehicleActions.ts
│   │   └── weddingActions.ts
│   └── services/               # Business logic services
│       ├── airportRentalService.ts
│       └── pickupService.ts
├── src/                        # Modular business logic
│   ├── db/                     # Drizzle schema & relations
│   │   ├── schema.ts           # All table definitions
│   │   └── relations.ts        # Table relationships
│   └── modules/auth/           # Auth module (service, repository, DTOs)
├── drizzle/                    # Generated migration files
├── public/                     # Static assets
├── drizzle.config.ts           # Drizzle ORM configuration
├── next.config.ts              # Next.js config (standalone output, image domains)
└── docker-compose.yml          # Docker orchestration
```

## Database Schema (Key Tables)

| Table | Description |
|-------|-------------|
| `users` | Base user record (email, passwordHash, role, relatedId) — **no** `email_verified` column in DB |
| `admin` | Admin profile |
| `employee` | Employee profile (status: PENDING / ACTIVE) |
| `manager` | Manager profile |
| `driver` | Driver profile, linked to vehicle and admin |
| `vehicle` | Rentable vehicles with pricing, capacity, status |
| `vehicleBrand` | Vehicle brand lookup |
| `vehicleModel` | Vehicle model lookup (belongs to brand) |
| `serviceCategory` | Service category lookup (regular, airport, pickup, wedding) |
| `booking` | Standard vehicle bookings (includes merged customer + guarantor fields) |
| `inspection` | BEFORE / AFTER vehicle inspections linked to a booking |
| `inspectionItems` | Per-item checklist results (OK / NOT_OK) for an inspection |
| `damageReports` | Damage markers (type, x/y position) linked to an inspection |
| `item` | Inspection checklist item catalog |
| `payment` | Payment records linked to a booking |
| `notification` | In-app notifications for users and admins |
| `review` | Customer reviews (rating 1–5) linked to booking + vehicle |
| `report` | Manager-generated summary reports |
| `pickupRequests` | Pickup/delivery service bookings |
| `airportBookings` | Airport transfer bookings (katunayaka / mattala) |
| `emailVerificationTokens` | Email verification token store |
| `passwordResetTokens` | Password reset token store |

Schema defined in: `src/db/schema.ts`
Relations defined in: `src/db/relations.ts`
TypeScript types: `lib/db/types.ts`

## Authentication & Roles

**Flow:** Login → bcrypt verify → JWT issued → stored in HTTP-only `session` cookie (7 days)

**Roles:**
| Role | Dashboard | Notes |
|------|-----------|-------|
| `admin` | `/admin/*` | Hardcoded via `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars |
| `manager` | `/manager/*` | Database user |
| `customer` | `/(customer-only)/*` | Database user |
| `employee` | `/employee/*` | Database user |

**Key auth files:**
- `lib/auth.ts` — `getSession()`, `encrypt()`, `decrypt()`; imports `db` from `@/src/db` (not `@/lib/db`)
- `src/modules/auth/auth.service.ts` — login/register logic; no email-verified gate (column absent from DB)
- `src/modules/auth/auth.repository.ts` — DB queries; `markEmailVerified()` is a no-op (DB has no `email_verified` column)
- `src/modules/auth/auth.dto.ts` — DTO types

Route protection is done at **layout level** (redirect if wrong role), not middleware.

> **Important — single `db` instance:** Always import `db` from `@/src/db` (not `@/lib/db`). Using `@/lib/db` creates a second Drizzle instance whose table metadata is out of sync, causing `Unknown column` errors at runtime.

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

# Admin credentials (hardcoded bypass)
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

1. **Repository layer** in `lib/db/repositories/` — the primary way to query any table; each file exposes typed CRUD + filtered getters
2. **Import pattern** — import repos via the barrel: `import { VehicleRepo, BookingRepo } from '@/lib/db'`
3. **Types** — always use inferred types from `lib/db/types.ts` (e.g. `Vehicle`, `NewBooking`); never write manual interfaces
4. **Server Actions** in `lib/actions/` — use for data mutations triggered from client components
5. **Service Layer** in `lib/services/` — complex business logic (pricing, availability checks); calls repositories internally
6. **API Routes** in `app/api/` — REST endpoints and SSE streaming; call repositories or services directly
7. **Session caching** — `getSession()` uses React `cache()` for per-request deduplication
8. **Image uploads** — always go through `/api/upload` → Cloudinary, never local storage
9. **Role-based redirects** — enforced in layout files, not middleware
10. **Raw Drizzle** — always import `db` from `@/src/db` (the canonical instance); `lib/db.ts` is a legacy duplicate — do not use it for new code

### Repository usage example
```ts
import { VehicleRepo, BookingRepo, type Vehicle } from '@/lib/db';

const vehicles: Vehicle[] = await VehicleRepo.getVehiclesByStatus('AVAILABLE');
const bookings = await BookingRepo.getBookingsByUserId(userId);
await BookingRepo.updateBooking(bookingId, { status: 'APPROVED' });
```

## Bug Fixes Applied (errorfix branch)

### 1. Dual Drizzle instance — `Unknown column 'users.id'`
- **Root cause:** `lib/auth.ts` imported `db` from `@/lib/db` while the rest of auth used `@/src/db`. Two separate Drizzle instances with mismatched internal table registries caused MySQL to reject the WHERE clause.
- **Fix:** Changed `lib/auth.ts` to import `db` from `@/src/db`.
- **Rule going forward:** Only ever import `db` from `@/src/db`.

### 2. Schema/DB mismatch — `email_verified` / `email_verified_at`
- **Root cause:** `src/db/schema.ts` declared `emailVerified` and `emailVerifiedAt` on the `users` table, but these columns do not exist in the actual MySQL database.
- **Fix:** Removed both columns from `src/db/schema.ts`.
- **Downstream changes:**
  - `auth.service.ts` — removed `!user.emailVerified` login gate and `emailVerified: false` from all `createUser()` calls
  - `auth.repository.ts` — `markEmailVerified()` made a no-op (nothing to update in DB)
  - `lib/db/types.ts` — `User` / `NewUser` types auto-updated via `$inferSelect` / `$inferInsert`
- **Note:** Email verification tokens (`email_verification_tokens` table) still exist and the token flow still runs, but the users table no longer tracks a verified flag.

## Branch Info
- Active development branch: `errorfix`
- Main branch: `main`
