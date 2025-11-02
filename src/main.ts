import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './service/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
  });
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);

  console.success('La aplicacion se levanto en el puerto:', port);
}
void bootstrap();
