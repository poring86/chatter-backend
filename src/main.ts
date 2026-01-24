import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  try {
    console.log('Starting bootstrap...');
    const app = await NestFactory.create(AppModule, { bufferLogs: true, cors: true });
    console.log('App created');
    
    app.useWebSocketAdapter(new IoAdapter(app));
    console.log('Adapter registered');
    
    app.useGlobalPipes(new ValidationPipe());
    app.useLogger(app.get(Logger));
    app.use(cookieParser());
    const configService = app.get(ConfigService);
    const port = configService.getOrThrow('PORT');
    console.log(`Attempting to listen on port ${port}`);
    await app.listen(port);
    console.log(`Server running on port ${port}`);
    console.log(`Current working directory: ${process.cwd()}`);
  } catch (error) {
    console.error('Bootstrap failed:', error);
  }
}
bootstrap();
