import { Injectable, Logger } from '@nestjs/common';
import { HealthCheckService } from './health-check.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class HealthScheduler {
  private readonly logger = new Logger(HealthScheduler.name);

  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Cron(CronExpression.EVERY_5_MINUTES, {
    name: 'health-check',
    waitForCompletion: true,
  })
  async handleHealthCheck(): Promise<void> {
    const startedAt = Date.now();

    try {
      await this.healthCheckService.check();

      const duration = Date.now() - startedAt;

      this.logger.log(`PostgreSQL and Redis are healthy (${duration}ms)`);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Health check failed: ${error.message}`, error.stack);

        return;
      }

      this.logger.log('Health check failed.');
    }
  }
}
