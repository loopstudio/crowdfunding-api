/* eslint-disable @typescript-eslint/no-explicit-any */

import { Test, TestingModule } from '@nestjs/testing';

import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from '../services/campaigns.service';
import { mongoBuiltCampaign, createCampaignDtoMock } from '../tests/mocks';

describe('Campaigns Controller', () => {
  let campaignsController: CampaignsController;
  let campaignsService: CampaignsService;

  const campignId = '1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignsController],
      providers: [
        {
          provide: CampaignsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    campaignsController = module.get<CampaignsController>(CampaignsController);
    campaignsService = module.get<CampaignsService>(CampaignsService);
  });

  it('campaignsController should be defined', () => {
    expect(campaignsController).toBeDefined();
  });

  describe('findAll method', () => {
    it('should call findAll campaignsService method without errors', async () => {
      jest
        .spyOn(campaignsService, 'findAll')
        .mockResolvedValue({ campaigns: [mongoBuiltCampaign] } as any);

      const response = await campaignsController.findAll();

      expect(response).toStrictEqual({ data: [mongoBuiltCampaign] });
    });
  });

  describe('findOne method', () => {
    it('should call findOne campaignsService method without errors', async () => {
      jest
        .spyOn(campaignsService, 'findOne')
        .mockResolvedValue({ campaign: mongoBuiltCampaign } as any);

      const response = await campaignsController.findOne(campignId);

      expect(response).toStrictEqual({ data: mongoBuiltCampaign });
    });
  });

  describe('create method', () => {
    it('should call create campaignsService method without errors', async () => {
      jest
        .spyOn(campaignsService, 'create')
        .mockResolvedValue({ campaign: mongoBuiltCampaign } as any);

      const response = await campaignsController.create(createCampaignDtoMock);

      expect(response).toStrictEqual({ data: mongoBuiltCampaign });
      expect(campaignsService.create).toBeCalledWith(createCampaignDtoMock);
    });
  });
});
