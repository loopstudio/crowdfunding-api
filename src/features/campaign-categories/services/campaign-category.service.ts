import { Injectable } from '@nestjs/common';

import { CampaignCategoriesRepository } from '../repositories/mongo/campaign-category.repository';
import { CampaignCategory } from '../schemas/campaign-category.schema';

@Injectable()
export class CampaignCategoriesService {
  constructor(
    private campaignCategoryRepository: CampaignCategoriesRepository,
  ) {}

  private async getById(id: string): Promise<CampaignCategory> {
    const campaignCategory = await this.campaignCategoryRepository.getById(id);
    return campaignCategory;
  }

  async areCategoriesValid(ids: string[]): Promise<boolean> {
    const campaignCategoryPromises = ids.map((campaignCategoryId) => {
      return this.getById(campaignCategoryId);
    });

    const campaignCategorys = await Promise.all(campaignCategoryPromises);
    const someNullCampaignCategory = campaignCategorys.some(
      (campaignCategory) => campaignCategory === null,
    );

    return !someNullCampaignCategory;
  }
}
