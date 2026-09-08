import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const books = pgTable(
  'books',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [uniqueIndex('books_slug_unique').on(table.slug)],
);

export const insertBookSchema = createInsertSchema(books, {
  title: (schema) => schema.trim().min(1).max(255),
  slug: () =>
    z
      .string()
      .trim()
      .min(1)
      .max(255)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: (schema) => schema.trim().max(10_000),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectBookSchema = createSelectSchema(books);

export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
