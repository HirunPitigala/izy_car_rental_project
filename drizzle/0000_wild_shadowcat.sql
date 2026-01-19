-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `admin` (
	`admin_id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100),
	`email` varchar(100),
	`password` varchar(255),
	CONSTRAINT `admin_admin_id` PRIMARY KEY(`admin_id`),
	CONSTRAINT `email` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `agreement` (
	`agreement_id` int AUTO_INCREMENT NOT NULL,
	`reservation_id` int,
	`document_url` text,
	`agreement_date` date,
	`approval_status` varchar(30),
	`terms_accepted` tinyint(1),
	CONSTRAINT `agreement_agreement_id` PRIMARY KEY(`agreement_id`)
);
--> statement-breakpoint
CREATE TABLE `checklist` (
	`checklist_id` int AUTO_INCREMENT NOT NULL,
	`reservation_id` int,
	`inspection_date` date,
	`inspection_type` varchar(50),
	`remarks` text,
	CONSTRAINT `checklist_checklist_id` PRIMARY KEY(`checklist_id`)
);
--> statement-breakpoint
CREATE TABLE `customer` (
	`customer_id` int AUTO_INCREMENT NOT NULL,
	`full_name` varchar(100),
	`nic` varchar(20),
	`email` varchar(100),
	`phone` varchar(15),
	`address` text,
	`username` varchar(50),
	`password` varchar(255),
	`license_number` varchar(50),
	`registration_date` date,
	`terms_accepted` tinyint(1),
	CONSTRAINT `customer_customer_id` PRIMARY KEY(`customer_id`),
	CONSTRAINT `nic` UNIQUE(`nic`),
	CONSTRAINT `email` UNIQUE(`email`),
	CONSTRAINT `username` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `driver` (
	`driver_id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100),
	`phone` varchar(15),
	`license_number` varchar(50),
	`experience_years` int,
	`availability_status` varchar(20),
	CONSTRAINT `driver_driver_id` PRIMARY KEY(`driver_id`)
);
--> statement-breakpoint
CREATE TABLE `employee` (
	`employee_id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100),
	`email` varchar(100),
	`phone` varchar(15),
	`password` varchar(255),
	CONSTRAINT `employee_employee_id` PRIMARY KEY(`employee_id`),
	CONSTRAINT `email` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `guarantor` (
	`guarantor_id` int AUTO_INCREMENT NOT NULL,
	`full_name` varchar(100),
	`nic` varchar(20),
	`phone` varchar(15),
	`email` varchar(100),
	`address` text,
	`relationship_to_customer` varchar(50),
	`customer_id` int,
	CONSTRAINT `guarantor_guarantor_id` PRIMARY KEY(`guarantor_id`)
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
	`customer_id` int,
	`message` text,
	`notification_date` datetime,
	`status` varchar(20),
	CONSTRAINT `notification_notification_id` PRIMARY KEY(`notification_id`)
);
--> statement-breakpoint
CREATE TABLE `payment` (
	`payment_id` int AUTO_INCREMENT NOT NULL,
	`reservation_id` int,
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
CREATE TABLE `reservation` (
	`reservation_id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int,
	`vehicle_id` int,
	`start_datetime` datetime,
	`end_datetime` datetime,
	`pickup_location` varchar(255),
	`dropoff_location` varchar(255),
	`distance` decimal(10,2),
	`total_fare` decimal(10,2),
	`reservation_status` varchar(30),
	CONSTRAINT `reservation_reservation_id` PRIMARY KEY(`reservation_id`)
);
--> statement-breakpoint
CREATE TABLE `review` (
	`review_id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int,
	`vehicle_id` int,
	`rating` int,
	`comment` text,
	`review_date` date,
	CONSTRAINT `review_review_id` PRIMARY KEY(`review_id`),
	CONSTRAINT `review_chk_1` CHECK((`rating` between 1 and 5))
);
--> statement-breakpoint
CREATE TABLE `service_category` (
	`category_id` int AUTO_INCREMENT NOT NULL,
	`category_name` varchar(100),
	`base_fare` decimal(10,2),
	`additional_rate` decimal(10,2),
	`description` text,
	CONSTRAINT `service_category_category_id` PRIMARY KEY(`category_id`)
);
--> statement-breakpoint
CREATE TABLE `vehicle` (
	`vehicle_id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(50),
	`model` varchar(50),
	`plate_number` varchar(20),
	`capacity` int,
	`transmission_type` varchar(20),
	`fuel_type` varchar(20),
	`luggage_capacity` int,
	`rate_per_hour` decimal(10,2),
	`rate_per_day` decimal(10,2),
	`availability_status` varchar(20),
	`image_url` text,
	`description` text,
	CONSTRAINT `vehicle_vehicle_id` PRIMARY KEY(`vehicle_id`),
	CONSTRAINT `plate_number` UNIQUE(`plate_number`)
);
--> statement-breakpoint
ALTER TABLE `agreement` ADD CONSTRAINT `agreement_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `reservation`(`reservation_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `checklist` ADD CONSTRAINT `checklist_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `reservation`(`reservation_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `guarantor` ADD CONSTRAINT `guarantor_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment` ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `reservation`(`reservation_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `report` ADD CONSTRAINT `report_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `manager`(`manager_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reservation` ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reservation` ADD CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle`(`vehicle_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `review` ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`customer_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `review` ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle`(`vehicle_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `reservation_id` ON `agreement` (`reservation_id`);--> statement-breakpoint
CREATE INDEX `reservation_id` ON `checklist` (`reservation_id`);--> statement-breakpoint
CREATE INDEX `customer_id` ON `guarantor` (`customer_id`);--> statement-breakpoint
CREATE INDEX `customer_id` ON `notification` (`customer_id`);--> statement-breakpoint
CREATE INDEX `reservation_id` ON `payment` (`reservation_id`);--> statement-breakpoint
CREATE INDEX `manager_id` ON `report` (`manager_id`);--> statement-breakpoint
CREATE INDEX `customer_id` ON `reservation` (`customer_id`);--> statement-breakpoint
CREATE INDEX `vehicle_id` ON `reservation` (`vehicle_id`);--> statement-breakpoint
CREATE INDEX `customer_id` ON `review` (`customer_id`);--> statement-breakpoint
CREATE INDEX `vehicle_id` ON `review` (`vehicle_id`);
*/