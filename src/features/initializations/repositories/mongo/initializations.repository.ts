import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  CampaignStatus,
  CampaignStatusDocument,
} from 'src/features/campaignStatuses/schemas/campaignStatus.schema';

import { predefinedCampaignStatuses } from '../../constants';

@Injectable()
export class InitializationsMongoRepository {
  constructor(
    @InjectModel(CampaignStatus.name)
    private campaignStatusModel: Model<CampaignStatusDocument>,
  ) {}

  async checkCampaignStatuses(): Promise<void> {
    try {
      const currentCampaignStatuses = await this.campaignStatusModel
        .count()
        .exec();

      if (currentCampaignStatuses === 0) {
        console.log(`Creating campaign statuses`);
        await this.campaignStatusModel.insertMany(predefinedCampaignStatuses);
      } else {
        console.log(`Campaign statuses already created`);
      }

      console.log(`Campaign statuses validation done`);
    } catch (err) {
      console.log(
        `Something went wrong when validating campaign statuses > ${err}`,
      );
    }
  }
}
