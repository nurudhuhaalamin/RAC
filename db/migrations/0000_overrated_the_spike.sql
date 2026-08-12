CREATE TABLE `article_revisions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`article_id` integer NOT NULL,
	`body_json` text,
	`changed_by` integer,
	`change_note` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`changed_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `article_revisions_article_id_idx` ON `article_revisions` (`article_id`);--> statement-breakpoint
CREATE TABLE `articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`locale` text NOT NULL,
	`translation_group_id` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text,
	`body_json` text,
	`body_html` text,
	`author_id` integer,
	`reviewer_id` integer,
	`category_id` integer,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` integer,
	`reading_time` integer,
	`word_count` integer,
	`focus_keyword` text,
	`secondary_keywords` text,
	`meta_title` text,
	`meta_description` text,
	`og_image_id` integer,
	`faq_json` text,
	`tldr` text,
	`canonical_override` text,
	`noindex` integer DEFAULT false NOT NULL,
	`last_verified_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`og_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `articles_slug_locale_idx` ON `articles` (`slug`,`locale`);--> statement-breakpoint
CREATE INDEX `articles_published_at_idx` ON `articles` (`published_at`);--> statement-breakpoint
CREATE INDEX `articles_status_idx` ON `articles` (`status`);--> statement-breakpoint
CREATE INDEX `articles_translation_group_idx` ON `articles` (`translation_group_id`);--> statement-breakpoint
CREATE INDEX `articles_focus_keyword_idx` ON `articles` (`focus_keyword`);--> statement-breakpoint
CREATE TABLE `audit_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`action` text NOT NULL,
	`entity_type` text,
	`entity_id` integer,
	`diff_json` text,
	`ip_hash` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `audit_log_user_id_idx` ON `audit_log` (`user_id`);--> statement-breakpoint
CREATE INDEX `audit_log_created_at_idx` ON `audit_log` (`created_at`);--> statement-breakpoint
CREATE INDEX `audit_log_entity_idx` ON `audit_log` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE TABLE `batches` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`course_id` integer NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`city` text NOT NULL,
	`venue_name` text,
	`venue_address` text,
	`capacity` integer NOT NULL,
	`seats_taken` integer DEFAULT 0 NOT NULL,
	`price_override` integer,
	`status` text DEFAULT 'scheduled' NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `batches_start_date_idx` ON `batches` (`start_date`);--> statement-breakpoint
CREATE INDEX `batches_course_id_idx` ON `batches` (`course_id`);--> statement-breakpoint
CREATE INDEX `batches_status_idx` ON `batches` (`status`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`locale` text NOT NULL,
	`translation_group_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_locale_idx` ON `categories` (`slug`,`locale`);--> statement-breakpoint
CREATE TABLE `course_instructors` (
	`course_id` integer NOT NULL,
	`instructor_id` integer NOT NULL,
	PRIMARY KEY(`course_id`, `instructor_id`),
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`instructor_id`) REFERENCES `instructors`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`locale` text NOT NULL,
	`translation_group_id` text NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`scheme` text NOT NULL,
	`certifying_body` text NOT NULL,
	`level` text,
	`duration_days` integer,
	`prerequisites` text,
	`syllabus_json` text,
	`price` integer,
	`price_note` text,
	`capacity_default` integer,
	`hero_image_id` integer,
	`status` text DEFAULT 'draft' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`meta_title` text,
	`meta_description` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`hero_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `courses_slug_locale_idx` ON `courses` (`slug`,`locale`);--> statement-breakpoint
CREATE INDEX `courses_translation_group_idx` ON `courses` (`translation_group_id`);--> statement-breakpoint
CREATE INDEX `courses_status_idx` ON `courses` (`status`);--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question_id` text NOT NULL,
	`question_en` text,
	`answer_id` text NOT NULL,
	`answer_en` text,
	`category` text,
	`page_scope` text,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `faqs_page_scope_idx` ON `faqs` (`page_scope`);--> statement-breakpoint
CREATE TABLE `instructors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`photo_id` integer,
	`bio_id` text,
	`bio_en` text,
	`certifications_json` text,
	`years_experience` integer,
	`linkedin` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`photo_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `instructors_slug_idx` ON `instructors` (`slug`);--> statement-breakpoint
CREATE TABLE `lead_activities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`lead_id` integer NOT NULL,
	`user_id` integer,
	`type` text NOT NULL,
	`content` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `lead_activities_lead_id_idx` ON `lead_activities` (`lead_id`);--> statement-breakpoint
CREATE TABLE `leads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ref_code` text NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text,
	`company` text,
	`position` text,
	`interest_type` text NOT NULL,
	`scheme` text,
	`batch_id` integer,
	`city` text,
	`message` text,
	`source_page` text,
	`utm_source` text,
	`utm_medium` text,
	`utm_campaign` text,
	`utm_content` text,
	`referrer` text,
	`status` text DEFAULT 'new' NOT NULL,
	`assigned_to` integer,
	`locale` text DEFAULT 'id' NOT NULL,
	`ip_hash` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`batch_id`) REFERENCES `batches`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `leads_ref_code_idx` ON `leads` (`ref_code`);--> statement-breakpoint
CREATE INDEX `leads_created_at_idx` ON `leads` (`created_at`);--> statement-breakpoint
CREATE INDEX `leads_status_idx` ON `leads` (`status`);--> statement-breakpoint
CREATE INDEX `leads_interest_type_idx` ON `leads` (`interest_type`);--> statement-breakpoint
CREATE INDEX `leads_assigned_to_idx` ON `leads` (`assigned_to`);--> statement-breakpoint
CREATE TABLE `media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`r2_key` text NOT NULL,
	`filename` text NOT NULL,
	`mime` text NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`size_bytes` integer NOT NULL,
	`alt_id` text,
	`alt_en` text,
	`caption_id` text,
	`caption_en` text,
	`credit` text,
	`taken_at` integer,
	`uploaded_by` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_r2_key_idx` ON `media` (`r2_key`);--> statement-breakpoint
CREATE TABLE `redirects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`from_path` text NOT NULL,
	`to_path` text,
	`status_code` integer DEFAULT 301 NOT NULL,
	`hits` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `redirects_from_path_idx` ON `redirects` (`from_path`);--> statement-breakpoint
CREATE TABLE `registrations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`lead_id` integer NOT NULL,
	`batch_id` integer NOT NULL,
	`status` text DEFAULT 'inquiry' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`batch_id`) REFERENCES `batches`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `registrations_batch_id_idx` ON `registrations` (`batch_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `registrations_lead_batch_idx` ON `registrations` (`lead_id`,`batch_id`);--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value_json` text,
	`updated_by` integer,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`author_name` text NOT NULL,
	`author_role` text,
	`company` text,
	`content_id` text,
	`content_en` text,
	`photo_id` integer,
	`rating` real,
	`course_id` integer,
	`verified` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`photo_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);