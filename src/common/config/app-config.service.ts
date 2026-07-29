import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from './app.config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService<AppConfig, true>) {}

  get port(): number {
    return this.configService.getOrThrow('port', { infer: true });
  }

  get database(): AppConfig['database'] {
    return this.configService.getOrThrow('database', { infer: true });
  }

  get redis(): AppConfig['redis'] {
    return this.configService.getOrThrow('redis', { infer: true });
  }
}
