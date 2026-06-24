import {
  boolean,
  integer,
  jsonb,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  date,
} from "drizzle-orm/pg-core";

export const photojournalEntries = pgTable("photojournal_entries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  date: date("date").notNull(),
  opener: text("opener"),
  locationLat: real("location_lat"),
  locationLon: real("location_lon"),
  requireKeyForText: boolean("require_key_for_text").default(false),
  previewPhotoUrl: text("preview_photo_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const photojournalBlocks = pgTable("photojournal_blocks", {
  id: serial("id").primaryKey(),
  entryId: integer("entry_id").references(() => photojournalEntries.id, {
    onDelete: "cascade",
  }),
  position: integer("position").notNull(),
  // 'photo' | 'text'
  type: text("type").notNull(),
  // photo: { url: string, alt: string, width: number, height: number }
  // text:  { html: string }
  content: jsonb("content").notNull(),
});

export type JournalEntryRow = typeof photojournalEntries.$inferSelect;
export type NewJournalEntryRow = typeof photojournalEntries.$inferInsert;
export type JournalBlockRow = typeof photojournalBlocks.$inferSelect;
export type NewJournalBlockRow = typeof photojournalBlocks.$inferInsert;
