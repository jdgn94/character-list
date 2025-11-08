import { Module } from '@nestjs/common';
import { SeriesModule } from './series/series.module';
import { ActivesModule } from './actives/actives.module';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ActivesModule, SeriesModule, DatabaseModule],
  controllers: [AppController],
})
export class AppModule {}
