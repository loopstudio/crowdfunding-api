/* eslint-disable @typescript-eslint/no-explicit-any */

import { Test, TestingModule } from '@nestjs/testing';

import {
  campaignCancelArgumentMock,
  campaignCancelMock,
  mongoCancelCampaingStatus,
  tokenMock,
  userMock,
} from '../../tests/mocks';
import { campaignMock } from 'src/features/users/tests/mocks';
import { CampaignsService } from 'src/features/campaigns/services/campaigns.service';
import { TokensService } from 'src/features/tokens/services/tokens.service';
import { UsersService } from 'src/features/users/services/users.service';
import { CampaignStatusService } from 'src/features/campaign-statuses/services/campaign-statuses.service';
import { CampaignsMongoRepository } from 'src/features/campaigns/repositories/mongo/campaigns.repository';
import { UserCampaignsRepository } from 'src/features/users/repositories/user-campaigns/mongo/user-campaigns.repository';
import { CampaignCancelMongoRepository } from '../../repositories/mongo/campaign-cancel/campaign-cancel.repository';
import { CampaignCancelService } from './campaign-cancel.service';

describe('CampaignCancelService', () => {
  let campaignCancelService: CampaignCancelService;
  let campaignService: CampaignsService;
  let usersService: UsersService;
  let tokensService: TokensService;
  let campaignStatusService: CampaignStatusService;
  let campaignCancelMongoRepository: CampaignCancelMongoRepository;
  let campaignMongoRepository: CampaignsMongoRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignCancelService,
        {
          provide: CampaignsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: CampaignStatusService,
          useValue: {
            getStatusByCode: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findUserByAddress: jest.fn(),
          },
        },
        {
          provide: TokensService,
          useValue: {
            getByDefault: jest.fn(),
          },
        },
        {
          provide: CampaignCancelMongoRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: CampaignsMongoRepository,
          useValue: {
            update: jest.fn(),
          },
        },
        {
          provide: UserCampaignsRepository,
          useValue: {
            updateUserCampaignByEvent: jest.fn(),
          },
        },
      ],
    }).compile();

    campaignCancelService = module.get<CampaignCancelService>(
      CampaignCancelService,
    );
    campaignService = module.get<CampaignsService>(CampaignsService);
    usersService = module.get<UsersService>(UsersService);
    tokensService = module.get<TokensService>(TokensService);
    campaignStatusService = module.get<CampaignStatusService>(
      CampaignStatusService,
    );
    campaignCancelMongoRepository = module.get<CampaignCancelMongoRepository>(
      CampaignCancelMongoRepository,
    );
    campaignMongoRepository = module.get<CampaignsMongoRepository>(
      CampaignsMongoRepository,
    );
  });

  describe('create method', () => {
    it('should call create method and fails because arguments are not right', async () => {
      await expect(() =>
        campaignCancelService.create('WrongArgument'),
      ).rejects.toThrow();
    });

    it('should call create method and fails because there is no associated campaign', async () => {
      jest.spyOn(campaignService, 'findOne').mockResolvedValue(null as any);
      jest
        .spyOn(usersService, 'findUserByAddress')
        .mockResolvedValue(userMock as any);
      jest
        .spyOn(tokensService, 'getByDefault')
        .mockResolvedValue(tokenMock as any);

      await expect(() =>
        campaignCancelService.create(campaignCancelArgumentMock),
      ).rejects.toThrow();

      expect(campaignService.findOne).toBeCalledTimes(1);
      expect(usersService.findUserByAddress).toBeCalledTimes(1);
      expect(tokensService.getByDefault).toBeCalledTimes(1);
    });

    it('should call create method without errors', async () => {
      jest
        .spyOn(campaignService, 'findOne')
        .mockResolvedValue({ campaign: campaignMock } as any);
      jest
        .spyOn(usersService, 'findUserByAddress')
        .mockResolvedValue(userMock as any);
      jest
        .spyOn(tokensService, 'getByDefault')
        .mockResolvedValue(tokenMock as any);
      jest
        .spyOn(campaignCancelMongoRepository, 'create')
        .mockResolvedValue(campaignCancelMock as any);
      jest
        .spyOn(campaignStatusService, 'getStatusByCode')
        .mockResolvedValue(mongoCancelCampaingStatus as any);
      jest.spyOn(campaignMongoRepository, 'update').mockResolvedValue(null);

      await expect(() =>
        campaignCancelService.create(campaignCancelArgumentMock),
      ).not.toThrow();

      expect(campaignService.findOne).toBeCalledTimes(1);
      expect(usersService.findUserByAddress).toBeCalledTimes(1);
      expect(tokensService.getByDefault).toBeCalledTimes(1);
    });
  });
});
