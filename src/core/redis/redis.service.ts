import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';
import { AppConfigService } from 'src/common/config/app-config.service';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;

  constructor(configService: AppConfigService) {
    this.client = new Redis(configService.redis.url, {
      lazyConnect: true,
    });
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    await this.client.set(key, value, 'EX', ttlSeconds);
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async onModuleInit(): Promise<void> {
    await this.client.connect();
    await this.ping();

    this.logger.log('Redis Connection Established');
  }

  async ping(): Promise<string> {
    return this.client.ping();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();

    this.logger.log('Redis Connection Closed');
  }
}
