import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

import {
  CampaignCancel,
  CampaignCancelDocument,
} from 'src/features/campaigns/schemas/campaign-cancel.schema';

@Injectable()
export class CampaignCancelMongoRepository {
  constructor(
    @InjectModel(CampaignCancel.name)
    private campaignCancelModel: Model<CampaignCancelDocument>,
  ) {}

  async create({
    campaignId,
    userId,
    tokenId,
  }: {
    userId: ObjectId;
    campaignId: ObjectId;
    tokenId: ObjectId;
  }) {
    return await this.campaignCancelModel.create({
      campaign: campaignId,
      user: userId,
      token: tokenId,
      date: new Date(),
    });
  }
}
