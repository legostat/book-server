import { Injectable } from '@nestjs/common';
import { and, desc, eq, ne } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { Book, books, NewBook } from './schemas/book.schema';

@Injectable()
export class BookRepository {
  constructor(private readonly database: DatabaseService) {}

  async findAll(): Promise<Book[]> {
    return this.database.client
      .select()
      .from(books)
      .orderBy(desc(books.createdAt));
  }

  async findById(id: string): Promise<Book | null> {
    const [book] = await this.database.client
      .select()
      .from(books)
      .where(eq(books.id, id))
      .limit(1);

    return book ?? null;
  }

  async findBySlug(slug: string, excludedId?: string): Promise<Book | null> {
    const condition = excludedId
      ? and(eq(books.slug, slug), ne(books.id, excludedId))
      : eq(books.slug, slug);
    const [book] = await this.database.client
      .select()
      .from(books)
      .where(condition)
      .limit(1);

    return book ?? null;
  }

  async create(data: NewBook): Promise<Book> {
    const [book] = await this.database.client
      .insert(books)
      .values(data)
      .returning();

    return book;
  }

  async update(id: string, data: Partial<NewBook>): Promise<Book | null> {
    const [book] = await this.database.client
      .update(books)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(books.id, id))
      .returning();

    return book ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.database.client
      .delete(books)
      .where(eq(books.id, id))
      .returning({ id: books.id });

    return deleted.length > 0;
  }
}
