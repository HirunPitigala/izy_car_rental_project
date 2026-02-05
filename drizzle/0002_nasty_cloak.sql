-- Refined Migration 0002 based on existing DB state

ALTER TABLE `service_category` DROP COLUMN `base_fare`;
--> statement-breakpoint
ALTER TABLE `service_category` DROP COLUMN `additional_rate`;
--> statement-breakpoint
ALTER TABLE `service_category` DROP COLUMN `description`;
--> statement-breakpoint

-- Vehicle Renames
ALTER TABLE `vehicle` RENAME COLUMN `plate_number` TO `plate_no`;
--> statement-breakpoint
ALTER TABLE `vehicle` RENAME COLUMN `image` TO `vehicle_image`;
--> statement-breakpoint
ALTER TABLE `vehicle` RENAME COLUMN `transmission_type` TO `transmission`;
--> statement-breakpoint
ALTER TABLE `vehicle` RENAME COLUMN `rate_per_hour` TO `rent_per_hr`;
--> statement-breakpoint
ALTER TABLE `vehicle` RENAME COLUMN `rate_per_day` TO `rent_per_day`;
--> statement-breakpoint
ALTER TABLE `vehicle` RENAME COLUMN `rate_per_month` TO `rent_per_month`;
--> statement-breakpoint

-- Vehicle New Columns
ALTER TABLE `vehicle` ADD `max_kms_per_day` int NOT NULL DEFAULT 100;
--> statement-breakpoint
ALTER TABLE `vehicle` ADD `extra_km_price` decimal(10,2) NOT NULL DEFAULT '0.00';
--> statement-breakpoint
ALTER TABLE `vehicle` ADD `minimum_rent_days` int NOT NULL DEFAULT 1;
--> statement-breakpoint
ALTER TABLE `vehicle` ADD `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
--> statement-breakpoint

-- Vehicle Modifications
ALTER TABLE `vehicle` MODIFY COLUMN `fuel_type` varchar(20) NOT NULL;
--> statement-breakpoint
ALTER TABLE `vehicle` MODIFY COLUMN `luggage_capacity` int NOT NULL;
--> statement-breakpoint
ALTER TABLE `vehicle` MODIFY COLUMN `seating_capacity` int NOT NULL;
--> statement-breakpoint

-- Drop legacy columns
ALTER TABLE `vehicle` DROP COLUMN `brand`;
--> statement-breakpoint
ALTER TABLE `vehicle` DROP COLUMN `model`;
--> statement-breakpoint
ALTER TABLE `vehicle` DROP COLUMN `service_category`;
--> statement-breakpoint
ALTER TABLE `vehicle` DROP COLUMN `availability_status`;
--> statement-breakpoint
ALTER TABLE `vehicle` DROP COLUMN `image_url`;
--> statement-breakpoint
ALTER TABLE `vehicle` DROP COLUMN `capacity`;