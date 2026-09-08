import { insertBookSchema } from './book.schema';

describe('insertBookSchema', () => {
  it('accepts a valid book', () => {
    expect(
      insertBookSchema.parse({
        title: 'The Left Hand of Darkness',
        slug: 'the-left-hand-of-darkness',
      }),
    ).toEqual({
      title: 'The Left Hand of Darkness',
      slug: 'the-left-hand-of-darkness',
    });
  });

  it('rejects an invalid slug', () => {
    expect(() =>
      insertBookSchema.parse({ title: 'A book', slug: 'Not a slug' }),
    ).toThrow();
  });
});
