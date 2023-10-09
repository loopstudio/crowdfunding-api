import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { NFT_GENERATION_QUEUE, RABBITMQ_SERVICE_NAME } from './constants';
import { ImageData } from './types';

@Injectable()
export class RabbitmqService {
  constructor(@Inject(RABBITMQ_SERVICE_NAME) private rmqClient: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.rmqClient.connect();
  }

  sendMessageToQueue(data: ImageData) {
    this.rmqClient.emit<number>(NFT_GENERATION_QUEUE, {
      data,
    });
  }
}
