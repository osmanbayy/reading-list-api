import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import {
  BOOK_STATUSES,
  type BookStatus,
} from '../../../core/database/postgres/drizzle/schema/book.schema';

export class CreateBookDto {
  @ApiProperty({
    description: 'Book title.',
    example: 'Game of Thrones',
    minLength: 1,
    maxLength: 150,
  })
  @IsString()
  @Length(1, 150)
  title!: string;

  @ApiProperty({
    description: 'Book author.',
    example: 'George R. R. Martin',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  author!: string;

  @ApiPropertyOptional({
    description: 'Current reading status.',
    enum: BOOK_STATUSES,
    default: 'WANT_TO_READ',
  })
  @IsOptional()
  @IsIn(BOOK_STATUSES)
  status?: BookStatus;

  @ApiPropertyOptional({
    description: 'Personal rating between 1 and 5.',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({
    description: 'Personal notes about the book.',
    example: 'Recommended for backend developers.',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
