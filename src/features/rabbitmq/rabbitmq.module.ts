import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { rabbitmqConnectionFactory } from 'src/common/rabbitmq';
import { RabbitmqService } from './rabbitmq.service';

@Module({
  imports: [ClientsModule.registerAsync([rabbitmqConnectionFactory])],
  controllers: [],
  providers: [RabbitmqService],
})
export class RabbitmqModule {}
