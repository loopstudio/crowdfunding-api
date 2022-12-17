/* eslint-disable @typescript-eslint/no-explicit-any */

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CampaignsMongoRepository } from './campaigns.repository';
import { Campaign } from '../../schemas/campaign.schema';
import {
  createCampaignDtoMock,
  mongoBuiltCampaign,
  mongoBuiltUpdatedCampaign,
  updateCampaignDtoMock,
} from '../../tests/mocks';

describe('Campaign Statuses Repository', () => {
  let campaignsRepository: CampaignsMongoRepository;
  let campaignModel: Model<Campaign>;

  const campaignId = '1';
  const pendingStatusId = '63611e68143b8def9c4843cf';
  const generalCategoryId = 'abc123';
  const amount = '1000000000000000000';
  const ownerId = '634dd92c34361cf5a21fb96b';
  const tokenAddress = '0xF2f5C73fa04406b1995e397B55c24aB1f3eA726C';
  const startDate = '1667754096';
  const endDate = '1667757636';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignsMongoRepository,
        {
          provide: getModelToken(Campaign.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            sort: jest.fn(),
            skip: jest.fn(),
            limit: jest.fn(),
            lean: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    campaignModel = module.get<Model<Campaign>>(getModelToken(Campaign.name));
    campaignsRepository = module.get<CampaignsMongoRepository>(
      CampaignsMongoRepository,
    );
  });

  describe('findAll method', () => {
    it('should call findAll method with page 0 and size 1', async () => {
      jest.spyOn(campaignModel, 'find').mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([mongoBuiltCampaign]),
      } as any);

      const response = await campaignsRepository.findAll({ page: 0, size: 1 });

      expect(response).toStrictEqual([mongoBuiltCampaign]);
    });

    it('should call findAll method with page 1 and size 1', async () => {
      jest.spyOn(campaignModel, 'find').mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([mongoBuiltCampaign]),
      } as any);

      const response = await campaignsRepository.findAll({ page: 1, size: 1 });

      expect(response).toStrictEqual([mongoBuiltCampaign]);
    });
  });

  describe('findOne method', () => {
    it('should call findOne and throw NotFoundException', async () => {
      jest.spyOn(campaignModel, 'findOne').mockResolvedValue(null);

      await expect(
        campaignsRepository.findOne(campaignId),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should call findAll and return related campaign', async () => {
      jest
        .spyOn(campaignModel, 'findOne')
        .mockResolvedValue(mongoBuiltCampaign);

      const response = await campaignsRepository.findOne(campaignId);

      expect(response).toStrictEqual(mongoBuiltCampaign);
    });
  });

  describe('create method', () => {
    it('should call create method and create a new campaign', async () => {
      jest
        .spyOn(campaignModel, 'create')
        .mockReturnValue(mongoBuiltCampaign as any);

      const response = await campaignsRepository.create({
        dto: createCampaignDtoMock,
        pendingStatusId,
        generalCategoryId,
      });

      expect(response).toStrictEqual(mongoBuiltCampaign);
    });
  });

  describe('update method', () => {
    it('should call update method and fails because campaign does not exist', async () => {
      jest.spyOn(campaignModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        campaignsRepository.update({
          id: campaignId,
          updateCampaignDto: updateCampaignDtoMock,
        }),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should call update method and return an updated campaign', async () => {
      const modifiedMongoBuiltUpdatedCampaign = mongoBuiltUpdatedCampaign;
      delete modifiedMongoBuiltUpdatedCampaign.save;

      jest.spyOn(campaignModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mongoBuiltCampaign),
      } as any);

      const response = await campaignsRepository.update({
        id: campaignId,
        updateCampaignDto: updateCampaignDtoMock,
      });
      delete response.save;

      expect(response).toStrictEqual(mongoBuiltUpdatedCampaign);
    });
  });

  describe('findByLaunchEvent', () => {
    it('Should find by launch event', async () => {
      jest.spyOn(campaignModel, 'findOne').mockReturnValue({
        sort: jest.fn().mockResolvedValue(mongoBuiltCampaign),
      } as any);

      const response = await campaignsRepository.findByLaunchEvent(
        ownerId,
        amount,
        tokenAddress,
        pendingStatusId,
        startDate,
        endDate,
      );

      expect(response).toStrictEqual(mongoBuiltCampaign);
    });
    it('Should throw NotFoundException', async () => {
      jest.spyOn(campaignModel, 'findOne').mockReturnValue({
        sort: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        campaignsRepository.findByLaunchEvent(
          ownerId,
          amount,
          tokenAddress,
          pendingStatusId,
          startDate,
          endDate,
        ),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
