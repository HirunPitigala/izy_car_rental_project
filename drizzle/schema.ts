import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, unique, int, varchar, index, foreignKey, text, date, datetime, decimal, check, tinyint } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const admin = mysqlTable("admin", {
	adminId: int("admin_id").autoincrement().notNull(),
	name: varchar({ length: 100 }),
	email: varchar({ length: 100 }),
	password: varchar({ length: 255 }),
},
	(table) => [
		primaryKey({ columns: [table.adminId], name: "admin_admin_id" }),
		unique("email").on(table.email),
	]);

export const agreement = mysqlTable("agreement", {
	agreementId: int("agreement_id").autoincrement().notNull(),
	reservationId: int("reservation_id").references(() => reservation.reservationId),
	documentUrl: text("document_url"),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	agreementDate: date("agreement_date", { mode: 'string' }),
	approvalStatus: varchar("approval_status", { length: 30 }),
	termsAccepted: tinyint("terms_accepted"),
},
	(table) => [
		index("reservation_id").on(table.reservationId),
		primaryKey({ columns: [table.agreementId], name: "agreement_agreement_id" }),
	]);

export const checklist = mysqlTable("checklist", {
	checklistId: int("checklist_id").autoincrement().notNull(),
	reservationId: int("reservation_id").references(() => reservation.reservationId),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	inspectionDate: date("inspection_date", { mode: 'string' }),
	inspectionType: varchar("inspection_type", { length: 50 }),
	remarks: text(),
},
	(table) => [
		index("reservation_id").on(table.reservationId),
		primaryKey({ columns: [table.checklistId], name: "checklist_checklist_id" }),
	]);

export const customer = mysqlTable("customer", {
	customerId: int("customer_id").autoincrement().notNull(),
	fullName: varchar("full_name", { length: 100 }),
	nic: varchar({ length: 20 }),
	email: varchar({ length: 100 }),
	phone: varchar({ length: 15 }),
	address: text(),
	username: varchar({ length: 50 }),
	password: varchar({ length: 255 }),
	licenseNumber: varchar("license_number", { length: 50 }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	registrationDate: date("registration_date", { mode: 'string' }),
	termsAccepted: tinyint("terms_accepted"),
},
	(table) => [
		primaryKey({ columns: [table.customerId], name: "customer_customer_id" }),
		unique("nic").on(table.nic),
		unique("email").on(table.email),
		unique("username").on(table.username),
	]);

export const driver = mysqlTable("driver", {
	driverId: int("driver_id").autoincrement().notNull(),
	name: varchar({ length: 100 }),
	phone: varchar({ length: 15 }),
	licenseNumber: varchar("license_number", { length: 50 }),
	experienceYears: int("experience_years"),
	availabilityStatus: varchar("availability_status", { length: 20 }),
},
	(table) => [
		primaryKey({ columns: [table.driverId], name: "driver_driver_id" }),
	]);

export const employee = mysqlTable("employee", {
	employeeId: int("employee_id").autoincrement().notNull(),
	name: varchar({ length: 100 }),
	email: varchar({ length: 100 }),
	phone: varchar({ length: 15 }),
	password: varchar({ length: 255 }),
},
	(table) => [
		primaryKey({ columns: [table.employeeId], name: "employee_employee_id" }),
		unique("email").on(table.email),
	]);

export const guarantor = mysqlTable("guarantor", {
	guarantorId: int("guarantor_id").autoincrement().notNull(),
	fullName: varchar("full_name", { length: 100 }),
	nic: varchar({ length: 20 }),
	phone: varchar({ length: 15 }),
	email: varchar({ length: 100 }),
	address: text(),
	relationshipToCustomer: varchar("relationship_to_customer", { length: 50 }),
	customerId: int("customer_id").references(() => customer.customerId),
},
	(table) => [
		index("customer_id").on(table.customerId),
		primaryKey({ columns: [table.guarantorId], name: "guarantor_guarantor_id" }),
	]);

export const item = mysqlTable("item", {
	itemId: int("item_id").autoincrement().notNull(),
	itemName: varchar("item_name", { length: 100 }),
	description: text(),
	status: varchar({ length: 30 }),
},
	(table) => [
		primaryKey({ columns: [table.itemId], name: "item_item_id" }),
	]);

export const manager = mysqlTable("manager", {
	managerId: int("manager_id").autoincrement().notNull(),
	name: varchar({ length: 100 }),
	email: varchar({ length: 100 }),
	phone: varchar({ length: 15 }),
	password: varchar({ length: 255 }),
},
	(table) => [
		primaryKey({ columns: [table.managerId], name: "manager_manager_id" }),
		unique("email").on(table.email),
	]);

export const notification = mysqlTable("notification", {
	notificationId: int("notification_id").autoincrement().notNull(),
	customerId: int("customer_id").references(() => customer.customerId),
	message: text(),
	notificationDate: datetime("notification_date", { mode: 'string' }),
	status: varchar({ length: 20 }),
},
	(table) => [
		index("customer_id").on(table.customerId),
		primaryKey({ columns: [table.notificationId], name: "notification_notification_id" }),
	]);

export const payment = mysqlTable("payment", {
	paymentId: int("payment_id").autoincrement().notNull(),
	reservationId: int("reservation_id").references(() => reservation.reservationId),
	amount: decimal({ precision: 10, scale: 2 }),
	paymentMethod: varchar("payment_method", { length: 30 }),
	paymentDate: datetime("payment_date", { mode: 'string' }),
	paymentStatus: varchar("payment_status", { length: 30 }),
	invoiceNumber: varchar("invoice_number", { length: 50 }),
},
	(table) => [
		index("reservation_id").on(table.reservationId),
		primaryKey({ columns: [table.paymentId], name: "payment_payment_id" }),
	]);

export const report = mysqlTable("report", {
	reportId: int("report_id").autoincrement().notNull(),
	reportType: varchar("report_type", { length: 50 }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	generatedDate: date("generated_date", { mode: 'string' }),
	totalRevenue: decimal("total_revenue", { precision: 12, scale: 2 }),
	totalCustomers: int("total_customers"),
	overdueVehicles: int("overdue_vehicles"),
	managerId: int("manager_id").references(() => manager.managerId),
},
	(table) => [
		index("manager_id").on(table.managerId),
		primaryKey({ columns: [table.reportId], name: "report_report_id" }),
	]);

export const reservation = mysqlTable("reservation", {
	reservationId: int("reservation_id").autoincrement().notNull(),
	customerId: int("customer_id").references(() => customer.customerId),
	vehicleId: int("vehicle_id").references(() => vehicle.vehicleId),
	startDatetime: datetime("start_datetime", { mode: 'string' }),
	endDatetime: datetime("end_datetime", { mode: 'string' }),
	pickupLocation: varchar("pickup_location", { length: 255 }),
	dropoffLocation: varchar("dropoff_location", { length: 255 }),
	distance: decimal({ precision: 10, scale: 2 }),
	totalFare: decimal("total_fare", { precision: 10, scale: 2 }),
	reservationStatus: varchar("reservation_status", { length: 30 }),
},
	(table) => [
		index("customer_id").on(table.customerId),
		index("vehicle_id").on(table.vehicleId),
		primaryKey({ columns: [table.reservationId], name: "reservation_reservation_id" }),
	]);

export const review = mysqlTable("review", {
	reviewId: int("review_id").autoincrement().notNull(),
	customerId: int("customer_id").references(() => customer.customerId),
	vehicleId: int("vehicle_id").references(() => vehicle.vehicleId),
	rating: int(),
	comment: text(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	reviewDate: date("review_date", { mode: 'string' }),
},
	(table) => [
		index("customer_id").on(table.customerId),
		index("vehicle_id").on(table.vehicleId),
		primaryKey({ columns: [table.reviewId], name: "review_review_id" }),
		check("review_chk_1", sql`(\`rating\` between 1 and 5)`),
	]);

export const serviceCategory = mysqlTable("service_category", {
	categoryId: int("category_id").autoincrement().notNull(),
	categoryName: varchar("category_name", { length: 100 }),
	baseFare: decimal("base_fare", { precision: 10, scale: 2 }),
	additionalRate: decimal("additional_rate", { precision: 10, scale: 2 }),
	description: text(),
},
	(table) => [
		primaryKey({ columns: [table.categoryId], name: "service_category_category_id" }),
	]);

export const vehicle = mysqlTable("vehicle", {
	vehicleId: int("vehicle_id").autoincrement().notNull(),
	brand: varchar({ length: 50 }),
	model: varchar({ length: 50 }),
	plateNumber: varchar("plate_number", { length: 20 }),
	capacity: int(),
	seatingCapacity: int("seating_capacity"),
	transmissionType: varchar("transmission_type", { length: 20 }),
	fuelType: varchar("fuel_type", { length: 20 }),
	luggageCapacity: int("luggage_capacity"),
	availabilityStatus: varchar("availability_status", { length: 20 }),
	status: varchar("status", { length: 20 }), // AVAILABLE / UNAVAILABLE / MAINTENANCE
	serviceCategory: varchar("service_category", { length: 50 }), // PICKME / WEDDING / AIRPORT / NORMAL
	ratePerDay: decimal("rate_per_day", { precision: 10, scale: 2 }),
	ratePerMonth: decimal("rate_per_month", { precision: 10, scale: 2 }),
	image: text("image"), // Store Base64
	imageUrl: text("image_url"), // Deprecating but keeping for safety
	description: text(),
	createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
},
	(table) => [
		primaryKey({ columns: [table.plateNumber], name: "vehicle_plate_number" }),
		unique("plate_number").on(table.plateNumber),
	]);

export const users = mysqlTable("users", {
	id: int("id").autoincrement().notNull(),
	email: varchar({ length: 100 }),
	passwordHash: varchar("password_hash", { length: 255 }),
	role: varchar({ length: 20 }), // ADMIN | MANAGER | EMPLOYEE | CUSTOMER
	relatedId: int("related_id"), // points to admin.id / customer.id / etc
	createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
	status: varchar({ length: 20 }).default("active"),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "users_id" }),
		unique("email").on(table.email),
	]);

