import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

import {
  CampaignClaim,
  CampaignClaimDocument,
} from '../../../schemas/campaign-claim.schema';

@Injectable()
export class CampaignClaimMongoRepository {
  constructor(
    @InjectModel(CampaignClaim.name)
    private campaignClaimModel: Model<CampaignClaimDocument>,
  ) {}

  // TODO: possible to use an abstract class to define the interface?
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
    return await this.campaignClaimModel.create({
      campaign: campaignId,
      user: userId,
      token: tokenId,
      amount,
      date: new Date(),
    });
  }
}
