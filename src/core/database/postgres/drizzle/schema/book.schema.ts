import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const BOOK_STATUSES = ['WANT_TO_READ', 'READING', 'FINISHED'] as const;

export type BookStatus = (typeof BOOK_STATUSES)[number];

export const bookStatusEnum = pgEnum('book_status', BOOK_STATUSES);

export const books = pgTable('books', {
  id: serial('id').primaryKey(),

  title: varchar('title', { length: 150 }).notNull(),

  author: varchar('author', { length: 100 }).notNull(),

  status: bookStatusEnum('status').default('WANT_TO_READ').notNull(),

  rating: integer('rating'),

  notes: text('notes'),

  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  deletedAt: timestamp('deleted_at', {
    withTimezone: true,
  }),
});
