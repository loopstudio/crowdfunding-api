import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CampaignsService } from './services/campaigns.service';
import { CampaignsController } from './controllers/campaigns.controller';
import { CampaignsPledgeController } from './controllers/campaign-pledge/campaigns-pledge.controller';
import { CampaignsMongoRepository } from './repositories/mongo/campaigns.repository';
import { Campaign, CampaignSchema } from './schemas/campaign.schema';
import { TokensModule } from '../tokens/tokens.module';
import { CampaignStatusesModule } from '../campaign-statuses/campaign-statuses.module';
import { CampaignCategoriesModule } from '../campaign-categories/campaign-categories.module';
import { CampaignLaunchService } from './services/campaign-launch.service';
import { CampaignLaunchMongoRepository } from './repositories/mongo/campaign-launch.repository';
import { CampaignPledgeService } from './services/campaign-pledge/campaign-pledge.service';
import { CampaignPledgeMongoRepository } from './repositories/mongo/campaign-pledge/campaign-pledge.repository';
import { CampaignRefundService } from './services/campaign-refund/campaign-refund.service';
import { CampaignRefundMongoRepository } from './repositories/mongo/campaign-refund/campaign-refund.repository';
import {
  CampaignLaunch,
  CampaignLaunchSchema,
} from './schemas/campaign-launch.schema';
import {
  CampaignPledge,
  CampaignPledgeSchema,
} from './schemas/campaign-pledge.schema';
import {
  CampaignClaim,
  CampaignClaimSchema,
} from './schemas/campaign-claim.schema';
import {
  CampaignRefund,
  CampaignRefundSchema,
} from './schemas/campaign-refund.schema';
import {
  CampaignCancel,
  CampaignCancelSchema,
} from './schemas/campaign-cancel.schema';
import { UsersRepository } from '../users/repositories/users/mongo/users.repository';
import { UsersModule } from '../users/users.module';
import { User, UserSchema } from '../users/schemas/user.schema';
import { CampaignClaimService } from './services/campaign-claim/campaign-claim.service';
import { CampaignClaimMongoRepository } from './repositories/mongo/campaign-claim/campaign-claim.repository';
import { CampaignCancelService } from './services/campaign-cancel/campaign-cancel.service';
import { CampaignCancelMongoRepository } from './repositories/mongo/campaign-cancel/campaign-cancel.repository';

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
        name: CampaignClaim.name,
        schema: CampaignClaimSchema,
      },
      {
        name: CampaignRefund.name,
        schema: CampaignRefundSchema,
      },
      {
        name: CampaignCancel.name,
        schema: CampaignCancelSchema,
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
  controllers: [CampaignsController, CampaignsPledgeController],
  providers: [
    CampaignsService,
    CampaignsMongoRepository,
    CampaignLaunchService,
    CampaignLaunchMongoRepository,
    CampaignPledgeService,
    CampaignRefundService,
    CampaignCancelService,
    CampaignPledgeMongoRepository,
    CampaignClaimMongoRepository,
    CampaignRefundMongoRepository,
    CampaignCancelMongoRepository,
    UsersRepository,
    CampaignClaimService,
  ],
  exports: [
    CampaignLaunchService,
    CampaignPledgeService,
    CampaignClaimService,
    CampaignRefundService,
    CampaignCancelService,
  ],
})
export class CampaignsModule {}
