CREATE TABLE `admin_invites` (
	`invite_id` int AUTO_INCREMENT NOT NULL,
	`invite_email` varchar(100) NOT NULL,
	`invite_token` varchar(255) NOT NULL,
	`invite_expires_at` timestamp NOT NULL,
	`invite_is_used` boolean NOT NULL DEFAULT false,
	`invited_by` int NOT NULL,
	`invite_used_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_invites_invite_id` PRIMARY KEY(`invite_id`),
	CONSTRAINT `admin_invites_invite_token_unique` UNIQUE(`invite_token`)
);
--> statement-breakpoint
CREATE TABLE `bid_vendor_docs` (
	`bvd_id` int AUTO_INCREMENT NOT NULL,
	`bid_id` int NOT NULL,
	`vdr_id` int NOT NULL,
	`bvd_doc_key` varchar(255) NOT NULL,
	`bvd_doc_name` varchar(100),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bid_vendor_docs_bvd_id` PRIMARY KEY(`bvd_id`)
);
--> statement-breakpoint
CREATE TABLE `bids` (
	`bid_id` int AUTO_INCREMENT NOT NULL,
	`vendor_id` int NOT NULL,
	`tender_id` int NOT NULL,
	`technical_doc_key` varchar(255),
	`financial_doc_key` varchar(255),
	`bid_optional_info` text,
	`bid_rejection_msg` text,
	`bid_status` enum('selected','ranked','under_review','rejected','approved') NOT NULL DEFAULT 'under_review',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bids_bid_id` PRIMARY KEY(`bid_id`)
);
--> statement-breakpoint
CREATE TABLE `businesses` (
	`business_id` int AUTO_INCREMENT NOT NULL,
	`biz_legal_name` varchar(100),
	`biz_trade_name` varchar(100),
	`biz_classification` varchar(50),
	`biz_reg_number` varchar(50),
	`biz_reg_doc_key` varchar(200),
	`biz_established_year` varchar(4),
	`biz_addr_line1` varchar(100),
	`biz_addr_line2` varchar(100),
	`biz_locality` varchar(50),
	`biz_city` varchar(50),
	`biz_pin_code` varchar(6),
	`biz_country` varchar(50),
	`biz_state` varchar(50),
	`biz_gst_number` varchar(20),
	`biz_gst_doc_key` varchar(200),
	`biz_bank_doc_key` varchar(200),
	`biz_msme_cert_doc_key` varchar(200),
	`biz_website` varchar(100),
	`biz_email` varchar(100),
	`biz_phone` varchar(15),
	`biz_3_year_turnover` varchar(25),
	`biz_employee_count` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`vendor_id` int NOT NULL,
	CONSTRAINT `businesses_business_id` PRIMARY KEY(`business_id`),
	CONSTRAINT `businesses_vendor_id_unique` UNIQUE(`vendor_id`)
);
--> statement-breakpoint
CREATE TABLE `departments` (
	`department_id` int AUTO_INCREMENT NOT NULL,
	`div_code` varchar(255) NOT NULL,
	`division_name` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `departments_department_id` PRIMARY KEY(`department_id`),
	CONSTRAINT `departments_div_code_unique` UNIQUE(`div_code`),
	CONSTRAINT `departments_division_name_unique` UNIQUE(`division_name`)
);
--> statement-breakpoint
CREATE TABLE `tender_email_invites` (
	`invite_id` int AUTO_INCREMENT NOT NULL,
	`tender_id` int NOT NULL,
	`email` varchar(255) NOT NULL,
	`sent_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tender_email_invites_invite_id` PRIMARY KEY(`invite_id`)
);
--> statement-breakpoint
CREATE TABLE `tenders` (
	`tender_id` int AUTO_INCREMENT NOT NULL,
	`tender_department` varchar(100),
	`tender_number` varchar(50),
	`tender_type` varchar(50),
	`tender_scope` varchar(50),
	`tender_title` varchar(150),
	`tender_description` text,
	`tender_contract_document` varchar(255),
	`tender_doc_fee` varchar(255),
	`tender_emd` varchar(255),
	`tender_location` varchar(255),
	`tender_remark` varchar(255),
	`tender_query_deadline` datetime,
	`tender_query_response_date` datetime,
	`tender_release_date` datetime,
	`tender_bid_submission_deadline` datetime,
	`tender_technical_bid_opening` datetime,
	`tender_financial_bid_opening` datetime,
	`tender_opening_venue` text,
	`tender_project_duration` varchar(50),
	`tender_is_technical_doc` boolean NOT NULL DEFAULT false,
	`tender_is_financial_doc` boolean NOT NULL DEFAULT false,
	`tender_status` enum('draft','review','rescheduled') NOT NULL DEFAULT 'draft',
	`tender_is_active` boolean NOT NULL DEFAULT false,
	`tender_created_by_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tenders_tender_id` PRIMARY KEY(`tender_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(100) NOT NULL,
	`full_name` varchar(50),
	`password` varchar(150) NOT NULL,
	`role` enum('vendor','admin','super_admin') NOT NULL DEFAULT 'vendor',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_user_id` PRIMARY KEY(`user_id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `vendor_doc_requirements` (
	`vdr_id` int AUTO_INCREMENT NOT NULL,
	`vdr_name` varchar(100),
	`tender_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vendor_doc_requirements_vdr_id` PRIMARY KEY(`vdr_id`)
);
--> statement-breakpoint
CREATE TABLE `vendor_profiles` (
	`vendor_id` int AUTO_INCREMENT NOT NULL,
	`vendor_code` varchar(50) NOT NULL,
	`vendor_source` enum('direct','invite') DEFAULT 'direct',
	`vendor_status` enum('pending','rejected','approved') NOT NULL DEFAULT 'pending',
	`vendor_contact` varchar(15),
	`vendor_alt_contact` varchar(15),
	`vendor_pan_number` varchar(30),
	`vendor_pan_doc_key` varchar(200),
	`vendor_adhar_doc_key` varchar(200),
	`vendor_image_key` varchar(200),
	`vendor_rejection_reason` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`user_id` int NOT NULL,
	CONSTRAINT `vendor_profiles_vendor_id` PRIMARY KEY(`vendor_id`),
	CONSTRAINT `vendor_profiles_vendor_code_unique` UNIQUE(`vendor_code`),
	CONSTRAINT `vendor_profiles_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
ALTER TABLE `admin_invites` ADD CONSTRAINT `admin_invites_invited_by_users_user_id_fk` FOREIGN KEY (`invited_by`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bid_vendor_docs` ADD CONSTRAINT `bid_vendor_docs_bid_id_bids_bid_id_fk` FOREIGN KEY (`bid_id`) REFERENCES `bids`(`bid_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bid_vendor_docs` ADD CONSTRAINT `bid_vendor_docs_vdr_id_vendor_doc_requirements_vdr_id_fk` FOREIGN KEY (`vdr_id`) REFERENCES `vendor_doc_requirements`(`vdr_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bids` ADD CONSTRAINT `bids_vendor_id_vendor_profiles_vendor_id_fk` FOREIGN KEY (`vendor_id`) REFERENCES `vendor_profiles`(`vendor_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bids` ADD CONSTRAINT `bids_tender_id_tenders_tender_id_fk` FOREIGN KEY (`tender_id`) REFERENCES `tenders`(`tender_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `businesses` ADD CONSTRAINT `businesses_vendor_id_vendor_profiles_vendor_id_fk` FOREIGN KEY (`vendor_id`) REFERENCES `vendor_profiles`(`vendor_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tender_email_invites` ADD CONSTRAINT `tender_email_invites_tender_id_tenders_tender_id_fk` FOREIGN KEY (`tender_id`) REFERENCES `tenders`(`tender_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tenders` ADD CONSTRAINT `tenders_tender_created_by_id_users_user_id_fk` FOREIGN KEY (`tender_created_by_id`) REFERENCES `users`(`user_id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vendor_doc_requirements` ADD CONSTRAINT `vendor_doc_requirements_tender_id_tenders_tender_id_fk` FOREIGN KEY (`tender_id`) REFERENCES `tenders`(`tender_id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vendor_profiles` ADD CONSTRAINT `vendor_profiles_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE cascade ON UPDATE no action;