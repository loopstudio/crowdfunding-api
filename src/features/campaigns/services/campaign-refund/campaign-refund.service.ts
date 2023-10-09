import { Injectable, Logger } from '@nestjs/common';

import { CampaignsService } from 'src/features/campaigns/services/campaigns.service';
import { TokensService } from 'src/features/tokens/services/tokens.service';
import { UsersService } from 'src/features/users/services/users.service';
import { CampaignRefundMongoRepository } from '../../repositories/mongo/campaign-refund/campaign-refund.repository';
import { UserCampaignsRepository } from 'src/features/users/repositories/user-campaigns/mongo/user-campaigns.repository';
import { CrowdfundingEvent } from 'src/features/events/types';
import { CampaignEventService } from '../common/campaign-event.service';

@Injectable()
export class CampaignRefundService extends CampaignEventService {
  private readonly logger = new Logger(CampaignRefundService.name);

  constructor(
    readonly campaignService: CampaignsService,
    readonly usersService: UsersService,
    readonly tokensService: TokensService,
    private readonly campaignRefundMongoRepository: CampaignRefundMongoRepository,
    private readonly userCampaignsMongoRepository: UserCampaignsRepository,
  ) {
    super(campaignService, usersService, tokensService);
  }

  async create(eventData: unknown) {
    if (!Array.isArray(eventData)) {
      throw new Error('Event data is corrupted');
    }

    const [onchainId, userAddress, amount] = eventData;
    const { campaign, user, token } = await this.getMetadata({
      onchainId,
      userAddress,
    });

    const savedRefund = await this.campaignRefundMongoRepository.create({
      campaignId: campaign._id,
      userId: user._id,
      tokenId: token._id,
      amount,
    });

    await this.userCampaignsMongoRepository.updateUserCampaignByEvent({
      campaign,
      user,
      token,
      event: savedRefund,
      eventType: CrowdfundingEvent.Refund,
    });
  }
}
