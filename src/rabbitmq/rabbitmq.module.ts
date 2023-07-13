import { Module } from '@nestjs/common';
import { RabbitmqController } from './rabbitmq.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin@host.docker.internal:5672'],
          queue: 'nft_generation', // TODO: Change queue name
          // noAck: false,
          prefetchCount: 1,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [RabbitmqController],
})
export class RabbitmqModule {}
