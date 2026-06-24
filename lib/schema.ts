import {
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
  previewPhotoUrl: text("preview_photo_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const menagerieEntries = pgTable("menagerie_entries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  date: date("date").notNull(),
  opener: text("opener"),
  locationLat: real("location_lat"),
  locationLon: real("location_lon"),
  previewPhotoUrl: text("preview_photo_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const menagerieBlocks = pgTable("menagerie_blocks", {
  id: serial("id").primaryKey(),
  entryId: integer("entry_id").references(() => menagerieEntries.id, {
    onDelete: "cascade",
  }),
  position: integer("position").notNull(),
  // 'photo' | 'text'
  type: text("type").notNull(),
  // photo: { url: string, caption: string, width: number, height: number }
  // text:  { html: string }
  content: jsonb("content").notNull(),
});

export const writingEntries = pgTable("writing_entries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  date: date("date").notNull(),
  heroUrl: text("hero_url"),
  content: text("content").notNull(),
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
  // photo: { url: string, caption: string, width: number, height: number }
  // text:  { html: string }
  content: jsonb("content").notNull(),
});

export type JournalEntryRow = typeof photojournalEntries.$inferSelect;
export type NewJournalEntryRow = typeof photojournalEntries.$inferInsert;
export type JournalBlockRow = typeof photojournalBlocks.$inferSelect;
export type NewJournalBlockRow = typeof photojournalBlocks.$inferInsert;

export type MenagerieEntryRow = typeof menagerieEntries.$inferSelect;
export type NewMenagerieEntryRow = typeof menagerieEntries.$inferInsert;
export type MenagerieBlockRow = typeof menagerieBlocks.$inferSelect;
export type NewMenagerieBlockRow = typeof menagerieBlocks.$inferInsert;

export type WritingEntryRow = typeof writingEntries.$inferSelect;
export type NewWritingEntryRow = typeof writingEntries.$inferInsert;
