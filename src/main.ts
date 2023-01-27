import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as morgan from 'morgan';
import mongoose from 'mongoose';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './middlewares/filters/exception.filter';
import { JwtAuthGuard } from './features/auth/guards/auth.guard';

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
  app.useGlobalGuards(new JwtAuthGuard(new Reflector()));
  app.enableShutdownHooks();
  app.enableCors({
    // TODO: To be updated once we upload it to production
    origin: '*',
    methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  try {
    mongoose.set('debug', !isProductionEnv);

    await app.listen(API_PORT);
    console.log(`NestJS API listening on port ${API_PORT}`);
  } catch (err) {
    console.log('Error starting app!', err);
    process.exit(1);
  }
}
bootstrap();
