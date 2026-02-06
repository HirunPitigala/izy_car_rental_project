import { mysqlTable, primaryKey, unique, int, varchar, index, text, date, datetime, decimal, check, boolean, customType } from "drizzle-orm/mysql-core"
import { sql, relations } from "drizzle-orm"

// Custom blob type for binary storage (PDFs, etc.)
const mysqlBlob = customType<{ data: Buffer }>({
	dataType() {
		return 'blob';
	},
});

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

export const booking = mysqlTable("booking", {
	bookingId: int("booking_id").autoincrement().notNull(),
	serviceCategoryId: int("service_category_id").notNull().references(() => serviceCategory.categoryId),

	// Rental Details
	rentalDate: datetime("rental_date").notNull(),
	returnDate: datetime("return_date").notNull(),

	// Customer Details
	customerFullName: varchar("customer_full_name", { length: 100 }).notNull(),
	customerPhoneNumber1: varchar("customer_phone_number1", { length: 15 }).notNull(),
	customerPhoneNumber2: varchar("customer_phone_number2", { length: 15 }),
	customerLicenseNo: varchar("customer_license_no", { length: 50 }).notNull(),
	customerNicNo: varchar("customer_nic_no", { length: 20 }).notNull(),
	customerDrivingLicencePdf: mysqlBlob("customer_driving_licence_pdf"),

	// Terms Acceptance
	terms1: boolean("terms1").default(false),
	terms2Confirmation: boolean("terms2_confirmation").default(false),

	// Guarantee Person Details
	guaranteeFullname: varchar("guarantee_fullname", { length: 100 }),
	guaranteeAddress: text("guarantee_address"),
	guaranteePhoneNo1: varchar("guarantee_phone_no1", { length: 15 }),
	guaranteePhoneNo2: varchar("guarantee_phone_no2", { length: 15 }),
	guaranteeNicNo: varchar("guarantee_nic_no", { length: 20 }),
	guaranteeNicPdf: mysqlBlob("guarantee_nic_pdf"),
	guaranteeLicensePdf: mysqlBlob("guarantee_license_pdf"),

	createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
},
	(table) => [
		primaryKey({ columns: [table.bookingId], name: "booking_pk" }),
		index("service_category_id_idx").on(table.serviceCategoryId),
	]);

export const checklist = mysqlTable("checklist", {
	checklistId: int("checklist_id").autoincrement().notNull(),
	bookingId: int("booking_id").references(() => booking.bookingId),
	inspectionDate: date("inspection_date", { mode: 'string' }),
	inspectionType: varchar("inspection_type", { length: 50 }),
	remarks: text(),
	employeeId: int("employee_id").references(() => employee.employeeId),
},
	(table) => [
		index("booking_id_idx").on(table.bookingId),
		index("employee_id_idx").on(table.employeeId),
		primaryKey({ columns: [table.checklistId], name: "checklist_checklist_id" }),
	]);

export const driver = mysqlTable("driver", {
	driverId: int("driver_id").autoincrement().notNull(),
	name: varchar({ length: 100 }),
	phone: varchar({ length: 15 }),
	licenseNumber: varchar("license_number", { length: 50 }),
	experienceYears: int("experience_years"),
	availabilityStatus: varchar("availability_status", { length: 20 }),
	vehicleId: int("vehicle_id").references(() => vehicle.vehicleId),
	adminId: int("admin_id").references(() => admin.adminId),
},
	(table) => [
		primaryKey({ columns: [table.driverId], name: "driver_driver_id" }),
		index("vehicle_id").on(table.vehicleId),
		index("admin_id").on(table.adminId),
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
	bookingId: int("booking_id").references(() => booking.bookingId),
	message: text(),
	notificationDate: datetime("notification_date", { mode: 'string' }),
	status: varchar({ length: 20 }),
	adminId: int("admin_id").references(() => admin.adminId),
},
	(table) => [
		index("booking_id_idx").on(table.bookingId),
		index("admin_id_idx").on(table.adminId),
		primaryKey({ columns: [table.notificationId], name: "notification_notification_id" }),
	]);

export const payment = mysqlTable("payment", {
	paymentId: int("payment_id").autoincrement().notNull(),
	bookingId: int("booking_id").references(() => booking.bookingId),
	amount: decimal({ precision: 10, scale: 2 }),
	paymentMethod: varchar("payment_method", { length: 30 }),
	paymentDate: datetime("payment_date", { mode: 'string' }),
	paymentStatus: varchar("payment_status", { length: 30 }),
	invoiceNumber: varchar("invoice_number", { length: 50 }),
},
	(table) => [
		index("booking_id_idx").on(table.bookingId),
		primaryKey({ columns: [table.paymentId], name: "payment_payment_id" }),
	]);

export const report = mysqlTable("report", {
	reportId: int("report_id").autoincrement().notNull(),
	reportType: varchar("report_type", { length: 50 }),
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

export const review = mysqlTable("review", {
	reviewId: int("review_id").autoincrement().notNull(),
	bookingId: int("booking_id").references(() => booking.bookingId),
	vehicleId: int("vehicle_id").references(() => vehicle.vehicleId),
	rating: int(),
	comment: text(),
	reviewDate: date("review_date", { mode: 'string' }),
},
	(table) => [
		index("booking_id_idx").on(table.bookingId),
		index("vehicle_id_idx").on(table.vehicleId),
		primaryKey({ columns: [table.reviewId], name: "review_review_id" }),
		check("review_chk_1", sql`(\`rating\` between 1 and 5)`),
	]);

export const serviceCategory = mysqlTable("service_category", {
	categoryId: int("category_id").autoincrement().notNull(),
	categoryName: varchar("category_name", { length: 100 }).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.categoryId], name: "service_category_pk" }),
		unique("category_name").on(table.categoryName),
	]);

export const vehicleBrand = mysqlTable("vehicle_brand", {
	brandId: int("brand_id").autoincrement().notNull(),
	brandName: varchar("brand_name", { length: 100 }).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.brandId], name: "vehicle_brand_pk" }),
		unique("brand_name").on(table.brandName),
	]);

export const vehicleModel = mysqlTable("vehicle_model", {
	modelId: int("model_id").autoincrement().notNull(),
	modelName: varchar("model_name", { length: 100 }).notNull(),
	brandId: int("brand_id").notNull().references(() => vehicleBrand.brandId, { onDelete: 'cascade', onUpdate: 'cascade' }),
},
	(table) => [
		primaryKey({ columns: [table.modelId], name: "vehicle_model_pk" }),
		index("brand_id_idx").on(table.brandId),
		unique("brand_model_unique").on(table.brandId, table.modelName),
	]);

export const vehicle = mysqlTable("vehicle", {
	vehicleId: int("vehicle_id").autoincrement().notNull(),
	plateNumber: varchar("plate_no", { length: 20 }).notNull(),
	categoryId: int("category_id").notNull().references(() => serviceCategory.categoryId, { onDelete: 'restrict', onUpdate: 'cascade' }),
	brandId: int("brand_id").notNull().references(() => vehicleBrand.brandId, { onDelete: 'restrict', onUpdate: 'cascade' }),
	modelId: int("model_id").notNull().references(() => vehicleModel.modelId, { onDelete: 'restrict', onUpdate: 'cascade' }),
	vehicleImage: text("vehicle_image"),
	seatingCapacity: int("seating_capacity").notNull(),
	luggageCapacity: int("luggage_capacity").notNull(),
	transmission: varchar("transmission", { length: 20 }).notNull(),
	fuelType: varchar("fuel_type", { length: 20 }).notNull(),
	description: text("description"),
	rentPerHour: decimal("rent_per_hr", { precision: 10, scale: 2 }).notNull(),
	rentPerDay: decimal("rent_per_day", { precision: 10, scale: 2 }).notNull(),
	rentPerMonth: decimal("rent_per_month", { precision: 10, scale: 2 }).notNull(),
	maxKmsPerDay: int("max_kms_per_day").notNull(),
	extraKmPrice: decimal("extra_km_price", { precision: 10, scale: 2 }).notNull(),
	minRentalDays: int("minimum_rent_days").notNull(),
	createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date()),
	status: varchar("status", { length: 20 }).default("AVAILABLE"),
},
	(table) => [
		primaryKey({ columns: [table.vehicleId], name: "vehicle_pk" }),
		unique("plate_no_unique").on(table.plateNumber),
		index("category_id_idx").on(table.categoryId),
		index("brand_id_idx").on(table.brandId),
		index("model_id_idx").on(table.modelId),
	]);

export const users = mysqlTable("users", {
	id: int("id").autoincrement().notNull(),
	email: varchar({ length: 100 }),
	passwordHash: varchar("password_hash", { length: 255 }),
	role: varchar({ length: 20 }),
	relatedId: int("related_id"),
	createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
	status: varchar({ length: 20 }).default("active"),
	name: varchar({ length: 100 }),
	phone: varchar({ length: 15 }),
	emailVerified: boolean("email_verified").default(false),
	emailVerifiedAt: datetime("email_verified_at"),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "users_id" }),
		unique("email").on(table.email),
	]);

export const emailVerificationTokens = mysqlTable("email_verification_tokens", {
	id: int("id").autoincrement().notNull(),
	userId: int("user_id").references(() => users.id).notNull(),
	token: varchar("token", { length: 255 }).notNull(),
	expiresAt: datetime("expires_at").notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "email_verification_tokens_id" }),
		unique("token").on(table.token),
	]);

export const passwordResetTokens = mysqlTable("password_reset_tokens", {
	id: int("id").autoincrement().notNull(),
	userId: int("user_id").references(() => users.id).notNull(),
	token: varchar("token", { length: 255 }).notNull(),
	expiresAt: datetime("expires_at").notNull(),
	createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "password_reset_tokens_id" }),
		unique("token").on(table.token),
	]);

// Relations
export const bookingRelations = relations(booking, ({ one, many }) => ({
	serviceCategory: one(serviceCategory, {
		fields: [booking.serviceCategoryId],
		references: [serviceCategory.categoryId],
	}),
	payments: many(payment),
	checklists: many(checklist),
	notifications: many(notification),
	reviews: many(review),
}));

export const serviceCategoryRelations = relations(serviceCategory, ({ many }) => ({
	bookings: many(booking),
	vehicles: many(vehicle),
}));

export const paymentRelations = relations(payment, ({ one }) => ({
	booking: one(booking, {
		fields: [payment.bookingId],
		references: [booking.bookingId],
	}),
}));

export const checklistRelations = relations(checklist, ({ one }) => ({
	booking: one(booking, {
		fields: [checklist.bookingId],
		references: [booking.bookingId],
	}),
	employee: one(employee, {
		fields: [checklist.employeeId],
		references: [employee.employeeId],
	}),
}));

export const notificationRelations = relations(notification, ({ one }) => ({
	booking: one(booking, {
		fields: [notification.bookingId],
		references: [booking.bookingId],
	}),
	admin: one(admin, {
		fields: [notification.adminId],
		references: [admin.adminId],
	}),
}));

export const reviewRelations = relations(review, ({ one }) => ({
	booking: one(booking, {
		fields: [review.bookingId],
		references: [booking.bookingId],
	}),
	vehicle: one(vehicle, {
		fields: [review.vehicleId],
		references: [vehicle.vehicleId],
	}),
}));
