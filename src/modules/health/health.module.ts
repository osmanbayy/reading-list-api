import { Module } from '@nestjs/common';

import { HealthCheckService } from './health-check.service';
import { HealthScheduler } from './health.scheduler';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  providers: [HealthCheckService, HealthScheduler],
})
export class HealthModule {}
