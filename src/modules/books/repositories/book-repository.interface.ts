import {
  BookEntity,
  CreateBookData,
  UpdateBookData,
} from '../domain/entities/book.entity';

export const BOOK_REPOSITORY = Symbol('BOOK_REPOSITORY');

export interface IBookRepository {
  create(data: CreateBookData): Promise<BookEntity>;

  findAll(): Promise<BookEntity[]>;

  findById(id: number): Promise<BookEntity | null>;

  update(id: number, data: UpdateBookData): Promise<BookEntity | null>;

  softDelete(id: number): Promise<BookEntity | null>;

  restore(id: number): Promise<BookEntity | null>;

  hardDeleteSoftDeleteBefore(date: Date): Promise<number>;
}
