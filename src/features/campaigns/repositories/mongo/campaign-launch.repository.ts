import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  CampaignLaunch,
  CampaignLaunchDocument,
} from '../../schemas/campaign-launch.schema';

@Injectable()
export class CampaignLaunchMongoRepository {
  constructor(
    @InjectModel(CampaignLaunch.name)
    private campaignLaunchModel: Model<CampaignLaunchDocument>,
  ) {}

  async create(campaignId: string, onchainId: string) {
    return await this.campaignLaunchModel.create({
      campaign: campaignId,
      onchainId: onchainId,
      date: new Date(),
    });
  }
}
