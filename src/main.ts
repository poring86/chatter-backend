import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
const cookieParser = require('cookie-parser');
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(Logger));
  app.use(cookieParser());

  const configService = app.get(ConfigService);

  // ✅ CORS configurado para aceitar cookies
  app.enableCors({
    origin: 'http://localhost:3000', // substitua pelo domínio do seu frontend
    credentials: true,
  });

  await app.listen(configService.getOrThrow('PORT'));
}
bootstrap();
