ALTER TABLE `documents` ADD `name` text NOT NULL DEFAULT 'Unnamed Document';--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_documents_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_documents_types`(`id`, `name`, `slug`) SELECT `id`, `name`, `slug` FROM `documents_types`;--> statement-breakpoint
DROP TABLE `documents_types`;--> statement-breakpoint
ALTER TABLE `__new_documents_types` RENAME TO `documents_types`;--> statement-breakpoint
PRAGMA foreign_keys=ON;