import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sql } from 'drizzle-orm';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import type { Env } from '../config/env.schema';
import * as schema from './schema';

export type Database = NodePgDatabase<typeof schema>;

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  private readonly pool: Pool;
  readonly client: Database;

  constructor(config: ConfigService<Env, true>) {
    this.pool = new Pool({
      host: config.get('DB_HOST', { infer: true }),
      port: config.get('DB_PORT', { infer: true }),
      user: config.get('DB_USER', { infer: true }),
      password: config.get('DB_PASSWORD', { infer: true }),
      database: config.get('DB_NAME', { infer: true }),
      ssl: config.get('DB_SSL', { infer: true })
        ? { rejectUnauthorized: false }
        : false,
    });

    this.client = drizzle(this.pool, { schema });
  }

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }

  async ping(): Promise<void> {
    await this.client.execute(sql`select 1`);
  }
}
