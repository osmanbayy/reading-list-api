CREATE TYPE "public"."book_status" AS ENUM('WANT_TO_READ', 'READING', 'FINISHED');--> statement-breakpoint
CREATE TABLE "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(150) NOT NULL,
	"author" varchar(100) NOT NULL,
	"status" "book_status" DEFAULT 'WANT_TO_READ' NOT NULL,
	"rating" integer,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
