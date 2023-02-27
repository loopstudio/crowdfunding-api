import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { formatEther, parseEther } from 'ethers/lib/utils';

import { CrowdfundingEvent } from 'src/features/events/types/index';
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

  async updateUserCampaignByEvent({
    campaign,
    user,
    token,
    eventType,
    event,
  }: {
    campaign: CampaignDocument;
    user: UserDocument;
    token: TokenDocument;
    eventType: CrowdfundingEvent;
    event: CampaignPledgeDocument | CampaignPledgeDocument;
  }): Promise<void> {
    let associatedUserCampaign = await this.userCampaignModel.findOne({
      campaign: campaign._id,
      user: user._id,
      token: token._id,
    });

    if (!associatedUserCampaign) {
      associatedUserCampaign = await this.userCampaignModel.create({
        campaign: campaign._id,
        user: user._id,
        token: token._id,
        totalPledged: 0,
        totalUnpledged: 0,
        totalClaimed: 0,
        totalRefunded: 0,
        pledges: [],
        unpledges: [],
        claims: [],
        refunds: [],
      });
    }

    const userCampignToSave = this.getUserCampaignUpdated({
      event,
      eventType,
      userCampaign: associatedUserCampaign,
    });

    await userCampignToSave.save();
  }

  private getUserCampaignUpdated({
    userCampaign,
    eventType,
    event,
  }: {
    userCampaign: UserCampaignDocument;
    eventType: CrowdfundingEvent;
    event: CampaignPledgeDocument | CampaignPledgeDocument;
  }): UserCampaignDocument {
    switch (eventType) {
      case CrowdfundingEvent.Pledge:
        userCampaign.pledges.push(event._id);
        userCampaign.totalPledged = formatEther(
          parseEther(userCampaign.totalPledged).add(parseEther(event.amount)),
        );
        break;
      case CrowdfundingEvent.Claim:
        userCampaign.claims.push(event._id);
        userCampaign.totalClaimed = formatEther(parseEther(event.amount));
        break;
    }

    return userCampaign;
  }
}
