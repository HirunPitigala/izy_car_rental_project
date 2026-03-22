import { relations } from "drizzle-orm/relations";
import { booking, checklist, notification, payment, manager, report, vehicle, review, vehicleBrand, vehicleModel, serviceCategory, employee, admin, pickupRequests, users } from "./schema";

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
		references: [users.id],
	}),
	vehicle: one(vehicle, {
		fields: [pickupRequests.vehicleId],
		references: [vehicle.vehicleId],
	}),
}));