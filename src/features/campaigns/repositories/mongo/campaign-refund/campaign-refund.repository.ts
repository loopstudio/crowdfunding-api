import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

import {
  CampaignRefund,
  CampaignRefundDocument,
} from '../../../schemas/campaign-refund.schema';

@Injectable()
export class CampaignRefundMongoRepository {
  constructor(
    @InjectModel(CampaignRefund.name)
    private campaignRefundModel: Model<CampaignRefundDocument>,
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
    return await this.campaignRefundModel.create({
      campaign: campaignId,
      user: userId,
      token: tokenId,
      amount,
      date: new Date(),
    });
  }
}
