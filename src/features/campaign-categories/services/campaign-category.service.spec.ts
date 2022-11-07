import { Test, TestingModule } from '@nestjs/testing';

import { CampaignCategoriesService } from './campaign-category.service';
import { CampaignCategoriesRepository } from '../repositories/mongo/campaign-category.repository';
import { generalCampaignCategoryMock } from '../tests/mocks';

describe('Campaign Categories Service', () => {
  let campaignCategoriesService: CampaignCategoriesService;
  let campaignCategoriesRepository: CampaignCategoriesRepository;

  const campaignCategoryId = 'general';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignCategoriesService,
        {
          provide: CampaignCategoriesRepository,
          useValue: {
            getById: jest.fn(),
          },
        },
      ],
    }).compile();

    campaignCategoriesService = module.get<CampaignCategoriesService>(
      CampaignCategoriesService,
    );
    campaignCategoriesRepository = module.get<CampaignCategoriesRepository>(
      CampaignCategoriesRepository,
    );
  });

  describe('campaignCategoriesService constructor', () => {
    it('should be defined', () => {
      expect(campaignCategoriesService).toBeDefined();
    });
  });

  describe('areCategoriesValid method', () => {
    it('should call areCategoriesValid with a true return value', async () => {
      jest
        .spyOn(campaignCategoriesRepository, 'getById')
        .mockResolvedValue(generalCampaignCategoryMock);

      const response = await campaignCategoriesService.areCategoriesValid([
        campaignCategoryId,
      ]);

      expect(response).toStrictEqual(true);
    });
  });
});
