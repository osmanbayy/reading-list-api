import type { BookEntity } from '../domain/entities/book.entity';

type CachedBook = Omit<BookEntity, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export class BookCacheMapper {
  static serialize(book: BookEntity): string {
    const cachedBook: CachedBook = {
      ...book,
      createdAt: book.createdAt.toISOString(),
      updatedAt: book.updatedAt.toISOString(),
      deletedAt: book.deletedAt?.toISOString() ?? null,
    };

    return JSON.stringify(cachedBook);
  }

  static deserialize(value: string): BookEntity | null {
    try {
      const cachedBook = JSON.parse(value) as CachedBook;

      return {
        ...cachedBook,
        createdAt: new Date(cachedBook.createdAt),
        updatedAt: new Date(cachedBook.updatedAt),
        deletedAt: cachedBook.deletedAt ? new Date(cachedBook.deletedAt) : null,
      };
    } catch {
      return null;
    }
  }
}
