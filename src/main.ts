import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { clientConfig } from './common/config';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [clientConfig.clientURL],
    credentials: true,
  });
  app.use(cookieParser());
  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();
