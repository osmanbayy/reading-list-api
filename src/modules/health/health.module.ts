import { Module } from '@nestjs/common';

import { HealthCheckService } from './health-check.service';
import { HealthScheduler } from './health.scheduler';

@Module({
  providers: [HealthCheckService, HealthScheduler],
})
export class HealthModule {}
