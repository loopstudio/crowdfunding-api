/* eslint-disable @typescript-eslint/no-explicit-any */

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { CampaignsService } from './campaigns.service';
import { CampaignsMongoRepository } from '../repositories/mongo/campaigns.repository';
import { TokensService } from 'src/features/tokens/services/tokens.service';
import { CampaignCategoriesService } from 'src/features/campaign-categories/services/campaign-category.service';
import { CampaignStatusService } from 'src/features/campaign-statuses/services/campaign-statuses.service';
import {
  campaignLaunchEventDto,
  createCampaignDtoMock,
  findCampaignToLaunchData,
  mongoBuiltCampaign,
  mongoBuiltUpdatedCampaign,
  updateCampaignDtoMock,
} from '../tests/mocks';
import { mongoBuiltCampaingStatus } from 'src/features/campaign-statuses/tests/mocks';
import { mongoBuiltCampaingCategory } from 'src/features/campaign-categories/tests/mocks';
import { UsersRepository } from 'src/features/users/repositories/users/mongo/users.repository';

describe('UsersService', () => {
  let campaignService: CampaignsService;
  let campaignsRepository: CampaignsMongoRepository;
  let tokenService: TokensService;
  let campaignStatusService: CampaignStatusService;
  let campaignCategoriesService: CampaignCategoriesService;
  let usersRepository: UsersRepository;

  const campaignId = '1';
  const pendingStatusId = '63611e68143b8def9c4843cf';
  const ownerId = '634dd92c34361cf5a21fb96b';

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
            update: jest.fn(),
            findByLaunchEvent: jest.fn(),
          },
        },
        {
          provide: UsersRepository,
          useValue: {
            findByAddress: jest.fn(),
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
            getByIdOrCode: jest.fn(),
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
    usersRepository = module.get<UsersRepository>(UsersRepository);
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
        .spyOn(campaignCategoriesService, 'getByIdOrCode')
        .mockResolvedValue(null);

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
        .spyOn(campaignCategoriesService, 'getByIdOrCode')
        .mockResolvedValue(mongoBuiltCampaingCategory as any);
      jest
        .spyOn(campaignsRepository, 'create')
        .mockResolvedValue(mongoBuiltCampaign as any);

      const response = await campaignService.create(createCampaignDtoMock);

      expect(response).toStrictEqual({ campaign: mongoBuiltCampaign });
      expect(tokenService.areTokensValid).toBeCalledTimes(1);
      expect(campaignStatusService.getStatusByCode).toBeCalledTimes(1);
      expect(campaignCategoriesService.getByIdOrCode).toBeCalledTimes(1);
      expect(campaignsRepository.create).toBeCalledWith({
        dto: createCampaignDtoMock,
        pendingStatusId: mongoBuiltCampaingStatus._id,
      });
    });
  });

  describe('update method', () => {
    it('should call update and return a campaign', async () => {
      jest
        .spyOn(campaignsRepository, 'update')
        .mockResolvedValue(mongoBuiltUpdatedCampaign as any);

      const response = await campaignService.update({
        id: campaignId,
        updateCampaignDto: updateCampaignDtoMock,
      });

      expect(response).toStrictEqual({ campaign: mongoBuiltUpdatedCampaign });
      expect(campaignsRepository.update).toBeCalledWith({
        id: campaignId,
        updateCampaignDto: updateCampaignDtoMock,
      });
    });
  });

  describe('findByLaunchEvent method', () => {
    it('Should find by launch event succesfully', async () => {
      jest
        .spyOn(campaignsRepository, 'findByLaunchEvent')
        .mockResolvedValue([mongoBuiltCampaign] as any);

      jest
        .spyOn(usersRepository, 'findByAddress')
        .mockResolvedValue({ _id: ownerId } as any);

      jest
        .spyOn(campaignStatusService, 'getStatusByCode')
        .mockResolvedValue({ _id: pendingStatusId } as any);

      const response = await campaignService.findByLaunchEvent(
        campaignLaunchEventDto,
      );

      expect(response).toStrictEqual({ campaign: [mongoBuiltCampaign] });
      expect(campaignsRepository.findByLaunchEvent).toBeCalledWith(
        findCampaignToLaunchData,
      );
    });
    it('Should throw NotFoundException if creator is not an user', async () => {
      jest.spyOn(usersRepository, 'findByAddress').mockResolvedValue(null);

      await expect(
        campaignService.findByLaunchEvent(campaignLaunchEventDto),
      ).rejects.toThrowError(NotFoundException);
    });

    it('Should throw NotFoundException if pending status is not present', async () => {
      jest
        .spyOn(usersRepository, 'findByAddress')
        .mockResolvedValue({ _id: ownerId } as any);

      jest
        .spyOn(campaignStatusService, 'getStatusByCode')
        .mockResolvedValue(null);

      await expect(
        campaignService.findByLaunchEvent(campaignLaunchEventDto),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
