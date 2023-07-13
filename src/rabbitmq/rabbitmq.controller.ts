import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { Public } from 'src/features/auth/decorators';

@Public()
@Controller('rabbitmq')
export class RabbitmqController {
  constructor(@Inject('RMQ_SERVICE') private rmqClient: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.rmqClient.connect();
  }

  @Get()
  getHello(): string {
    this.rmqClient.emit<number>('nft_generation', { message: 'Hello World!' });
    return 'Hello World!';
  }
}
