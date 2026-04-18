CREATE TABLE `admin` (
	`admin_id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100),
	`email` varchar(100),
	`password` varchar(255),
	CONSTRAINT `admin_admin_id` PRIMARY KEY(`admin_id`),
	CONSTRAINT `email` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `airport_bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`vehicle_id` int NOT NULL,
	`transfer_type` enum('pickup','drop') NOT NULL,
	`airport` enum('katunayaka','mattala') NOT NULL,
	`pickup_date` datetime,
	`pickup_time` time,
	`drop_date` datetime,
	`drop_time` time,
	`passengers` int NOT NULL,
	`luggage_count` int DEFAULT 0,
	`customer_full_name` varchar(100) NOT NULL,
	`customer_phone` varchar(20) NOT NULL,
	`transfer_location` varchar(255) NOT NULL,
	`status` varchar(20) DEFAULT 'PENDING',
	`booking_type` varchar(30) DEFAULT 'airport_rental',
	`rejection_reason` text,
	`handled_by_employee_id` int,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `airport_bookings_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `booking` (
	`booking_id` int AUTO_INCREMENT NOT NULL,
	`service_category_id` int,
	`user_id` int,
	`vehicle_id` int,
	`rental_date` datetime,
	`return_date` datetime,
	`customer_full_name` varchar(100),
	`customer_phone_number1` varchar(15),
	`customer_phone_number2` varchar(15),
	`customer_license_no` varchar(50),
	`customer_nic_no` varchar(20),
	`customer_address` text,
	`customer_driving_licence_pdf` varchar(255),
	`customer_id_pdf` varchar(255),
	`pickup_location` varchar(255),
	`dropoff_location` varchar(255),
	`distance` decimal(10,2),
	`total_fare` decimal(10,2),
	`booking_status` varchar(30) DEFAULT 'PENDING',
	`rejection_reason` text,
	`terms1` boolean DEFAULT false,
	`terms2_confirmation` boolean DEFAULT false,
	`guarantee_fullname` varchar(100),
	`guarantee_address` text,
	`guarantee_phone_no1` varchar(15),
	`guarantee_phone_no2` varchar(15),
	`guarantee_nic_no` varchar(20),
	`guarantee_nic_pdf` varchar(255),
	`guarantee_license_pdf` varchar(255),
	`no_of_travellers` int,
	`no_of_luggages` int,
	`message` text,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`assigned_employee_id` int,
	`paymentslip` varchar(255),
	CONSTRAINT `booking_pk` PRIMARY KEY(`booking_id`)
);
--> statement-breakpoint
CREATE TABLE `damage_reports` (
	`damage_id` int AUTO_INCREMENT NOT NULL,
	`inspection_id` int NOT NULL,
	`damage_type` enum('SMALL_MARK','SCRATCH','DENT','CRACK') NOT NULL,
	`x_position` float NOT NULL,
	`y_position` float NOT NULL,
	`notes` text,
	CONSTRAINT `damage_reports_pk` PRIMARY KEY(`damage_id`)
);
--> statement-breakpoint
CREATE TABLE `driver` (
	`driver_id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100),
	`phone` varchar(15),
	`license_number` varchar(50),
	`experience_years` int,
	`availability_status` varchar(20),
	`vehicle_id` int,
	`admin_id` int,
	CONSTRAINT `driver_driver_id` PRIMARY KEY(`driver_id`)
);
--> statement-breakpoint
CREATE TABLE `email_verification_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires_at` datetime NOT NULL,
	CONSTRAINT `email_verification_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `token` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `employee` (
	`employee_id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100),
	`email` varchar(100),
	`phone` varchar(15),
	`password` varchar(255),
	`status` varchar(20) DEFAULT 'PENDING',
	CONSTRAINT `employee_employee_id` PRIMARY KEY(`employee_id`),
	CONSTRAINT `email` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `inspection` (
	`inspection_id` int AUTO_INCREMENT NOT NULL,
	`booking_id` int NOT NULL,
	`employee_id` int,
	`inspection_type` enum('BEFORE','AFTER') NOT NULL,
	`inspection_date` datetime DEFAULT CURRENT_TIMESTAMP,
	`overall_remarks` text,
	CONSTRAINT `inspection_pk` PRIMARY KEY(`inspection_id`)
);
--> statement-breakpoint
CREATE TABLE `inspection_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`inspection_id` int NOT NULL,
	`item_id` int NOT NULL,
	`status` enum('OK','NOT_OK') NOT NULL,
	`remarks` text,
	CONSTRAINT `inspection_items_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `item` (
	`item_id` int AUTO_INCREMENT NOT NULL,
	`item_name` varchar(100),
	`description` text,
	`status` varchar(30),
	CONSTRAINT `item_item_id` PRIMARY KEY(`item_id`)
);
--> statement-breakpoint
CREATE TABLE `manager` (
	`manager_id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100),
	`email` varchar(100),
	`phone` varchar(15),
	`password` varchar(255),
	CONSTRAINT `manager_manager_id` PRIMARY KEY(`manager_id`),
	CONSTRAINT `email` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `notification` (
	`notification_id` int AUTO_INCREMENT NOT NULL,
	`booking_id` int,
	`message` text,
	`notification_date` datetime,
	`status` varchar(20),
	`admin_id` int,
	`user_id` int,
	CONSTRAINT `notification_notification_id` PRIMARY KEY(`notification_id`)
);
--> statement-breakpoint
CREATE TABLE `password_reset_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires_at` datetime NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `password_reset_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `token` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `payment` (
	`payment_id` int AUTO_INCREMENT NOT NULL,
	`booking_id` int,
	`amount` decimal(10,2),
	`payment_method` varchar(30),
	`payment_date` datetime,
	`payment_status` varchar(30),
	`invoice_number` varchar(50),
	CONSTRAINT `payment_payment_id` PRIMARY KEY(`payment_id`)
);
--> statement-breakpoint
CREATE TABLE `report` (
	`report_id` int AUTO_INCREMENT NOT NULL,
	`report_type` varchar(50),
	`generated_date` date,
	`total_revenue` decimal(12,2),
	`total_customers` int,
	`overdue_vehicles` int,
	`manager_id` int,
	CONSTRAINT `report_report_id` PRIMARY KEY(`report_id`)
);
--> statement-breakpoint
CREATE TABLE `review` (
	`review_id` int AUTO_INCREMENT NOT NULL,
	`booking_id` int,
	`user_id` int,
	`vehicle_id` int,
	`employee_id` int,
	`rating` int NOT NULL,
	`comment` text,
	`review_date` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `review_review_id` PRIMARY KEY(`review_id`),
	CONSTRAINT `review_chk_1` CHECK((`rating` between 1 and 5))
);
--> statement-breakpoint
CREATE TABLE `service_category` (
	`category_id` int AUTO_INCREMENT NOT NULL,
	`category_name` varchar(100) NOT NULL,
	CONSTRAINT `service_category_pk` PRIMARY KEY(`category_id`),
	CONSTRAINT `category_name` UNIQUE(`category_name`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(100),
	`password_hash` varchar(255),
	`role` varchar(20),
	`related_id` int,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`status` varchar(20) DEFAULT 'pending',
	`email_verified` boolean DEFAULT false,
	`verification_token` varchar(255),
	`token_expiry` datetime,
	`name` varchar(100),
	`phone` varchar(15),
	CONSTRAINT `users_id` PRIMARY KEY(`user_id`),
	CONSTRAINT `email` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `vehicle` (
	`vehicle_id` int AUTO_INCREMENT NOT NULL,
	`plate_no` varchar(20) NOT NULL,
	`category_id` int NOT NULL,
	`brand_id` int NOT NULL,
	`model_id` int NOT NULL,
	`vehicle_image` text,
	`seating_capacity` int NOT NULL,
	`luggage_capacity` int NOT NULL,
	`transmission` varchar(20) NOT NULL,
	`fuel_type` varchar(20) NOT NULL,
	`description` text,
	`rent_per_hr` decimal(10,2) NOT NULL,
	`rent_per_day` decimal(10,2) NOT NULL,
	`rent_per_month` decimal(10,2) NOT NULL,
	`max_kms_per_day` int NOT NULL,
	`extra_km_price` decimal(10,2) NOT NULL,
	`rent_per_km` decimal(10,2),
	`minimum_rent_days` int NOT NULL,
	`chassis_number` varchar(100),
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`status` varchar(20) DEFAULT 'AVAILABLE',
	CONSTRAINT `vehicle_pk` PRIMARY KEY(`vehicle_id`),
	CONSTRAINT `plate_no_unique` UNIQUE(`plate_no`)
);
--> statement-breakpoint
CREATE TABLE `vehicle_brand` (
	`brand_id` int AUTO_INCREMENT NOT NULL,
	`brand_name` varchar(100) NOT NULL,
	CONSTRAINT `vehicle_brand_pk` PRIMARY KEY(`brand_id`),
	CONSTRAINT `brand_name` UNIQUE(`brand_name`)
);
--> statement-breakpoint
CREATE TABLE `vehicle_model` (
	`model_id` int AUTO_INCREMENT NOT NULL,
	`model_name` varchar(100) NOT NULL,
	`brand_id` int NOT NULL,
	CONSTRAINT `vehicle_model_pk` PRIMARY KEY(`model_id`),
	CONSTRAINT `brand_model_unique` UNIQUE(`brand_id`,`model_name`)
);
--> statement-breakpoint
ALTER TABLE `airport_bookings` ADD CONSTRAINT `airport_bookings_customer_id_users_user_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `airport_bookings` ADD CONSTRAINT `airport_bookings_vehicle_id_vehicle_vehicle_id_fk` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle`(`vehicle_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `airport_bookings` ADD CONSTRAINT `airport_bookings_handled_by_employee_id_employee_employee_id_fk` FOREIGN KEY (`handled_by_employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `booking` ADD CONSTRAINT `booking_service_category_id_service_category_category_id_fk` FOREIGN KEY (`service_category_id`) REFERENCES `service_category`(`category_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `booking` ADD CONSTRAINT `booking_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `booking` ADD CONSTRAINT `booking_vehicle_id_vehicle_vehicle_id_fk` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle`(`vehicle_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `booking` ADD CONSTRAINT `booking_assigned_employee_id_employee_employee_id_fk` FOREIGN KEY (`assigned_employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `damage_reports` ADD CONSTRAINT `damage_reports_inspection_id_inspection_inspection_id_fk` FOREIGN KEY (`inspection_id`) REFERENCES `inspection`(`inspection_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `driver` ADD CONSTRAINT `driver_vehicle_id_vehicle_vehicle_id_fk` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle`(`vehicle_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `driver` ADD CONSTRAINT `driver_admin_id_admin_admin_id_fk` FOREIGN KEY (`admin_id`) REFERENCES `admin`(`admin_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `email_verification_tokens` ADD CONSTRAINT `email_verification_tokens_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inspection` ADD CONSTRAINT `inspection_booking_id_booking_booking_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `booking`(`booking_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inspection` ADD CONSTRAINT `inspection_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inspection_items` ADD CONSTRAINT `inspection_items_inspection_id_inspection_inspection_id_fk` FOREIGN KEY (`inspection_id`) REFERENCES `inspection`(`inspection_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inspection_items` ADD CONSTRAINT `inspection_items_item_id_item_item_id_fk` FOREIGN KEY (`item_id`) REFERENCES `item`(`item_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_booking_id_booking_booking_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `booking`(`booking_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_admin_id_admin_admin_id_fk` FOREIGN KEY (`admin_id`) REFERENCES `admin`(`admin_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `password_reset_tokens` ADD CONSTRAINT `password_reset_tokens_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment` ADD CONSTRAINT `payment_booking_id_booking_booking_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `booking`(`booking_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `report` ADD CONSTRAINT `report_manager_id_manager_manager_id_fk` FOREIGN KEY (`manager_id`) REFERENCES `manager`(`manager_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `review` ADD CONSTRAINT `review_booking_id_booking_booking_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `booking`(`booking_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `review` ADD CONSTRAINT `review_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `review` ADD CONSTRAINT `review_vehicle_id_vehicle_vehicle_id_fk` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle`(`vehicle_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `review` ADD CONSTRAINT `review_employee_id_employee_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employee_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicle` ADD CONSTRAINT `vehicle_category_id_service_category_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `service_category`(`category_id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `vehicle` ADD CONSTRAINT `vehicle_brand_id_vehicle_brand_brand_id_fk` FOREIGN KEY (`brand_id`) REFERENCES `vehicle_brand`(`brand_id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `vehicle` ADD CONSTRAINT `vehicle_model_id_vehicle_model_model_id_fk` FOREIGN KEY (`model_id`) REFERENCES `vehicle_model`(`model_id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `vehicle_model` ADD CONSTRAINT `vehicle_model_brand_id_vehicle_brand_brand_id_fk` FOREIGN KEY (`brand_id`) REFERENCES `vehicle_brand`(`brand_id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `ab_customer_id_idx` ON `airport_bookings` (`customer_id`);--> statement-breakpoint
CREATE INDEX `ab_vehicle_id_idx` ON `airport_bookings` (`vehicle_id`);--> statement-breakpoint
CREATE INDEX `service_category_id_idx` ON `booking` (`service_category_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `booking` (`user_id`);--> statement-breakpoint
CREATE INDEX `vehicle_id_idx` ON `booking` (`vehicle_id`);--> statement-breakpoint
CREATE INDEX `assigned_employee_id_idx` ON `booking` (`assigned_employee_id`);--> statement-breakpoint
CREATE INDEX `inspection_id_idx` ON `damage_reports` (`inspection_id`);--> statement-breakpoint
CREATE INDEX `vehicle_id` ON `driver` (`vehicle_id`);--> statement-breakpoint
CREATE INDEX `admin_id` ON `driver` (`admin_id`);--> statement-breakpoint
CREATE INDEX `booking_id_idx` ON `inspection` (`booking_id`);--> statement-breakpoint
CREATE INDEX `employee_id_idx` ON `inspection` (`employee_id`);--> statement-breakpoint
CREATE INDEX `inspection_id_idx` ON `inspection_items` (`inspection_id`);--> statement-breakpoint
CREATE INDEX `item_id_idx` ON `inspection_items` (`item_id`);--> statement-breakpoint
CREATE INDEX `booking_id_idx` ON `notification` (`booking_id`);--> statement-breakpoint
CREATE INDEX `admin_id_idx` ON `notification` (`admin_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `notification` (`user_id`);--> statement-breakpoint
CREATE INDEX `booking_id_idx` ON `payment` (`booking_id`);--> statement-breakpoint
CREATE INDEX `manager_id` ON `report` (`manager_id`);--> statement-breakpoint
CREATE INDEX `booking_id_idx` ON `review` (`booking_id`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `review` (`user_id`);--> statement-breakpoint
CREATE INDEX `vehicle_id_idx` ON `review` (`vehicle_id`);--> statement-breakpoint
CREATE INDEX `employee_id_idx` ON `review` (`employee_id`);--> statement-breakpoint
CREATE INDEX `category_id_idx` ON `vehicle` (`category_id`);--> statement-breakpoint
CREATE INDEX `brand_id_idx` ON `vehicle` (`brand_id`);--> statement-breakpoint
CREATE INDEX `model_id_idx` ON `vehicle` (`model_id`);--> statement-breakpoint
CREATE INDEX `brand_id_idx` ON `vehicle_model` (`brand_id`);