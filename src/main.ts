import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as morgan from 'morgan';
import mongoose from 'mongoose';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './middlewares/filters/exception.filter';

const { API_PORT, NODE_ENV } = process.env;

async function bootstrap() {
  const isProductionEnv = NODE_ENV === 'production';
  const app = await NestFactory.create(AppModule);
  const adapterHost = app.get(HttpAdapterHost);

  app.use(helmet());
  app.use(morgan('combined'));

  app.setGlobalPrefix('/api/v1');
  app.useGlobalFilters(new AllExceptionsFilter(adapterHost));
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: isProductionEnv,
    }),
  );
  app.enableShutdownHooks();
  app.enableCors({
    // TODO: To be updated once we upload it to production
    origin: '*',
    methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
  });

  try {
    mongoose.set('debug', !isProductionEnv);

    await app.listen(API_PORT);
    console.log(`NestJS API listening on port ${API_PORT}`);
  } catch (err) {
    process.exit(1);
  }
}
bootstrap();
