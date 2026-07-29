import { books } from 'src/core/database/postgres/drizzle/schema/book.schema';

export type BookEntity = typeof books.$inferSelect;

export type CreateBookData = Pick<
  typeof books.$inferInsert,
  'title' | 'author' | 'status' | 'rating' | 'notes'
>;

export type UpdateBookData = Partial<CreateBookData>;
