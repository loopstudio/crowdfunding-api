import { Injectable, Logger } from '@nestjs/common';

import { CampaignsService } from 'src/features/campaigns/services/campaigns.service';
import { TokensService } from 'src/features/tokens/services/tokens.service';
import { UsersService } from 'src/features/users/services/users.service';
import { CampaignPledgeMongoRepository } from '../../repositories/mongo/campaign-pledge/campaign-pledge.repository';
import { CampaignsMongoRepository } from '../../repositories/mongo/campaigns.repository';
import { UserCampaignsRepository } from 'src/features/users/repositories/user-campaigns/mongo/user-campaigns.repository';
import { movementTypeEnum } from '../../constants';
import { CrowdfundingEvent } from 'src/features/events/types';
import { CampaignEventService } from '../common/campaign-event.service';

@Injectable()
export class CampaignPledgeService extends CampaignEventService {
  private readonly logger = new Logger(CampaignPledgeService.name);

  constructor(
    readonly campaignService: CampaignsService,
    readonly usersService: UsersService,
    readonly tokensService: TokensService,
    private readonly campaignPledgeMongoRepository: CampaignPledgeMongoRepository,
    private readonly campaignMongoRepository: CampaignsMongoRepository,
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

    const savedPledge = await this.campaignPledgeMongoRepository.create({
      campaignId: campaign._id,
      userId: user._id,
      tokenId: token._id,
      amount,
    });

    await this.campaignMongoRepository.updateTokenAmount({
      campaignId: onchainId,
      amountToChange: amount,
      tokenAddress: token.address,
      action: movementTypeEnum.INCREASE,
    });

    await this.userCampaignsMongoRepository.updateUserCampaignByEvent({
      campaign,
      user,
      token,
      event: savedPledge,
      eventType: CrowdfundingEvent.Pledge,
    });
  }

  async findAllByUser({
    page,
    size,
    userId,
    search,
  }: {
    page: number;
    size: number;
    userId: string;
    search: string;
  }) {
    const campaigns = await this.campaignPledgeMongoRepository.findAll({
      page,
      size,
      userId,
      search,
    });

    return campaigns;
  }
}
