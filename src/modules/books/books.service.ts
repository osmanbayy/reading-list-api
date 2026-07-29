import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  BOOK_REPOSITORY,
  type IBookRepository,
} from './repositories/book-repository.interface';
import { CreateBookDto } from './dto/create-book.dto';
import { BookEntity } from './domain/entities/book.entity';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @Inject(BOOK_REPOSITORY)
    private readonly bookRepository: IBookRepository,
  ) {}

  async create(data: CreateBookDto): Promise<BookEntity> {
    return this.bookRepository.create(data);
  }

  async findAll(): Promise<BookEntity[]> {
    return this.bookRepository.findAll();
  }

  async findById(id: number): Promise<BookEntity> {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new NotFoundException(`Book with id ${id} was not found.`);

    return book;
  }

  async update(id: number, data: UpdateBookDto): Promise<BookEntity> {
    const updatedBook = await this.bookRepository.update(id, data);
    if (!updatedBook)
      throw new NotFoundException(`Book with id ${id} was not found.`);

    return updatedBook;
  }

  async softDelete(id: number): Promise<BookEntity> {
    const deletedBook = await this.bookRepository.softDelete(id);
    if (!deletedBook)
      throw new NotFoundException(`Book with id ${id} was not found.`);

    return deletedBook;
  }

  async restore(id: number): Promise<BookEntity> {
    const restoredBook = await this.bookRepository.restore(id);
    if (!restoredBook)
      throw new NotFoundException(`Book with id ${id} was not found.`);

    return restoredBook;
  }

  async cleanupDeletedBefore(date: Date): Promise<number> {
    return this.bookRepository.hardDeleteSoftDeleteBefore(date);
  }
}
