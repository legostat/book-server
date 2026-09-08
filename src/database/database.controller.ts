import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller('health')
export class DatabaseController {
  constructor(private readonly database: DatabaseService) {}

  @Get('database')
  async checkDatabase(): Promise<{ status: 'ok' }> {
    await this.database.ping();

    return { status: 'ok' };
  }
}
