import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EventsService } from './services/events.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
