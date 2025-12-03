CREATE TABLE `maintenanceLog` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` integer,
	`mileage` integer,
	`note` text,
	`type` text,
	`owner_id` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `vehicle`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_vehicle` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
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
INSERT INTO `__new_vehicle`("id", "brand", "description", "engine", "model", "power", "trim", "year", "created_at", "updated_at") SELECT "id", "brand", "description", "engine", "model", "power", "trim", "year", "created_at", "updated_at" FROM `vehicle`;--> statement-breakpoint
DROP TABLE `vehicle`;--> statement-breakpoint
ALTER TABLE `__new_vehicle` RENAME TO `vehicle`;--> statement-breakpoint
PRAGMA foreign_keys=ON;