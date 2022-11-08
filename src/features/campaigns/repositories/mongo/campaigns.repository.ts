import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Campaign, CampaignDocument } from '../../schemas/campaign.schema';
import { CreateCampaignDto } from '../../dto/create-campaign.dto';

@Injectable()
export class CampaignsMongoRepository {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
  ) {}

  async findAll({ page, size }: { page: number; size: number }) {
    const skipValue = page > 0 ? (page - 1) * size : 0;

    const campaings = await this.campaignModel
      .find()
      .sort({ created: -1 })
      .skip(skipValue)
      .limit(size)
      .lean();

    return campaings;
  }

  async findOne(id: string) {
    const campaing = await this.campaignModel.findOne({ _id: id }).lean();
    if (!campaing) {
      throw new NotFoundException();
    }

    return campaing;
  }

  async create(createCampaignData: {
    dto: CreateCampaignDto;
    pendingStatusId;
  }) {
    // TODO: Use upsert for POST and PATCH

    // TODO: Assign logged in user
    const owner = '634dd92c34361cf5a21fb96b';

    const {
      dto: {
        title,
        subtitle,
        story,
        startDate,
        endDate,
        image,
        video,
        category,
        goal,
      },
      pendingStatusId,
    } = createCampaignData;

    const currentAmount = goal.map((tokenAmount) => ({
      token: tokenAmount.token,
      amount: 0,
    }));

    const campaign = await this.campaignModel.create({
      title,
      subtitle,
      story,
      startDate,
      endDate,
      image,
      video,
      status: pendingStatusId,
      goal,
      currentAmount,
      category,
      owner,
    });

    return campaign;
  }
}
