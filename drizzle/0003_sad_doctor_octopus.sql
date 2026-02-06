CREATE TABLE `booking` (
	`booking_id` int AUTO_INCREMENT NOT NULL,
	`service_category_id` int NOT NULL,
	`rental_date` datetime NOT NULL,
	`return_date` datetime NOT NULL,
	`customer_full_name` varchar(100) NOT NULL,
	`customer_phone_number1` varchar(15) NOT NULL,
	`customer_phone_number2` varchar(15),
	`customer_license_no` varchar(50) NOT NULL,
	`customer_nic_no` varchar(20) NOT NULL,
	`customer_driving_licence_pdf` blob,
	`terms1` boolean DEFAULT false,
	`terms2_confirmation` boolean DEFAULT false,
	`guarantee_fullname` varchar(100),
	`guarantee_address` text,
	`guarantee_phone_no1` varchar(15),
	`guarantee_phone_no2` varchar(15),
	`guarantee_nic_no` varchar(20),
	`guarantee_nic_pdf` blob,
	`guarantee_license_pdf` blob,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `booking_pk` PRIMARY KEY(`booking_id`)
);
--> statement-breakpoint
DROP TABLE `agreement`;--> statement-breakpoint
DROP TABLE `customer`;--> statement-breakpoint
DROP TABLE `guarantor`;--> statement-breakpoint
DROP TABLE `reservation`;--> statement-breakpoint
ALTER TABLE `checklist` DROP FOREIGN KEY `checklist_reservation_id_reservation_reservation_id_fk`;
--> statement-breakpoint
ALTER TABLE `notification` DROP FOREIGN KEY `notification_customer_id_customer_customer_id_fk`;
--> statement-breakpoint
ALTER TABLE `payment` DROP FOREIGN KEY `payment_reservation_id_reservation_reservation_id_fk`;
--> statement-breakpoint
ALTER TABLE `review` DROP FOREIGN KEY `review_customer_id_customer_customer_id_fk`;
--> statement-breakpoint
ALTER TABLE `review` DROP FOREIGN KEY `review_reservation_id_reservation_reservation_id_fk`;
--> statement-breakpoint
DROP INDEX `reservation_id` ON `checklist`;--> statement-breakpoint
DROP INDEX `employee_id` ON `checklist`;--> statement-breakpoint
DROP INDEX `customer_id` ON `notification`;--> statement-breakpoint
DROP INDEX `admin_id` ON `notification`;--> statement-breakpoint
DROP INDEX `reservation_id` ON `payment`;--> statement-breakpoint
DROP INDEX `customer_id` ON `review`;--> statement-breakpoint
DROP INDEX `vehicle_id` ON `review`;--> statement-breakpoint
DROP INDEX `reservation_id` ON `review`;--> statement-breakpoint
ALTER TABLE `checklist` ADD `booking_id` int;--> statement-breakpoint
ALTER TABLE `notification` ADD `booking_id` int;--> statement-breakpoint
ALTER TABLE `payment` ADD `booking_id` int;--> statement-breakpoint
ALTER TABLE `review` ADD `booking_id` int;--> statement-breakpoint
ALTER TABLE `booking` ADD CONSTRAINT `booking_service_category_id_service_category_category_id_fk` FOREIGN KEY (`service_category_id`) REFERENCES `service_category`(`category_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `service_category_id_idx` ON `booking` (`service_category_id`);--> statement-breakpoint
ALTER TABLE `checklist` ADD CONSTRAINT `checklist_booking_id_booking_booking_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `booking`(`booking_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_booking_id_booking_booking_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `booking`(`booking_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment` ADD CONSTRAINT `payment_booking_id_booking_booking_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `booking`(`booking_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `review` ADD CONSTRAINT `review_booking_id_booking_booking_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `booking`(`booking_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `booking_id_idx` ON `checklist` (`booking_id`);--> statement-breakpoint
CREATE INDEX `employee_id_idx` ON `checklist` (`employee_id`);--> statement-breakpoint
CREATE INDEX `booking_id_idx` ON `notification` (`booking_id`);--> statement-breakpoint
CREATE INDEX `admin_id_idx` ON `notification` (`admin_id`);--> statement-breakpoint
CREATE INDEX `booking_id_idx` ON `payment` (`booking_id`);--> statement-breakpoint
CREATE INDEX `booking_id_idx` ON `review` (`booking_id`);--> statement-breakpoint
CREATE INDEX `vehicle_id_idx` ON `review` (`vehicle_id`);--> statement-breakpoint
ALTER TABLE `checklist` DROP COLUMN `reservation_id`;--> statement-breakpoint
ALTER TABLE `notification` DROP COLUMN `customer_id`;--> statement-breakpoint
ALTER TABLE `payment` DROP COLUMN `reservation_id`;--> statement-breakpoint
ALTER TABLE `review` DROP COLUMN `customer_id`;--> statement-breakpoint
ALTER TABLE `review` DROP COLUMN `reservation_id`;