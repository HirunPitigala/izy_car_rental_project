ALTER TABLE `users` MODIFY COLUMN `status` varchar(20) DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `users` ADD `is_verified` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `verification_token` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `token_expiry` datetime;