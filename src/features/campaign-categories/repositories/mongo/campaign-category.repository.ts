import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  CampaignCategory,
  CampaignCategoryDocument,
} from '../../schemas/campaign-category.schema';

@Injectable()
export class CampaignCategoriesRepository {
  constructor(
    @InjectModel(CampaignCategory.name)
    private campaignCategoryModel: Model<CampaignCategoryDocument>,
  ) {}

  async getById(id: string): Promise<CampaignCategory> {
    const campaignCategory = await this.campaignCategoryModel
      .findById(id)
      .lean();

    return campaignCategory;
  }
}
