import { Module } from '@nestjs/common';
import { SeriesModule } from './series/series.module';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [SeriesModule, DatabaseModule],
  controllers: [AppController],
})
export class AppModule { }
