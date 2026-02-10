ALTER TABLE `booking` MODIFY COLUMN `service_category_id` int;--> statement-breakpoint
ALTER TABLE `booking` MODIFY COLUMN `rental_date` datetime;--> statement-breakpoint
ALTER TABLE `booking` MODIFY COLUMN `return_date` datetime;--> statement-breakpoint
ALTER TABLE `booking` MODIFY COLUMN `customer_full_name` varchar(100);--> statement-breakpoint
ALTER TABLE `booking` MODIFY COLUMN `customer_phone_number1` varchar(15);--> statement-breakpoint
ALTER TABLE `booking` MODIFY COLUMN `customer_license_no` varchar(50);--> statement-breakpoint
ALTER TABLE `booking` MODIFY COLUMN `customer_nic_no` varchar(20);--> statement-breakpoint
ALTER TABLE `booking` ADD `user_id` int;--> statement-breakpoint
ALTER TABLE `booking` ADD `vehicle_id` int;--> statement-breakpoint
ALTER TABLE `booking` ADD `customer_id_pdf` blob;--> statement-breakpoint
ALTER TABLE `booking` ADD `pickup_location` varchar(255);--> statement-breakpoint
ALTER TABLE `booking` ADD `dropoff_location` varchar(255);--> statement-breakpoint
ALTER TABLE `booking` ADD `distance` decimal(10,2);--> statement-breakpoint
ALTER TABLE `booking` ADD `total_fare` decimal(10,2);--> statement-breakpoint
ALTER TABLE `booking` ADD `booking_status` varchar(30) DEFAULT 'PENDING';--> statement-breakpoint
ALTER TABLE `booking` ADD `rejection_reason` text;--> statement-breakpoint
ALTER TABLE `booking` ADD `status` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `vehicle` ADD `chassis_number` varchar(100);--> statement-breakpoint
ALTER TABLE `booking` ADD CONSTRAINT `booking_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `booking` ADD CONSTRAINT `booking_vehicle_id_vehicle_vehicle_id_fk` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle`(`vehicle_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `booking` (`user_id`);--> statement-breakpoint
CREATE INDEX `vehicle_id_idx` ON `booking` (`vehicle_id`);