import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './common/config/app-config.module';
import { PostgresDatabaseModule } from './core/database/postgres/postgres-database.module';
import { BooksModule } from './modules/books/books.module';

@Module({
  imports: [AppConfigModule, PostgresDatabaseModule, BooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
