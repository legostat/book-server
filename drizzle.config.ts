import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { envSchema } from './src/config/env.schema';

const env = envSchema.parse(process.env);

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/**/schemas/*.schema.ts',
  out: './drizzle',
  dbCredentials: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    ssl: env.DB_SSL,
  },
  strict: true,
  verbose: true,
});
