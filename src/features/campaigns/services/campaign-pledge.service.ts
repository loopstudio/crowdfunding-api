import { Injectable, Logger } from '@nestjs/common';

import { CampaignsService } from 'src/features/campaigns/services/campaigns.service';
import { TokensService } from 'src/features/tokens/services/tokens.service';
import { UsersService } from 'src/features/users/services/users.service';
import { CampaignPledgeMongoRepository } from '../repositories/mongo/campaign-pledge.repository';
import { CampaignsMongoRepository } from '../repositories/mongo/campaigns.repository';

@Injectable()
export class CampaignPledgeService {
  private readonly logger = new Logger(CampaignPledgeService.name);

  constructor(
    private readonly campaignService: CampaignsService,
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly campaignPledgeMongoRepository: CampaignPledgeMongoRepository,
    private readonly campaignMongoRepository: CampaignsMongoRepository,
  ) {}

  async create(eventData: unknown) {
    if (!Array.isArray(eventData)) {
      throw new Error('Event data is corrupted');
    }

    const [campaignId, userAddress, amount] = eventData;

    const { campaign } = await this.campaignService.findOne(campaignId);
    if (!campaign) {
      throw new Error('No associated campaing');
    }

    const user = await this.usersService.findUserByAddress(userAddress);
    if (!user) {
      throw new Error('No associated user');
    }

    // TODO: how to get token address?
    const tokenAddress = '0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413';
    const token = await this.tokensService.getByAddress(tokenAddress);
    if (!token) {
      throw new Error('No associated token');
    }

    await this.campaignPledgeMongoRepository.create({
      campaign,
      user,
      token,
      amount,
    });

    // TODO: Update Campaign document
    await this.campaignMongoRepository.updateTokenAmount({
      campaignId,
      amountToChange: amount,
      tokenAddress,
      action: 'INCREASE',
    });

    // TODO: Update UserCampaign document
  }
}
