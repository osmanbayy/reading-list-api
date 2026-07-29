import { Injectable, Logger } from '@nestjs/common';
import { BooksService } from './books.service';
import { Cron } from '@nestjs/schedule';

const SOFT_DELETE_RETENTION_MS = 30 * 24 * 60 * 60 * 1_000;

@Injectable()
export class BooksCleanupScheduler {
  private readonly logger = new Logger(BooksCleanupScheduler.name);

  constructor(private readonly booksService: BooksService) {}

  @Cron('0 0 3 * * *', {
    name: 'books-cleanup',
    timeZone: 'Europe/Istanbul',
    waitForCompletion: true,
  })
  async handleCleanup(): Promise<void> {
    const cutoffDate = new Date(Date.now() - SOFT_DELETE_RETENTION_MS);

    try {
      const deletedCount =
        await this.booksService.cleanupDeletedBefore(cutoffDate);

      this.logger.log(
        `Cleanup completed: ${deletedCount} books permanently deleted`,
      );
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Cleanup failed: ${error.message}`, error.stack);

        return;
      }

      this.logger.error('Cleanup failed');
    }
  }
}
