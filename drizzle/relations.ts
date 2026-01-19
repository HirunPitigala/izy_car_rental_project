import { relations } from "drizzle-orm/relations";
import { reservation, agreement, checklist, customer, guarantor, notification, payment, manager, report, vehicle, review } from "./schema";

export const agreementRelations = relations(agreement, ({one}) => ({
	reservation: one(reservation, {
		fields: [agreement.reservationId],
		references: [reservation.reservationId]
	}),
}));

export const reservationRelations = relations(reservation, ({one, many}) => ({
	agreements: many(agreement),
	checklists: many(checklist),
	payments: many(payment),
	customer: one(customer, {
		fields: [reservation.customerId],
		references: [customer.customerId]
	}),
	vehicle: one(vehicle, {
		fields: [reservation.vehicleId],
		references: [vehicle.vehicleId]
	}),
}));

export const checklistRelations = relations(checklist, ({one}) => ({
	reservation: one(reservation, {
		fields: [checklist.reservationId],
		references: [reservation.reservationId]
	}),
}));

export const guarantorRelations = relations(guarantor, ({one}) => ({
	customer: one(customer, {
		fields: [guarantor.customerId],
		references: [customer.customerId]
	}),
}));

export const customerRelations = relations(customer, ({many}) => ({
	guarantors: many(guarantor),
	notifications: many(notification),
	reservations: many(reservation),
	reviews: many(review),
}));

export const notificationRelations = relations(notification, ({one}) => ({
	customer: one(customer, {
		fields: [notification.customerId],
		references: [customer.customerId]
	}),
}));

export const paymentRelations = relations(payment, ({one}) => ({
	reservation: one(reservation, {
		fields: [payment.reservationId],
		references: [reservation.reservationId]
	}),
}));

export const reportRelations = relations(report, ({one}) => ({
	manager: one(manager, {
		fields: [report.managerId],
		references: [manager.managerId]
	}),
}));

export const managerRelations = relations(manager, ({many}) => ({
	reports: many(report),
}));

export const vehicleRelations = relations(vehicle, ({many}) => ({
	reservations: many(reservation),
	reviews: many(review),
}));

export const reviewRelations = relations(review, ({one}) => ({
	customer: one(customer, {
		fields: [review.customerId],
		references: [customer.customerId]
	}),
	vehicle: one(vehicle, {
		fields: [review.vehicleId],
		references: [vehicle.vehicleId]
	}),
}));