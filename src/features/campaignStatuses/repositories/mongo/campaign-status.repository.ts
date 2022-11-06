import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  CampaignStatus,
  CampaignStatusDocument,
} from '../../schemas/campaign-status.schema';

@Injectable()
export class CampaignStatusRepository {
  constructor(
    @InjectModel(CampaignStatus.name)
    private campaignStatusModel: Model<CampaignStatusDocument>,
  ) {}

  async getStatusByCode(code: string): Promise<CampaignStatusDocument> {
    const campaignStatus = await this.campaignStatusModel.findOne({ code });

    return campaignStatus;
  }
}
