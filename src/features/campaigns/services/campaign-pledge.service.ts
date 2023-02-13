import { Injectable, Logger } from '@nestjs/common';

import { CampaignsService } from 'src/features/campaigns/services/campaigns.service';
import { TokensService } from 'src/features/tokens/services/tokens.service';
import { UsersService } from 'src/features/users/services/users.service';
import { CampaignPledgeMongoRepository } from '../repositories/mongo/campaign-pledge.repository';
import { CampaignsMongoRepository } from '../repositories/mongo/campaigns.repository';
import { TokenDocument } from 'src/features/tokens/schemas/token.schema';
import { UserDocument } from 'src/features/users/schemas/user.schema';
import { CampaignDocument } from '../schemas/campaign.schema';
import { UserCampaignsRepository } from 'src/features/users/repositories/user-campaigns/mongo/user-campaigns.repository';
import { movementTypeEnum } from '../constants';
import { CrowdfundingEvent } from 'src/features/events/types';

@Injectable()
export class CampaignPledgeService {
  private readonly logger = new Logger(CampaignPledgeService.name);

  constructor(
    private readonly campaignService: CampaignsService,
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly campaignPledgeMongoRepository: CampaignPledgeMongoRepository,
    private readonly campaignMongoRepository: CampaignsMongoRepository,
    private readonly userCampaignsMongoRepository: UserCampaignsRepository,
  ) {}

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

  // TODO: Use abstract class as in CampaignClaimService
  private async getMetadata({
    onchainId,
    userAddress,
  }: {
    onchainId: string;
    userAddress: string;
  }): Promise<{
    campaign: CampaignDocument;
    user: UserDocument;
    token: TokenDocument;
  }> {
    const promises = [
      this.campaignService.findOne(onchainId),
      this.usersService.findUserByAddress(userAddress),
      this.tokensService.getByDefault(),
    ];

    const promiseResults = await Promise.all<unknown>(promises);
    if (promiseResults.some((result) => !result)) {
      throw new Error('No metadata associated');
    }

    const { campaign } = promiseResults[0] as { campaign: CampaignDocument };
    const user = promiseResults[1] as UserDocument;
    const token = promiseResults[2] as TokenDocument;

    return { campaign, user, token };
  }
}
