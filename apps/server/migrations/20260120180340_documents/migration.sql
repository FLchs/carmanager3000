CREATE TABLE `documents` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`date` integer,
	`mileage` integer,
	`uri` text,
	`note` text,
	`type` text NOT NULL,
	`documentable_id` integer NOT NULL,
	`entityType` text,
	`deleted` integer DEFAULT false,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
