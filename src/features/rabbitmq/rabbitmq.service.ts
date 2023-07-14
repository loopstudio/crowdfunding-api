import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { NFT_GENERATION_QUEUE, RABBITMQ_SERVICE_NAME } from './constants';

@Injectable()
export class RabbitmqService {
  constructor(@Inject(RABBITMQ_SERVICE_NAME) private rmqClient: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.rmqClient.connect();
  }

  sendMessageToQueue() {
    // TODO: Handle business logic here
    // TODO: this method should be called when a new pledge is generated
    this.rmqClient.emit<number>(NFT_GENERATION_QUEUE, {
      message: 'Hello World!',
    });
  }
}
