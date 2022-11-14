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

  async getByIdOrCode({
    id,
    code,
  }: {
    id?: string;
    code?: string;
  }): Promise<CampaignCategoryDocument> {
    const filter = {
      ...(id && { _id: id }),
      ...(code && { code }),
    };

    const campaignCategory = await this.campaignCategoryModel
      .findOne(filter)
      .exec();

    return campaignCategory;
  }
}
