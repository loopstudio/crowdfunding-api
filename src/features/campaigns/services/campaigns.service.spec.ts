/* eslint-disable @typescript-eslint/no-explicit-any */

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { CampaignsService } from './campaigns.service';
import { CampaignsMongoRepository } from '../repositories/mongo/campaigns.repository';
import { TokensService } from 'src/features/tokens/services/tokens.service';
import { CampaignCategoriesService } from 'src/features/campaign-categories/services/campaign-category.service';
import { CampaignStatusService } from 'src/features/campaign-statuses/services/campaign-statuses.service';
import { createCampaignDtoMock, mongoBuiltCampaign } from '../tests/mocks';
import { mongoBuiltCampaingStatus } from 'src/features/campaign-statuses/tests/mocks';
import { mongoBuiltCampaingCategory } from 'src/features/campaign-categories/tests/mocks';

describe('UsersService', () => {
  let campaignService: CampaignsService;
  let campaignsRepository: CampaignsMongoRepository;
  let tokenService: TokensService;
  let campaignStatusService: CampaignStatusService;
  let campaignCategoriesService: CampaignCategoriesService;

  const campaignId = '1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignsService,
        {
          provide: CampaignsMongoRepository,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: TokensService,
          useValue: {
            areTokensValid: jest.fn(),
          },
        },
        {
          provide: CampaignCategoriesService,
          useValue: {
            areCategoriesValid: jest.fn(),
          },
        },
        {
          provide: CampaignStatusService,
          useValue: {
            getStatusByCode: jest.fn(),
          },
        },
      ],
    }).compile();

    campaignService = module.get<CampaignsService>(CampaignsService);
    campaignsRepository = module.get<CampaignsMongoRepository>(
      CampaignsMongoRepository,
    );
    tokenService = module.get<TokensService>(TokensService);
    campaignStatusService = module.get<CampaignStatusService>(
      CampaignStatusService,
    );
    campaignCategoriesService = module.get<CampaignCategoriesService>(
      CampaignCategoriesService,
    );
  });

  it('campaignService should be defined', () => {
    expect(campaignService).toBeDefined();
  });

  describe('findAll method', () => {
    it('should call findAll and return an array of campaigns', async () => {
      const findAllArguments = { page: 0, size: 1 };

      jest
        .spyOn(campaignsRepository, 'findAll')
        .mockResolvedValue([mongoBuiltCampaign] as any);

      const response = await campaignService.findAll(findAllArguments);

      expect(response).toStrictEqual({ campaigns: [mongoBuiltCampaign] });
      expect(campaignsRepository.findAll).toBeCalledWith(findAllArguments);
    });
  });

  describe('findOne method', () => {
    it('should call findOne and return a campaign', async () => {
      jest
        .spyOn(campaignsRepository, 'findOne')
        .mockResolvedValue(mongoBuiltCampaign as any);

      const response = await campaignService.findOne(campaignId);

      expect(response).toStrictEqual({ campaign: mongoBuiltCampaign });
      expect(campaignsRepository.findOne).toBeCalledWith(campaignId);
    });
  });

  describe('create method', () => {
    it('should call create and fails with BadRequestException because tokens are not valid', async () => {
      jest.spyOn(tokenService, 'areTokensValid').mockResolvedValue(false);

      await expect(
        campaignService.create(createCampaignDtoMock),
      ).rejects.toThrowError(BadRequestException);
    });

    it("should call create and fails with BadRequestException because pending status doesn't exists", async () => {
      jest.spyOn(tokenService, 'areTokensValid').mockResolvedValue(true);
      jest
        .spyOn(campaignStatusService, 'getStatusByCode')
        .mockResolvedValue(null);

      await expect(
        campaignService.create(createCampaignDtoMock),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should call create and fails with BadRequestException because category is not valid', async () => {
      jest.spyOn(tokenService, 'areTokensValid').mockResolvedValue(true);
      jest
        .spyOn(campaignStatusService, 'getStatusByCode')
        .mockResolvedValue({} as any);
      jest
        .spyOn(campaignCategoriesService, 'areCategoriesValid')
        .mockResolvedValue(false);

      await expect(
        campaignService.create(createCampaignDtoMock),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should call create and fails with BadRequestException because category is not valid', async () => {
      jest.spyOn(tokenService, 'areTokensValid').mockResolvedValue(true);
      jest
        .spyOn(campaignStatusService, 'getStatusByCode')
        .mockResolvedValue(mongoBuiltCampaingStatus as any);
      jest
        .spyOn(campaignCategoriesService, 'areCategoriesValid')
        .mockResolvedValue(mongoBuiltCampaingCategory as any);
      jest
        .spyOn(campaignsRepository, 'create')
        .mockResolvedValue(mongoBuiltCampaign as any);

      const response = await campaignService.create(createCampaignDtoMock);

      expect(response).toStrictEqual({ campaign: mongoBuiltCampaign });
      expect(tokenService.areTokensValid).toBeCalledTimes(1);
      expect(campaignStatusService.getStatusByCode).toBeCalledTimes(1);
      expect(campaignCategoriesService.areCategoriesValid).toBeCalledTimes(1);
      expect(campaignsRepository.create).toBeCalledWith({
        dto: createCampaignDtoMock,
        pendingStatusId: mongoBuiltCampaingStatus._id,
      });
    });
  });
});
