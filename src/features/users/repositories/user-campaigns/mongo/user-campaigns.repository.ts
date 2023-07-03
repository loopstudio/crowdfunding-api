import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { formatEther, parseEther } from 'ethers/lib/utils';
import { CrowdfundingEvent } from 'src/features/events/types/index';
import { CampaignPledgeDocument } from 'src/features/campaigns/schemas/campaign-pledge.schema';
import { CampaignCancelDocument } from 'src/features/campaigns/schemas/campaign-cancel.schema';
import { CampaignDocument } from 'src/features/campaigns/schemas/campaign.schema';
import { TokenDocument } from 'src/features/tokens/schemas/token.schema';
import { UserDocument } from 'src/features/users/schemas/user.schema';
import {
  UserCampaign,
  UserCampaignDocument,
} from 'src/features/users/schemas/user-campaign.schema';

type Event = CampaignPledgeDocument | CampaignCancelDocument;

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
    event: Event;
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
    event: Event;
  }): UserCampaignDocument {
    switch (eventType) {
      case CrowdfundingEvent.Pledge:
        userCampaign.pledges.push(event._id);
        userCampaign.totalPledged = formatEther(
          parseEther(userCampaign.totalPledged).add(
            parseEther((event as CampaignPledgeDocument).amount),
          ),
        );
        break;
      case CrowdfundingEvent.Claim:
        userCampaign.claims.push(event._id);
        userCampaign.totalClaimed = formatEther(
          parseEther((event as CampaignPledgeDocument).amount),
        );
        break;
      case CrowdfundingEvent.Refund:
        userCampaign.refunds.push(event._id);
        userCampaign.totalRefunded = formatEther(
          parseEther((event as CampaignPledgeDocument).amount),
        );
        break;
    }

    return userCampaign;
  }
}
