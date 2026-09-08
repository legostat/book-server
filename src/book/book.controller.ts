import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { BookService } from './book.service';
import { BookResponseDto } from './dto/book-response.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async create(@Body() dto: CreateBookDto): Promise<BookResponseDto> {
    const book = await this.bookService.create(dto);
    return BookResponseDto.fromEntity(book);
  }

  @Get()
  async findAll(): Promise<BookResponseDto[]> {
    const books = await this.bookService.findAll();
    return books.map((book) => BookResponseDto.fromEntity(book));
  }

  @Get(':id')
  async findById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<BookResponseDto> {
    const book = await this.bookService.findById(id);
    return BookResponseDto.fromEntity(book);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateBookDto,
  ): Promise<BookResponseDto> {
    const book = await this.bookService.update(id, dto);
    return BookResponseDto.fromEntity(book);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.bookService.remove(id);
  }
}
