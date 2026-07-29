import { Injectable } from '@nestjs/common';
import { and, desc, eq, isNotNull, isNull, lt } from 'drizzle-orm';
import { IBookRepository } from './book-repository.interface';
import { PostgresService } from 'src/core/database/postgres/postgres.service';
import type {
  CreateBookData,
  BookEntity,
  UpdateBookData,
} from '../domain/entities/book.entity';
import { books } from 'src/core/database/postgres/drizzle/schema/book.schema';

@Injectable()
export class DrizzleBookRepository implements IBookRepository {
  constructor(private readonly postgresService: PostgresService) {}

  async create(data: CreateBookData): Promise<BookEntity> {
    const [createdBook] = await this.postgresService.database
      .insert(books)
      .values(data)
      .returning();
    if (!createdBook) throw new Error('Book could not be created.');

    return createdBook;
  }

  async findAll(): Promise<BookEntity[]> {
    return this.postgresService.database
      .select()
      .from(books)
      .where(isNull(books.deletedAt))
      .orderBy(desc(books.createdAt));
  }

  async findById(id: number): Promise<BookEntity | null> {
    const [book] = await this.postgresService.database
      .select()
      .from(books)
      .where(and(eq(books.id, id), isNull(books.deletedAt)))
      .limit(1);

    return book ?? null;
  }

  async update(id: number, data: UpdateBookData): Promise<BookEntity | null> {
    const [updatedBook] = await this.postgresService.database
      .update(books)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(books.id, id), isNull(books.deletedAt)))
      .returning();

    return updatedBook ?? null;
  }

  async softDelete(id: number): Promise<BookEntity | null> {
    const now = new Date();

    const [deletedBook] = await this.postgresService.database
      .update(books)
      .set({
        deletedAt: now,
        updatedAt: now,
      })
      .where(and(eq(books.id, id), isNull(books.deletedAt)))
      .returning();

    return deletedBook ?? null;
  }

  async restore(id: number): Promise<BookEntity | null> {
    const [restoredBook] = await this.postgresService.database
      .update(books)
      .set({
        deletedAt: null,
        updatedAt: new Date(),
      })
      .where(and(eq(books.id, id), isNull(books.deletedAt)))
      .returning();

    return restoredBook ?? null;
  }

  async hardDeleteSoftDeleteBefore(date: Date): Promise<number> {
    const deletedBooks = await this.postgresService.database
      .delete(books)
      .where(and(isNotNull(books.deletedAt), lt(books.deletedAt, date)))
      .returning({
        id: books.id,
      });

    return deletedBooks.length;
  }
}
