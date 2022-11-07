/* eslint-disable @typescript-eslint/no-explicit-any */

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CampaignCategoriesRepository } from './campaign-category.repository';
import { CampaignCategory } from '../../schemas/campaign-category.schema';
import {
  mongoBuiltCampaingCategory,
  generalCampaignCategoryMock,
} from '../../tests/mocks';

describe('Campaign Categories Repository', () => {
  let campaignCategoriesRepository: CampaignCategoriesRepository;
  let campaignCategoryModel: Model<CampaignCategory>;

  const campaignCategoryId = 'general';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignCategoriesRepository,
        {
          provide: getModelToken(CampaignCategory.name),
          useValue: {
            findById: jest.fn(),
            lean: jest.fn(),
          },
        },
      ],
    }).compile();

    campaignCategoryModel = module.get<Model<CampaignCategory>>(
      getModelToken(CampaignCategory.name),
    );
    campaignCategoriesRepository = module.get<CampaignCategoriesRepository>(
      CampaignCategoriesRepository,
    );
  });

  describe('getById method', () => {
    it('should call getById method without errors', async () => {
      jest.spyOn(campaignCategoryModel, 'findById').mockReturnValue({
        lean: jest.fn().mockResolvedValue(mongoBuiltCampaingCategory),
      } as any);

      const response = await campaignCategoriesRepository.getById(
        campaignCategoryId,
      );

      expect(response).toStrictEqual(generalCampaignCategoryMock);
    });
  });
});
