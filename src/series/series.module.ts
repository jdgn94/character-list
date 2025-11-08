import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SeriesController } from './series.controller';
import { SeriesService } from './series.service';
import { UserMiddleware } from 'src/service/middlewares/middleware';

@Module({
  controllers: [SeriesController],
  providers: [SeriesService],
})
export class SeriesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes(SeriesController);
  }
}
