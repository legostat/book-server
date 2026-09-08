import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { BookController } from '../src/book/book.controller';
import { BookService } from '../src/book/book.service';
import type { Book } from '../src/book/schemas/book.schema';
import { CommonModule } from '../src/common/common.module';

const BOOK_ID = 'e058a5e0-16c7-4f9e-9a97-27068f1a594b';
const book: Book = {
  id: BOOK_ID,
  title: 'The Left Hand of Darkness',
  slug: 'the-left-hand-of-darkness',
  description: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};
const bookResponse = {
  ...book,
  createdAt: book.createdAt.toISOString(),
  updatedAt: book.updatedAt.toISOString(),
};

describe('BookController (e2e)', () => {
  let app: INestApplication<App>;
  let service: BookService;
  let createCalls: number;
  let findByIdCalls: number;

  beforeEach(async () => {
    createCalls = 0;
    findByIdCalls = 0;
    const serviceMock: Pick<
      BookService,
      'create' | 'findAll' | 'findById' | 'update' | 'remove'
    > = {
      create: () => {
        createCalls += 1;
        return Promise.resolve(book);
      },
      findAll: () => Promise.resolve([]),
      findById: () => {
        findByIdCalls += 1;
        return Promise.resolve(book);
      },
      update: () => Promise.resolve(book),
      remove: () => Promise.resolve(),
    };
    const module = await Test.createTestingModule({
      imports: [CommonModule],
      controllers: [BookController],
      providers: [{ provide: BookService, useValue: serviceMock }],
    }).compile();

    app = module.createNestApplication();
    service = module.get<BookService>(BookService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /books creates a book', async () => {
    service.create = () => Promise.resolve(book);

    await request(app.getHttpServer())
      .post('/books')
      .send({ title: book.title, slug: book.slug })
      .expect(201)
      .expect(bookResponse);
  });

  it('GET /books returns all books', async () => {
    service.findAll = () => Promise.resolve([book]);

    await request(app.getHttpServer())
      .get('/books')
      .expect(200)
      .expect([bookResponse]);
  });

  it('GET /books/:id returns one book', async () => {
    service.findById = () => Promise.resolve(book);

    await request(app.getHttpServer())
      .get(`/books/${BOOK_ID}`)
      .expect(200)
      .expect(bookResponse);
  });

  it('PATCH /books/:id updates a book', async () => {
    const updated = { ...book, title: 'A new title' };
    service.update = () => Promise.resolve(updated);

    await request(app.getHttpServer())
      .patch(`/books/${BOOK_ID}`)
      .send({ title: updated.title })
      .expect(200)
      .expect({ ...bookResponse, title: updated.title });
  });

  it('DELETE /books/:id deletes a book', async () => {
    service.remove = () => Promise.resolve();

    await request(app.getHttpServer()).delete(`/books/${BOOK_ID}`).expect(204);
  });

  it('rejects invalid and unknown create fields', async () => {
    const response = await request(app.getHttpServer())
      .post('/books')
      .send({ title: '', slug: 'Invalid Slug', unexpected: true })
      .expect(400);

    expect(response.body).toMatchObject({
      type: 'BadRequestException',
      status: 400,
      path: '/books',
    });
    expect(createCalls).toBe(0);
  });

  it('rejects a non-UUID book identifier', async () => {
    await request(app.getHttpServer()).get('/books/not-a-uuid').expect(400);

    expect(findByIdCalls).toBe(0);
  });
});
