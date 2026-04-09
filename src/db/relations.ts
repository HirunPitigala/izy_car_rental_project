import { relations } from "drizzle-orm/relations";
import { booking, inspection, inspectionItems, damageReports, item, notification, payment, manager, report, vehicle, review, vehicleBrand, vehicleModel, serviceCategory, employee, admin, pickupRequests, users, airportBookings } from "./schema";

export const bookingRelations = relations(booking, ({ one, many }) => ({
	serviceCategory: one(serviceCategory, {
		fields: [booking.serviceCategoryId],
		references: [serviceCategory.categoryId],
	}),
	vehicle: one(vehicle, {
		fields: [booking.vehicleId],
		references: [vehicle.vehicleId],
	}),
	user: one(users, {
		fields: [booking.userId],
		references: [users.userId],
	}),
	payments: many(payment),
	inspections: many(inspection),
	notifications: many(notification),
	reviews: many(review),
	assignedEmployee: one(employee, {
		fields: [booking.assignedEmployeeId],
		references: [employee.employeeId],
	}),
}));

export const inspectionRelations = relations(inspection, ({ one, many }) => ({
	booking: one(booking, {
		fields: [inspection.bookingId],
		references: [booking.bookingId],
	}),
	employee: one(employee, {
		fields: [inspection.employeeId],
		references: [employee.employeeId],
	}),
	items: many(inspectionItems),
	damageReports: many(damageReports),
}));

export const inspectionItemsRelations = relations(inspectionItems, ({ one }) => ({
	inspection: one(inspection, {
		fields: [inspectionItems.inspectionId],
		references: [inspection.inspectionId],
	}),
	item: one(item, {
		fields: [inspectionItems.itemId],
		references: [item.itemId],
	}),
}));

export const damageReportsRelations = relations(damageReports, ({ one }) => ({
	inspection: one(inspection, {
		fields: [damageReports.inspectionId],
		references: [inspection.inspectionId],
	}),
}));

export const itemRelations = relations(item, ({ many }) => ({
	inspectionItems: many(inspectionItems),
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
	user: one(users, {
		fields: [notification.userId],
		references: [users.userId],
	}),
}));

export const paymentRelations = relations(payment, ({ one }) => ({
	booking: one(booking, {
		fields: [payment.bookingId],
		references: [booking.bookingId],
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

export const reportRelations = relations(report, ({ one }) => ({
	manager: one(manager, {
		fields: [report.managerId],
		references: [manager.managerId],
	}),
}));

export const managerRelations = relations(manager, ({ many }) => ({
	reports: many(report),
}));

export const vehicleRelations = relations(vehicle, ({ many, one }) => ({
	reviews: many(review),
	brand: one(vehicleBrand, {
		fields: [vehicle.brandId],
		references: [vehicleBrand.brandId]
	}),
	model: one(vehicleModel, {
		fields: [vehicle.modelId],
		references: [vehicleModel.modelId]
	}),
	category: one(serviceCategory, {
		fields: [vehicle.categoryId],
		references: [serviceCategory.categoryId]
	}),
}));

export const vehicleBrandRelations = relations(vehicleBrand, ({ many }) => ({
	models: many(vehicleModel),
	vehicles: many(vehicle),
}));

export const vehicleModelRelations = relations(vehicleModel, ({ one, many }) => ({
	brand: one(vehicleBrand, {
		fields: [vehicleModel.brandId],
		references: [vehicleBrand.brandId]
	}),
	vehicles: many(vehicle),
}));

export const serviceCategoryRelations = relations(serviceCategory, ({ many }) => ({
	bookings: many(booking),
	vehicles: many(vehicle),
}));

export const pickupRequestRelations = relations(pickupRequests, ({ one }) => ({
	customer: one(users, {
		fields: [pickupRequests.customerId],
		references: [users.userId],
	}),
	vehicle: one(vehicle, {
		fields: [pickupRequests.vehicleId],
		references: [vehicle.vehicleId],
	}),
	assignedEmployee: one(employee, {
		fields: [pickupRequests.assignedEmployeeId],
		references: [employee.employeeId],
	}),
}));

export const airportBookingRelations = relations(airportBookings, ({ one }) => ({
	customer: one(users, {
		fields: [airportBookings.customerId],
		references: [users.userId],
	}),
	vehicle: one(vehicle, {
		fields: [airportBookings.vehicleId],
		references: [vehicle.vehicleId],
	}),
	handledBy: one(employee, {
		fields: [airportBookings.handledByEmployeeId],
		references: [employee.employeeId],
	}),
}));