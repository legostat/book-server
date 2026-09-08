import { Test } from '@nestjs/testing';
import { BookRepository } from './book.repository';
import { BookService } from './book.service';
import { BookNotFoundException } from './exceptions/book-not-found.exception';
import { BookSlugConflictException } from './exceptions/book-slug-conflict.exception';
import type { Book } from './schemas/book.schema';

const BOOK_ID = 'e058a5e0-16c7-4f9e-9a97-27068f1a594b';

const book: Book = {
  id: BOOK_ID,
  title: 'The Left Hand of Darkness',
  slug: 'the-left-hand-of-darkness',
  description: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

describe('BookService', () => {
  let service: BookService;
  let repository: BookRepository;

  beforeEach(async () => {
    const repositoryMock: Pick<
      BookRepository,
      'findAll' | 'findById' | 'findBySlug' | 'create' | 'update' | 'delete'
    > = {
      findAll: () => Promise.resolve([]),
      findById: () => Promise.resolve(null),
      findBySlug: () => Promise.resolve(null),
      create: () => Promise.resolve(book),
      update: () => Promise.resolve(null),
      delete: () => Promise.resolve(false),
    };
    const module = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: BookRepository, useValue: repositoryMock },
      ],
    }).compile();

    service = module.get(BookService);
    repository = module.get<BookRepository>(BookRepository);
  });

  it('returns all books', async () => {
    repository.findAll = () => Promise.resolve([book]);

    await expect(service.findAll()).resolves.toEqual([book]);
  });

  it('throws a domain exception when a book does not exist', async () => {
    repository.findById = () => Promise.resolve(null);

    await expect(service.findById(BOOK_ID)).rejects.toThrow(
      BookNotFoundException,
    );
  });

  it('creates a book when its slug is available', async () => {
    repository.findBySlug = () => Promise.resolve(null);
    repository.create = () => Promise.resolve(book);

    await expect(
      service.create({ title: book.title, slug: book.slug }),
    ).resolves.toEqual(book);
  });

  it('rejects a duplicate slug', async () => {
    let createCalls = 0;
    repository.findBySlug = () => Promise.resolve(book);
    repository.create = () => {
      createCalls += 1;
      return Promise.resolve(book);
    };

    await expect(
      service.create({ title: book.title, slug: book.slug }),
    ).rejects.toThrow(BookSlugConflictException);
    expect(createCalls).toBe(0);
  });

  it('updates an existing book', async () => {
    const updated = { ...book, title: 'A new title' };
    repository.findById = () => Promise.resolve(book);
    repository.update = () => Promise.resolve(updated);

    await expect(
      service.update(BOOK_ID, { title: updated.title }),
    ).resolves.toEqual(updated);
  });

  it('deletes an existing book', async () => {
    repository.delete = () => Promise.resolve(true);

    await expect(service.remove(BOOK_ID)).resolves.toBeUndefined();
  });

  it('throws when deleting a missing book', async () => {
    repository.delete = () => Promise.resolve(false);

    await expect(service.remove(BOOK_ID)).rejects.toThrow(
      BookNotFoundException,
    );
  });
});
