/* eslint-disable @typescript-eslint/no-explicit-any */

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CampaignCategoriesRepository } from './campaign-category.repository';
import { CampaignCategory } from '../../schemas/campaign-category.schema';
import { mongoBuiltCampaingCategory } from '../../tests/mocks';

describe('Campaign Categories Repository', () => {
  let campaignCategoriesRepository: CampaignCategoriesRepository;
  let campaignCategoryModel: Model<CampaignCategory>;

  const campaignCategoryCode = 'general';
  const campaignCategoryId = '123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignCategoriesRepository,
        {
          provide: getModelToken(CampaignCategory.name),
          useValue: {
            findOne: jest.fn(),
            exec: jest.fn(),
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
      jest.spyOn(campaignCategoryModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mongoBuiltCampaingCategory),
      } as any);

      const response = await campaignCategoriesRepository.getByIdOrCode({
        code: campaignCategoryCode,
        id: campaignCategoryId,
      });

      expect(response).toStrictEqual(mongoBuiltCampaingCategory);
    });
  });
});
