import { Injectable } from '@nestjs/common';
import { PostgresService } from 'src/core/database/postgres/postgres.service';
import { RedisService } from 'src/core/redis/redis.service';

@Injectable()
export class HealthCheckService {
  constructor(
    private readonly postgresService: PostgresService,
    private readonly redisService: RedisService,
  ) {}

  async check(): Promise<void> {
    await Promise.all([this.postgresService.ping(), this.redisService.ping()]);
  }
}
