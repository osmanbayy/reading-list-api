import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import type { BookEntity } from './domain/entities/book.entity';
import { BookResponseDto } from './dto/book-response.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({
    summary: 'Add a book to the reading list',
  })
  @ApiCreatedResponse({
    type: BookResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Request body is invalid.',
  })
  create(@Body() createBookDto: CreateBookDto): Promise<BookEntity> {
    return this.booksService.create(createBookDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List active books',
  })
  @ApiOkResponse({
    type: BookResponseDto,
    isArray: true,
  })
  findAll(): Promise<BookEntity[]> {
    return this.booksService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a book by id',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    type: Number,
  })
  @ApiOkResponse({
    type: BookResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Id must be an integer.',
  })
  @ApiNotFoundResponse({
    description: 'Book was not found.',
  })
  findById(@Param('id', ParseIntPipe) id: number): Promise<BookEntity> {
    return this.booksService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a book',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    type: Number,
  })
  @ApiOkResponse({
    type: BookResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Id or request body is invalid.',
  })
  @ApiNotFoundResponse({
    description: 'Book was not found.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<BookEntity> {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Soft delete a book',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    type: Number,
  })
  @ApiOkResponse({
    type: BookResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Id must be an integer.',
  })
  @ApiNotFoundResponse({
    description: 'Book was not found.',
  })
  softDelete(@Param('id', ParseIntPipe) id: number): Promise<BookEntity> {
    return this.booksService.softDelete(id);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Restore a soft-deleted book',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    type: Number,
  })
  @ApiOkResponse({
    type: BookResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Id must be an integer.',
  })
  @ApiNotFoundResponse({
    description: 'Deleted book was not found.',
  })
  restore(@Param('id', ParseIntPipe) id: number): Promise<BookEntity> {
    return this.booksService.restore(id);
  }
}
