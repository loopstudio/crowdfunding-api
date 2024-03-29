import { ConfigService } from '@nestjs/config';
import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';

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
