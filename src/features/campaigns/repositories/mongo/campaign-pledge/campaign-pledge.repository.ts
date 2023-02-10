import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { IUser } from 'src/features/users/schemas/user.schema';

import {
  CampaignPledge,
  CampaignPledgeDocument,
} from '../../../schemas/campaign-pledge.schema';

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

  async findAll({
    page,
    size,
    user,
  }: {
    page: number;
    size: number;
    user: IUser;
  }) {
    const skipValue = page > 0 ? (page - 1) * size : 0;
    const campaings = await this.campaignPledgeModel.aggregate([
      {
        $match: { user: user._id },
      },
      { $sort: { created: -1 } },
      { $skip: skipValue },
      { $limit: size },
      {
        $group: {
          _id: null,
          campaigns: {
            $addToSet: '$campaign',
          },
        },
      },
      {
        $project: {
          _id: 0,
          campaigns: 1,
        },
      },
      {
        $lookup: {
          from: 'campaigns',
          localField: 'campaigns',
          foreignField: '_id',
          as: 'campaigns',
        },
      },
    ]);

    return campaings;
  }
}
