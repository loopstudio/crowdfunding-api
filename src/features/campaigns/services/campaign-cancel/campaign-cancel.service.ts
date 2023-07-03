import { Injectable } from '@nestjs/common';

import { CampaignsService } from 'src/features/campaigns/services/campaigns.service';
import { TokensService } from 'src/features/tokens/services/tokens.service';
import { UsersService } from 'src/features/users/services/users.service';
import { CampaignEventService } from '../common/campaign-event.service';
import { CampaignStatusService } from 'src/features/campaign-statuses/services/campaign-statuses.service';
import { CampaignsMongoRepository } from 'src/features/campaigns/repositories/mongo/campaigns.repository';
import { CampaignCancelMongoRepository } from '../../repositories/mongo/campaign-cancel/campaign-cancel.repository';

@Injectable()
export class CampaignCancelService extends CampaignEventService {
  private readonly cancelStatusCode = 'canceled';

  constructor(
    readonly campaignService: CampaignsService,
    readonly usersService: UsersService,
    readonly tokensService: TokensService,
    private readonly campaignCancelMongoRepository: CampaignCancelMongoRepository,
    private readonly campaignMongoRepository: CampaignsMongoRepository,
    private readonly campaignStatusService: CampaignStatusService,
  ) {
    super(campaignService, usersService, tokensService);
  }

  async create(eventData: unknown) {
    if (!Array.isArray(eventData)) {
      throw new Error('Event data is corrupted');
    }

    const [onchainId, userAddress] = eventData;
    const { campaign, user, token } = await this.getMetadata({
      onchainId,
      userAddress,
    });

    await this.campaignCancelMongoRepository.create({
      campaignId: campaign._id,
      userId: user._id,
      tokenId: token._id,
    });

    const { _id: cancelStatusId } =
      await this.campaignStatusService.getStatusByCode(this.cancelStatusCode);

    await this.campaignMongoRepository.update({
      id: parseInt(onchainId).toString(),
      updateCampaignDto: {
        status: cancelStatusId,
      },
    });
  }
}
