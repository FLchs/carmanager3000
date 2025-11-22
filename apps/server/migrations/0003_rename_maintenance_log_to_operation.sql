ALTER TABLE `maintenanceLog` RENAME TO `operations`;--> statement-breakpoint
ALTER TABLE `operations` RENAME COLUMN "owner_id" TO "vehicle_id";--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_operations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` integer,
	`mileage` integer,
	`note` text,
	`type` text,
	`vehicle_id` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_operations`("id", "date", "mileage", "note", "type", "vehicle_id", "created_at", "updated_at") SELECT "id", "date", "mileage", "note", "type", "vehicle_id", "created_at", "updated_at" FROM `operations`;--> statement-breakpoint
DROP TABLE `operations`;--> statement-breakpoint
ALTER TABLE `__new_operations` RENAME TO `operations`;--> statement-breakpoint
PRAGMA foreign_keys=ON;