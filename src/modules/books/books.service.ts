import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  BOOK_REPOSITORY,
  type IBookRepository,
} from './repositories/book-repository.interface';
import { CreateBookDto } from './dto/create-book.dto';
import { BookEntity } from './domain/entities/book.entity';
import { UpdateBookDto } from './dto/update-book.dto';
import { RedisService } from 'src/core/redis/redis.service';
import { BookCacheMapper } from './mappers/book-cache.mapper';

const BOOK_CACHE_TTL_SECONDS = 60;

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(
    @Inject(BOOK_REPOSITORY)
    private readonly bookRepository: IBookRepository,
    private readonly redisService: RedisService,
  ) { }

  async create(data: CreateBookDto): Promise<BookEntity> {
    return this.bookRepository.create(data);
  }

  async findAll(): Promise<BookEntity[]> {
    return this.bookRepository.findAll();
  }

  async findById(id: number): Promise<BookEntity> {
    const cachedBook = await this.getCachedBook(id);

    if (cachedBook) {
      return cachedBook;
    }
    const book = await this.bookRepository.findById(id);
    if (!book) throw new NotFoundException(`Book with id ${id} was not found.`);

    await this.cacheBook(book);

    return book;
  }

  async update(id: number, data: UpdateBookDto): Promise<BookEntity> {
    const updatedBook = await this.bookRepository.update(id, data);
    if (!updatedBook)
      throw new NotFoundException(`Book with id ${id} was not found.`);

    await this.invalidateBookCache(id);

    return updatedBook;
  }

  async softDelete(id: number): Promise<BookEntity> {
    const deletedBook = await this.bookRepository.softDelete(id);
    if (!deletedBook)
      throw new NotFoundException(`Book with id ${id} was not found.`);

    await this.invalidateBookCache(id);

    return deletedBook;
  }

  async restore(id: number): Promise<BookEntity> {
    const restoredBook = await this.bookRepository.restore(id);
    if (!restoredBook)
      throw new NotFoundException(`Book with id ${id} was not found.`);

    await this.invalidateBookCache(id);

    return restoredBook;
  }

  async cleanupDeletedBefore(date: Date): Promise<number> {
    return this.bookRepository.hardDeleteSoftDeleteBefore(date);
  }

  private async getCachedBook(id: number): Promise<BookEntity | null> {
    const cacheKey = `books:${id}`;

    try {
      const cachedValue = await this.redisService.get(cacheKey);
      if (!cachedValue) {
        this.logger.log(`Cache MISS: ${cacheKey}`);
        return null;
      }

      const book = BookCacheMapper.deserialize(cachedValue);
      if (!book) {
        await this.redisService.delete(cacheKey);

        this.logger.warn(`Invalid cache deleted: ${cacheKey}`);

        return null;
      }

      this.logger.log(`Cache HIT: ${cacheKey}`);

      return book;
    } catch {
      this.logger.warn(`Cache read failed: ${cacheKey}`);

      return null;
    }
  }

  private async cacheBook(book: BookEntity): Promise<void> {
    const cacheKey = `books:${book.id}`;
    const value = BookCacheMapper.serialize(book);

    try {
      await this.redisService.set(cacheKey, value, BOOK_CACHE_TTL_SECONDS);
    } catch {
      this.logger.warn(`Cache write failed: ${cacheKey}`);
    }
  }

  private async invalidateBookCache(id: number): Promise<void> {
    const cacheKey = `books:${id}`;

    try {
      await this.redisService.delete(cacheKey);

      this.logger.log(`Cache invalidated: ${cacheKey}`);
    } catch {
      this.logger.warn(`Cache invalidation failed: ${cacheKey}`);
    }
  }
}
