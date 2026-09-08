import type { Book } from '../schemas/book.schema';

export class BookResponseDto {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly description: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;

  private constructor(book: Book) {
    this.id = book.id;
    this.title = book.title;
    this.slug = book.slug;
    this.description = book.description;
    this.createdAt = book.createdAt.toISOString();
    this.updatedAt = book.updatedAt.toISOString();
  }

  static fromEntity(book: Book): BookResponseDto {
    return new BookResponseDto(book);
  }
}
