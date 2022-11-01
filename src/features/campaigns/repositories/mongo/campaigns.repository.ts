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

  async findAll() {
    const campaings = await this.campaignModel.find().lean();
    return campaings;
  }

  async findOne(id: string) {
    const campaing = await this.campaignModel.findOne({ _id: id }).lean();
    if (!campaing) {
      throw new NotFoundException();
    }

    return campaing;
  }

  async create(createCampaignDto: CreateCampaignDto) {
    // TODO: Use upsert for POST and PATCH

    // TODO: Validate that sent tokens exist
    // TODO: Validate that sent category exists

    // TODO: Look for PENDING campaign status
    const status = '63611e68143b8def9c4843cf';
    // TODO: Assign logged in user
    const owner = '634dd92c34361cf5a21fb96b';

    const {
      title,
      subtitle,
      story,
      startDate,
      endDate,
      code,
      fiatAmount,
      image,
      video,
      category,
      goal,
    } = createCampaignDto;

    const currentAmount = goal.map((tokenAmount) => ({
      token: tokenAmount.token,
      amount: 0,
    }));

    const campaign = await new this.campaignModel({
      title,
      subtitle,
      story,
      startDate,
      endDate,
      code,
      fiatAmount,
      image,
      video,
      backers: [],
      status,
      goal,
      currentAmount,
      category,
      owner,
    }).save();

    return campaign;
  }
}
