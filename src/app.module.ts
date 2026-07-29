import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './common/config/app-config.module';
import { PostgresDatabaseModule } from './core/database/postgres/postgres-database.module';
import { BooksModule } from './modules/books/books.module';
import { RedisModule } from './core/redis/redis.module';
import { HealthModule } from './modules/health/health.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    AppConfigModule,
    PostgresDatabaseModule,
    BooksModule,
    RedisModule,
    HealthModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
