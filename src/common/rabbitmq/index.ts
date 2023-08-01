import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  ClientsProviderAsyncOptions,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';

import { AppModule } from 'src/app.module';
import {
  NFT_GENERATION_QUEUE,
  RABBITMQ_SERVICE_NAME,
} from 'src/features/rabbitmq/constants';

export const rabbitmqConnectionFactory = {
  name: RABBITMQ_SERVICE_NAME,
  useFactory: (configService: ConfigService) => ({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get('RABBITMQ_URL') as string],
      queue: NFT_GENERATION_QUEUE,
      noAck: false,
      prefetchCount: 1,
      queueOptions: {
        durable: false,
      },
    },
  }),
  inject: [ConfigService],
} as ClientsProviderAsyncOptions;

export const createRMQMicroservice = (queueName: string) => {
  return NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:admin@localhost:5672'], // TODO: Change path
      queue: queueName,
      prefetchCount: 1,
      queueOptions: { durable: false },
    },
  });
};
