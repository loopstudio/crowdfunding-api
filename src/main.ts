import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as morgan from 'morgan';
import mongoose from 'mongoose';

import { AppModule } from './app.module';

const { API_PORT, DEBUG } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(morgan('combined'));

  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(new ValidationPipe());

  // TODO: add error handling middleware

  try {
    mongoose.set('debug', !!DEBUG);

    await app.listen(API_PORT);
    console.log(`NestJS API listening on port ${API_PORT}`);
  } catch (err) {
    process.exit(1);
  }
}
bootstrap();
