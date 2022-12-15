import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

import {
  CampaignPledge,
  CampaignPledgeDocument,
} from '../../schemas/campaign-pledge.schema';

@Injectable()
export class CampaignPledgeMongoRepository {
  constructor(
    @InjectModel(CampaignPledge.name)
    private campaignPledgeModel: Model<CampaignPledgeDocument>,
  ) {}

  async create({
    campaignId,
    userId,
    tokenId,
    amount,
  }: {
    userId: ObjectId;
    campaignId: ObjectId;
    tokenId: ObjectId;
    amount: string;
  }) {
    return await this.campaignPledgeModel.create({
      campaign: campaignId,
      user: userId,
      token: tokenId,
      amount,
      date: new Date(),
    });
  }
}
