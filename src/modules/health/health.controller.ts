import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HealthCheckService } from './health-check.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Get()
  @ApiOperation({
    summary: 'Check application dependencies',
  })
  @ApiOkResponse({
    description: 'PostgreSQL and Redis are healthy',
    schema: {
      example: {
        status: 'ok',
      },
    },
  })
  @ApiServiceUnavailableResponse({
    description: 'A dependency is unavailable',
  })
  async check(): Promise<{ status: 'ok' }> {
    try {
      await this.healthCheckService.check();
      return {
        status: 'ok',
      };
    } catch {
      throw new ServiceUnavailableException(
        'Application dependencies are unavailable.',
      );
    }
  }
}
