import { validateEnv } from './env.schema';

describe('environment configuration', () => {
  it('applies local development defaults', () => {
    const env = validateEnv({});

    expect(env).toMatchObject({
      DB_HOST: 'localhost',
      DB_PORT: 5432,
      DB_SSL: false,
      PORT: 3000,
    });
  });

  it('rejects invalid ports', () => {
    expect(() => validateEnv({ DB_PORT: 'not-a-port' })).toThrow();
  });
});
