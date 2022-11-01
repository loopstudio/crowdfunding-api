import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { InitializationsService } from './services/initializations.service';
import { InitializationsMongoRepository } from './repositories/mongo/initializations.repository';
import {
  CampaignStatus,
  CampaignStatusSchema,
} from 'src/features/campaignStatuses/schemas/campaignStatus.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CampaignStatus.name,
        schema: CampaignStatusSchema,
      },
    ]),
  ],
  providers: [InitializationsService, InitializationsMongoRepository],
})
export class InitializationsModule {}
