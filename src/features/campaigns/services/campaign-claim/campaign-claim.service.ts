import { Injectable, Logger } from '@nestjs/common';
import { formatEther } from 'ethers/lib/utils';

import { TokenDocument } from 'src/features/tokens/schemas/token.schema';
import { UserDocument } from 'src/features/users/schemas/user.schema';
import { CampaignDocument } from '../../schemas/campaign.schema';
import { CampaignsService } from 'src/features/campaigns/services/campaigns.service';
import { TokensService } from 'src/features/tokens/services/tokens.service';
import { UsersService } from 'src/features/users/services/users.service';
import { CampaignStatusService } from 'src/features/campaign-statuses/services/campaign-statuses.service';
import { CampaignClaimMongoRepository } from 'src/features/campaigns/repositories/mongo/campaign-claim/campaign-claim.repository';
import { CampaignsMongoRepository } from 'src/features/campaigns/repositories/mongo/campaigns.repository';
import { UserCampaignsRepository } from 'src/features/users/repositories/user-campaigns/mongo/user-campaigns.repository';
import { CrowdfundingEvent } from 'src/features/events/types';

@Injectable()
export class CampaignClaimService {
  private readonly logger = new Logger(CampaignClaimService.name);
  private readonly claimStatusCode = 'claimed';

  constructor(
    private readonly campaignService: CampaignsService,
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly campaignClaimMongoRepository: CampaignClaimMongoRepository,
    private readonly campaignMongoRepository: CampaignsMongoRepository,
    private readonly userCampaignsMongoRepository: UserCampaignsRepository,
    private readonly campaignStatusService: CampaignStatusService,
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

    const savedClaim = await this.campaignClaimMongoRepository.create({
      campaignId: campaign._id,
      userId: user._id,
      tokenId: token._id,
      amount,
    });

    const { _id: claimStatusId } =
      await this.campaignStatusService.getStatusByCode(this.claimStatusCode);

    console.log('data > ', {
      id: parseInt(onchainId).toString(),
      updateCampaignDto: {
        status: claimStatusId,
      },
    });

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

  // TODO: This method is already used on pledge event.
  // TODO: Refactor this method to be used on both pledge and claim events.
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
