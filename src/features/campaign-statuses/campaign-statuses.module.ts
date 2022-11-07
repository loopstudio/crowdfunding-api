import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignStatusRepository } from './repositories/mongo/campaign-status.repository';

import {
  CampaignStatus,
  CampaignStatusSchema,
} from './schemas/campaign-status.schema';
import { CampaignStatusService } from './services/campaign-statuses.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CampaignStatus.name,
        schema: CampaignStatusSchema,
      },
    ]),
  ],
  providers: [CampaignStatusService, CampaignStatusRepository],
  exports: [CampaignStatusService, CampaignStatusRepository],
})
export class CampaignStatusesModule {}
