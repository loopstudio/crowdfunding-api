import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CampaignsService } from './services/campaigns.service';
import { CampaignsController } from './controllers/campaigns.controller';
import { CampaignsMongoRepository } from './repositories/mongo/campaigns.repository';
import { Campaign, CampaignSchema } from './schemas/campaign.schema';
import { TokensModule } from '../tokens/tokens.module';
import { CampaignStatusesModule } from '../campaign-statuses/campaign-statuses.module';
import { CampaignCategoriesModule } from '../campaign-categories/campaign-categories.module';
import { CampaignLaunchService } from './services/campaign-launch.service';
import { CampaignLaunchMongoRepository } from './repositories/mongo/campaign-launch.repository';
import {
  CampaignLaunch,
  CampaignLaunchSchema,
} from './schemas/campaign-launch.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Campaign.name,
        schema: CampaignSchema,
      },
      {
        name: CampaignLaunch.name,
        schema: CampaignLaunchSchema,
      },
    ]),
    TokensModule,
    CampaignStatusesModule,
    CampaignCategoriesModule,
  ],
  controllers: [CampaignsController],
  providers: [
    CampaignsService,
    CampaignsMongoRepository,
    CampaignLaunchService,
    CampaignLaunchMongoRepository,
  ],
  exports: [CampaignLaunchService],
})
export class CampaignsModule {}
