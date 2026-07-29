import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import postgres from 'postgres';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './drizzle/schema/book.schema';
import { AppConfigService } from 'src/common/config/app-config.service';
import { sql } from 'drizzle-orm';

@Injectable()
export class PostgresService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PostgresService.name);
  private readonly client: ReturnType<typeof postgres>;

  readonly database: PostgresJsDatabase<typeof schema>;

  constructor(configService: AppConfigService) {
    this.client = postgres(configService.database.postgresUrl);
    this.database = drizzle(this.client, {
      schema,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.database.execute(sql`SELECT 1`);
    this.logger.log('PostgreSQL connection established');
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.end();
    this.logger.log('PostgreSQL connection closed');
  }
}
