CREATE TABLE "photojournal_blocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"entry_id" integer,
	"position" integer NOT NULL,
	"type" text NOT NULL,
	"content" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "photojournal_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"date" date NOT NULL,
	"opener" text,
	"location_lat" real,
	"location_lon" real,
	"preview_photo_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "photojournal_entries_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "photojournal_blocks" ADD CONSTRAINT "photojournal_blocks_entry_id_photojournal_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."photojournal_entries"("id") ON DELETE cascade ON UPDATE no action;