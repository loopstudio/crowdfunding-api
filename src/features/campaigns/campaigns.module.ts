import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CampaignsService } from './services/campaigns.service';
import { CampaignsController } from './controllers/campaigns.controller';
import { CampaignsMongoRepository } from './repositories/mongo/campaigns.repository';
import { Campaign, CampaignSchema } from './schemas/campaign.schema';
import { TokensModule } from '../tokens/tokens.module';
import { CampaignStatusesModule } from '../campaignStatuses/campaign-statuses.module';
import { CampaignCategoriesModule } from '../campaignCategories/campaign-categories.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Campaign.name,
        schema: CampaignSchema,
      },
    ]),
    TokensModule,
    CampaignStatusesModule,
    CampaignCategoriesModule,
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService, CampaignsMongoRepository],
})
export class CampaignsModule {}
