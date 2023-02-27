import { Injectable, Logger } from '@nestjs/common';

import { CampaignsService } from 'src/features/campaigns/services/campaigns.service';
import { TokensService } from 'src/features/tokens/services/tokens.service';
import { UsersService } from 'src/features/users/services/users.service';
import { CampaignEventService } from '../common/campaign-event.service';
import { CampaignStatusService } from 'src/features/campaign-statuses/services/campaign-statuses.service';
import { CampaignClaimMongoRepository } from 'src/features/campaigns/repositories/mongo/campaign-claim/campaign-claim.repository';
import { CampaignsMongoRepository } from 'src/features/campaigns/repositories/mongo/campaigns.repository';
import { UserCampaignsRepository } from 'src/features/users/repositories/user-campaigns/mongo/user-campaigns.repository';
import { CrowdfundingEvent } from 'src/features/events/types';

@Injectable()
export class CampaignClaimService extends CampaignEventService {
  private readonly logger = new Logger(CampaignClaimService.name);
  private readonly claimStatusCode = 'claimed';

  constructor(
    readonly campaignService: CampaignsService,
    readonly usersService: UsersService,
    readonly tokensService: TokensService,
    private readonly campaignClaimMongoRepository: CampaignClaimMongoRepository,
    private readonly campaignMongoRepository: CampaignsMongoRepository,
    private readonly userCampaignsMongoRepository: UserCampaignsRepository,
    private readonly campaignStatusService: CampaignStatusService,
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

    const savedClaim = await this.campaignClaimMongoRepository.create({
      campaignId: campaign._id,
      userId: user._id,
      tokenId: token._id,
      amount,
    });

    const { _id: claimStatusId } =
      await this.campaignStatusService.getStatusByCode(this.claimStatusCode);

    await this.campaignMongoRepository.update({
      id: parseInt(onchainId).toString(),
      updateCampaignDto: {
        status: claimStatusId,
      },
    });

    await this.userCampaignsMongoRepository.updateUserCampaignByEvent({
      campaign,
      user,
      token,
      event: savedClaim,
      eventType: CrowdfundingEvent.Claim,
    });
  }
}
