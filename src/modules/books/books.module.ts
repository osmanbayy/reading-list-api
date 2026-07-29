import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BOOK_REPOSITORY } from './repositories/book-repository.interface';
import { DrizzleBookRepository } from './repositories/drizzle-book.repository';

@Module({
  controllers: [BooksController],
  providers: [
    BooksService,
    {
      provide: BOOK_REPOSITORY,
      useClass: DrizzleBookRepository,
    },
  ],
  exports: [BooksService],
})
export class BooksModule {}
