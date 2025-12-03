ALTER TABLE `vehicle` RENAME COLUMN "name" TO "model";--> statement-breakpoint
ALTER TABLE `vehicle` ADD `brand` text;--> statement-breakpoint
ALTER TABLE `vehicle` ADD `engine` text;--> statement-breakpoint
ALTER TABLE `vehicle` ADD `power` integer;--> statement-breakpoint
ALTER TABLE `vehicle` ADD `trim` text;--> statement-breakpoint
ALTER TABLE `vehicle` ADD `year` integer;