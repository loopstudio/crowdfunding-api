import { Injectable } from '@nestjs/common';

import { CampaignCategoriesRepository } from '../repositories/mongo/campaign-category.repository';
import { CampaignCategoryDocument } from '../schemas/campaign-category.schema';

@Injectable()
export class CampaignCategoriesService {
  constructor(
    private campaignCategoryRepository: CampaignCategoriesRepository,
  ) {}

  async getByIdOrCode({
    id,
    code,
  }: {
    id?: string;
    code?: string;
  }): Promise<CampaignCategoryDocument> {
    const campaignCategory =
      await this.campaignCategoryRepository.getByIdOrCode({ id, code });

    return campaignCategory;
  }

  async areCategoriesValid(ids: string[]): Promise<boolean> {
    const campaignCategoryPromises = ids.map((campaignCategoryId) => {
      return this.getByIdOrCode({ id: campaignCategoryId });
    });

    const campaignCategorys = await Promise.all(campaignCategoryPromises);
    const someNullCampaignCategory = campaignCategorys.some(
      (campaignCategory) => campaignCategory === null,
    );

    return !someNullCampaignCategory;
  }
}
