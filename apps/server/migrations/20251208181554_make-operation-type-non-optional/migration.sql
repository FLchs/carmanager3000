PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_operations` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`date` integer,
	`mileage` integer,
	`note` text,
	`type` text NOT NULL,
	`vehicle_id` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	CONSTRAINT `fk_operations_vehicle_id_vehicle_id_fk` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_operations`(`id`, `date`, `mileage`, `note`, `type`, `vehicle_id`, `created_at`, `updated_at`) SELECT `id`, `date`, `mileage`, `note`, `type`, `vehicle_id`, `created_at`, `updated_at` FROM `operations`;--> statement-breakpoint
DROP TABLE `operations`;--> statement-breakpoint
ALTER TABLE `__new_operations` RENAME TO `operations`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_vehicle` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`brand` text NOT NULL,
	`description` text,
	`engine` text,
	`model` text NOT NULL,
	`power` integer,
	`trim` text,
	`year` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_vehicle`(`id`, `brand`, `description`, `engine`, `model`, `power`, `trim`, `year`, `created_at`, `updated_at`) SELECT `id`, `brand`, `description`, `engine`, `model`, `power`, `trim`, `year`, `created_at`, `updated_at` FROM `vehicle`;--> statement-breakpoint
DROP TABLE `vehicle`;--> statement-breakpoint
ALTER TABLE `__new_vehicle` RENAME TO `vehicle`;--> statement-breakpoint
PRAGMA foreign_keys=ON;