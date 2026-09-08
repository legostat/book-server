import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookNotFoundException } from './exceptions/book-not-found.exception';
import { BookSlugConflictException } from './exceptions/book-slug-conflict.exception';
import { BookRepository } from './book.repository';
import type { Book } from './schemas/book.schema';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  findAll(): Promise<Book[]> {
    return this.bookRepository.findAll();
  }

  async findById(id: string): Promise<Book> {
    const book = await this.bookRepository.findById(id);

    if (book === null) {
      throw new BookNotFoundException(id);
    }

    return book;
  }

  async create(dto: CreateBookDto): Promise<Book> {
    const existingBook = await this.bookRepository.findBySlug(dto.slug);

    if (existingBook !== null) {
      throw new BookSlugConflictException(dto.slug);
    }

    return this.bookRepository.create(dto);
  }

  async update(id: string, dto: UpdateBookDto): Promise<Book> {
    const currentBook = await this.findById(id);

    if (dto.slug !== undefined && dto.slug !== currentBook.slug) {
      const existingBook = await this.bookRepository.findBySlug(dto.slug, id);

      if (existingBook !== null) {
        throw new BookSlugConflictException(dto.slug);
      }
    }

    if (Object.keys(dto).length === 0) {
      return currentBook;
    }

    const updatedBook = await this.bookRepository.update(id, dto);

    if (updatedBook === null) {
      throw new BookNotFoundException(id);
    }

    return updatedBook;
  }

  async remove(id: string): Promise<void> {
    const wasDeleted = await this.bookRepository.delete(id);

    if (!wasDeleted) {
      throw new BookNotFoundException(id);
    }
  }
}
