CREATE TABLE `documents_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text,
	`slug` text
);
--> statement-breakpoint
ALTER TABLE `documents` ADD `type_id` integer REFERENCES documents_types(id);--> statement-breakpoint
ALTER TABLE `documents` DROP COLUMN `type`;