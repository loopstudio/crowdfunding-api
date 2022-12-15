import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { formatEther, parseEther } from 'ethers/lib/utils';

import { CampaignPledgeDocument } from 'src/features/campaigns/schemas/campaign-pledge.schema';
import { CampaignDocument } from 'src/features/campaigns/schemas/campaign.schema';
import { TokenDocument } from 'src/features/tokens/schemas/token.schema';
import { UserDocument } from 'src/features/users/schemas/user.schema';
import {
  UserCampaign,
  UserCampaignDocument,
} from 'src/features/users/schemas/user-campaign.schema';

@Injectable()
export class UserCampaignsRepository {
  constructor(
    @InjectModel(UserCampaign.name)
    private userCampaignModel: Model<UserCampaignDocument>,
  ) {}

  async updateUserCampaign({
    campaign,
    user,
    token,
    pledge,
  }: {
    campaign: CampaignDocument;
    user: UserDocument;
    token: TokenDocument;
    pledge: CampaignPledgeDocument;
  }): Promise<void> {
    const existingUserCampaign = await this.userCampaignModel.findOne({
      campaign: campaign._id,
      user: user._id,
      token: token._id,
    });

    if (existingUserCampaign) {
      existingUserCampaign.pledges.push(pledge._id);
      existingUserCampaign.totalPledged = formatEther(
        parseEther(existingUserCampaign.totalPledged).add(
          parseEther(pledge.amount),
        ),
      );

      await existingUserCampaign.save();
    } else {
      const newUserCampaign = await this.userCampaignModel.create({
        campaign: campaign._id,
        user: user._id,
        token: token._id,
        totalPledged: formatEther(pledge.amount),
        totalUnpledged: 0,
        totalClaimed: 0,
        totalRefunded: 0,
        pledges: [pledge._id],
        unpledges: [],
        claims: [],
        refunds: [],
      });

      await newUserCampaign.save();
    }
  }
}
