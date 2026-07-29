import { ApiProperty } from '@nestjs/swagger';
import {
  BOOK_STATUSES,
  type BookStatus,
} from '../../../core/database/postgres/drizzle/schema/book.schema';
import type { BookEntity } from '../domain/entities/book.entity';

export class BookResponseDto implements BookEntity {
  @ApiProperty({
    example: 1,
  })
  id!: number;

  @ApiProperty({
    example: 'Game of Thrones',
  })
  title!: string;

  @ApiProperty({
    example: 'George R. R. Martin',
  })
  author!: string;

  @ApiProperty({
    enum: BOOK_STATUSES,
    example: 'READING',
  })
  status!: BookStatus;

  @ApiProperty({
    example: 5,
    nullable: true,
  })
  rating!: number | null;

  @ApiProperty({
    example: 'Recommended for backend developers.',
    nullable: true,
  })
  notes!: string | null;

  @ApiProperty({
    example: '2026-07-29T12:00:00.000Z',
    format: 'date-time',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-07-29T12:00:00.000Z',
    format: 'date-time',
  })
  updatedAt!: Date;

  @ApiProperty({
    example: null,
    format: 'date-time',
    nullable: true,
  })
  deletedAt!: Date | null;
}
