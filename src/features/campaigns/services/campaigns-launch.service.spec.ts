/* eslint-disable @typescript-eslint/no-explicit-any */

import { Test, TestingModule } from '@nestjs/testing';

import { CampaignsService } from './campaigns.service';
import { CampaignsMongoRepository } from '../repositories/mongo/campaigns.repository';

import { TokenRepository } from 'src/features/tokens/repositories/mongo/tokens.repository';
import { CampaignLaunchService } from './campaign-launch.service';
import { CampaignLaunchMongoRepository } from '../repositories/mongo/campaign-launch.repository';
import { CampaignStatusRepository } from 'src/features/campaign-statuses/repositories/mongo/campaign-status.repository';
import {
  launchEventData,
  mongoBuiltCampaign,
  mongoCampaignLaunch,
  mongoLaunchedCampaign,
} from '../tests/mocks';
import { mongoBuiltToken } from 'src/features/tokens/tests/mocks';

import { UpdateCampaignDto } from '../dto/update-campaign.dto';
import { mongoLaunchedCampaingStatus } from 'src/features/campaign-statuses/tests/mocks';

describe('Campaign Launch Service', () => {
  let campaignLaunchService: CampaignLaunchService;
  let campaignService: CampaignsService;
  let campaignLaunchMongoRepository: CampaignLaunchMongoRepository;
  let campaignStatusRepository: CampaignStatusRepository;
  let tokenRepository: TokenRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignLaunchService,
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
          provide: CampaignLaunchMongoRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: TokenRepository,
          useValue: {
            getByDefault: jest.fn(),
          },
        },
        {
          provide: CampaignStatusRepository,
          useValue: {
            getStatusByCode: jest.fn(),
          },
        },
        {
          provide: CampaignsService,
          useValue: {
            findByLaunchEvent: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    campaignLaunchService = module.get<CampaignLaunchService>(
      CampaignLaunchService,
    );

    campaignService = module.get<CampaignsService>(CampaignsService);
    campaignLaunchMongoRepository = module.get<CampaignLaunchMongoRepository>(
      CampaignLaunchMongoRepository,
    );
    campaignStatusRepository = module.get<CampaignStatusRepository>(
      CampaignStatusRepository,
    );
    tokenRepository = module.get<TokenRepository>(TokenRepository);
  });

  it('CampaignLaunchService should be defined', () => {
    expect(campaignLaunchService).toBeDefined();
  });

  describe('create method', () => {
    it('should throw an error if EventData is not an array', async () => {
      const eventData = 'test';

      await expect(
        campaignLaunchService.create(eventData as any),
      ).rejects.toThrowError();
    });

    it('Sould update status and onchainId succesfully', async () => {
      jest
        .spyOn(campaignLaunchMongoRepository, 'create')
        .mockReturnValue(mongoCampaignLaunch as any);
      jest
        .spyOn(campaignService, 'findByLaunchEvent')
        .mockReturnValue({ campaign: mongoBuiltCampaign } as any);
      jest
        .spyOn(campaignService, 'update')
        .mockReturnValue(mongoLaunchedCampaign as any);
      jest
        .spyOn(campaignStatusRepository, 'getStatusByCode')
        .mockReturnValue(mongoLaunchedCampaingStatus as any);
      jest
        .spyOn(tokenRepository, 'getByDefault')
        .mockReturnValue(mongoBuiltToken as any);

      await campaignLaunchService.create(launchEventData);

      const [onchainId, goal, creator, startDate, endDate] = launchEventData;

      expect(campaignService.findByLaunchEvent).toBeCalledWith(
        creator,
        goal,
        mongoBuiltToken._id,
        startDate,
        endDate,
      );

      const updateCampaignDto: UpdateCampaignDto = {
        status: mongoLaunchedCampaign.status,
        onchainId,
      };

      expect(campaignService.update).toBeCalledWith({
        id: mongoBuiltCampaign._id,
        updateCampaignDto,
      });
    });
  });
});
