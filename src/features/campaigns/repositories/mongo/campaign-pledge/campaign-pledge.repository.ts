import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Campaign } from 'src/features/campaigns/schemas/campaign.schema';

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
    userId,
    search,
  }: {
    page: number;
    size: number;
    userId: string;
    search: string;
  }) {
    const skipValue = (page - 1) * size;

    const campaignsMongoResponse = await this.campaignPledgeModel.aggregate([
      {
        $facet: {
          data: [
            { $match: { user: userId } },
            { $sort: { created_at: -1 } },
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
            {
              $match: {
                $or: [
                  { 'campaigns.title': { $regex: search } },
                  { 'campaigns.subtitle': { $regex: search } },
                ],
              },
            },
          ],
          count: [
            { $match: { user: userId } },
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
            {
              $match: {
                $or: [
                  { 'campaigns.title': { $regex: search } },
                  { 'campaigns.subtitle': { $regex: search } },
                ],
              },
            },
            { $count: 'total' },
          ],
        },
      },
    ]);

    let campaigns = [];
    let total = 0;

    if (campaignsMongoResponse[0].data.length) {
      campaigns = campaignsMongoResponse[0].data[0].campaigns;
      total = campaignsMongoResponse[0].count[0].total;
    }

    return { campaigns, total };
  }

  async countPledges(campaign: Campaign) {
    const campaignPledges = await this.campaignPledgeModel.find({
      campaign,
    });
    if (!campaignPledges) {
      throw new NotFoundException();
    }
    return campaignPledges.length;
  }
}
