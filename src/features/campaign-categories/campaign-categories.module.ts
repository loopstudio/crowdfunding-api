import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CampaignCategoriesService } from './services/campaign-category.service';
import { CampaignCategoriesRepository } from './repositories/mongo/campaign-category.repository';
import {
  CampaignCategory,
  CampaignCategorySchema,
} from './schemas/campaign-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CampaignCategory.name,
        schema: CampaignCategorySchema,
      },
    ]),
  ],
  providers: [CampaignCategoriesService, CampaignCategoriesRepository],
  exports: [CampaignCategoriesService, CampaignCategoriesRepository],
})
export class CampaignCategoriesModule {}
