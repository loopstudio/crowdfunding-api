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
import { CampaignPledgeService } from './services/campaign-pledge.service';
import { CampaignPledgeMongoRepository } from './repositories/mongo/campaign-pledge.repository';
import {
  CampaignLaunch,
  CampaignLaunchSchema,
} from './schemas/campaign-launch.schema';
import {
  CampaignPledge,
  CampaignPledgeSchema,
} from './schemas/campaign-pledge.schema';
import { UsersRepository } from '../users/repositories/mongo/users.repository';
import { UsersModule } from '../users/users.module';
import { User, UserSchema } from '../users/schemas/user.schema';

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
      {
        name: CampaignPledge.name,
        schema: CampaignPledgeSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    TokensModule,
    CampaignStatusesModule,
    CampaignCategoriesModule,
    UsersModule,
  ],
  controllers: [CampaignsController],
  providers: [
    CampaignsService,
    CampaignsMongoRepository,
    CampaignLaunchService,
    CampaignLaunchMongoRepository,
    CampaignPledgeService,
    CampaignPledgeMongoRepository,
    UsersRepository,
  ],
  exports: [CampaignLaunchService, CampaignPledgeService],
})
export class CampaignsModule {}
