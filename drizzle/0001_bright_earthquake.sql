CREATE TABLE `session` (
	`id` varchar(64) NOT NULL,
	`user_id` int NOT NULL,
	`role` varchar(20) NOT NULL,
	`expires_at` datetime NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `agreement` DROP FOREIGN KEY `agreement_ibfk_1`;
--> statement-breakpoint
ALTER TABLE `checklist` DROP FOREIGN KEY `checklist_ibfk_1`;
--> statement-breakpoint
ALTER TABLE `guarantor` DROP FOREIGN KEY `guarantor_ibfk_1`;
--> statement-breakpoint
ALTER TABLE `notification` DROP FOREIGN KEY `notification_ibfk_1`;
--> statement-breakpoint
ALTER TABLE `payment` DROP FOREIGN KEY `payment_ibfk_1`;
--> statement-breakpoint
ALTER TABLE `report` DROP FOREIGN KEY `report_ibfk_1`;
--> statement-breakpoint
ALTER TABLE `reservation` DROP FOREIGN KEY `reservation_ibfk_1`;
--> statement-breakpoint
ALTER TABLE `reservation` DROP FOREIGN KEY `reservation_ibfk_2`;
--> statement-breakpoint
ALTER TABLE `review` DROP FOREIGN KEY `review_ibfk_1`;
--> statement-breakpoint
ALTER TABLE `review` DROP FOREIGN KEY `review_ibfk_2`;
--> statement-breakpoint
ALTER TABLE `agreement` MODIFY COLUMN `terms_accepted` tinyint;--> statement-breakpoint
ALTER TABLE `customer` MODIFY COLUMN `terms_accepted` tinyint;--> statement-breakpoint
ALTER TABLE `agreement` ADD CONSTRAINT `agreement_reservation_id_reservation_reservation_id_fk` FOREIGN KEY (`reservation_id`) REFERENCES `reservation`(`reservation_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `checklist` ADD CONSTRAINT `checklist_reservation_id_reservation_reservation_id_fk` FOREIGN KEY (`reservation_id`) REFERENCES `reservation`(`reservation_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `guarantor` ADD CONSTRAINT `guarantor_customer_id_customer_customer_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_customer_id_customer_customer_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment` ADD CONSTRAINT `payment_reservation_id_reservation_reservation_id_fk` FOREIGN KEY (`reservation_id`) REFERENCES `reservation`(`reservation_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `report` ADD CONSTRAINT `report_manager_id_manager_manager_id_fk` FOREIGN KEY (`manager_id`) REFERENCES `manager`(`manager_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reservation` ADD CONSTRAINT `reservation_customer_id_customer_customer_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reservation` ADD CONSTRAINT `reservation_vehicle_id_vehicle_vehicle_id_fk` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle`(`vehicle_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `review` ADD CONSTRAINT `review_customer_id_customer_customer_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `review` ADD CONSTRAINT `review_vehicle_id_vehicle_vehicle_id_fk` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle`(`vehicle_id`) ON DELETE no action ON UPDATE no action;