import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { EventsService } from './services/events.service';
import { EventsMongoRepository } from './repositories/mongo/events.repository';
import { Event, EventSchema } from './schemas/event.schema';
import { CampaignsModule } from '../campaigns/campaigns.module';

@Global()
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema,
      },
    ]),
    CampaignsModule,
  ],
  providers: [EventsService, EventsMongoRepository],
  exports: [EventsService],
})
export class EventsModule {}
