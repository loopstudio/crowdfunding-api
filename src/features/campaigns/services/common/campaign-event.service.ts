import { Injectable } from '@nestjs/common';

import { TokenDocument } from 'src/features/tokens/schemas/token.schema';
import { UserDocument } from 'src/features/users/schemas/user.schema';
import { CampaignDocument } from '../../schemas/campaign.schema';
import { CampaignsService } from 'src/features/campaigns/services/campaigns.service';
import { TokensService } from 'src/features/tokens/services/tokens.service';
import { UsersService } from 'src/features/users/services/users.service';

@Injectable()
export abstract class CampaignEventService {
  constructor(
    readonly campaignService: CampaignsService,
    readonly usersService: UsersService,
    readonly tokensService: TokensService,
  ) {}

  async getMetadata({
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
