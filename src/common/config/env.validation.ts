import { IsInt, IsUrl, Max, Min, validateSync } from 'class-validator';
import { plainToInstance, Type } from 'class-transformer';

export class Env {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT = 3000;

  @IsUrl({
    protocols: ['postgresql'],
    require_protocol: true,
    require_tld: false,
  })
  DATABASE_URL!: string;

  @IsUrl({
    protocols: ['redis'],
    require_protocol: true,
    require_tld: false,
  })
  REDIS_URL!: string;
}

export function validateEnv(config: Record<string, unknown>): Env {
  const validatedConfig = plainToInstance(Env, config);

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) throw new Error(errors.toString());

  return validatedConfig;
}
