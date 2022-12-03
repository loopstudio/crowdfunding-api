import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  CampaignPledge,
  CampaignPledgeDocument,
} from '../../schemas/campaign-pledge.schema';
import { User } from 'src/features/users/schemas/user.schema';
import { Campaign } from '../../schemas/campaign.schema';
import { Token } from 'src/features/tokens/schemas/token.schema';

@Injectable()
export class CampaignPledgeMongoRepository {
  constructor(
    @InjectModel(CampaignPledge.name)
    private campaignPledgeModel: Model<CampaignPledgeDocument>,
  ) {}

  async create({
    campaign,
    user,
    token,
    amount,
  }: {
    user: User;
    campaign: Campaign;
    token: Token;
    amount: string;
  }) {
    return await this.campaignPledgeModel.create({
      campaign,
      user,
      token,
      amount,
      date: new Date(),
    });
  }
}
