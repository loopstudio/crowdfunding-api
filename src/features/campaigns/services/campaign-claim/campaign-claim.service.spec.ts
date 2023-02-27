/* eslint-disable @typescript-eslint/no-explicit-any */

import { Test, TestingModule } from '@nestjs/testing';

import {
  campaignClaimArgumentMock,
  campaignClaimMock,
  campaignPledgeArgumentMock,
  mongoClaimedCampaingStatus,
  tokenMock,
  userMock,
} from '../../tests/mocks';
import { campaignMock } from 'src/features/users/tests/mocks';
import { CampaignsService } from 'src/features/campaigns/services/campaigns.service';
import { TokensService } from 'src/features/tokens/services/tokens.service';
import { UsersService } from 'src/features/users/services/users.service';
import { CampaignStatusService } from 'src/features/campaign-statuses/services/campaign-statuses.service';
import { CampaignClaimService } from 'src/features/campaigns/services/campaign-claim/campaign-claim.service';
import { CampaignsMongoRepository } from 'src/features/campaigns/repositories/mongo/campaigns.repository';
import { CampaignClaimMongoRepository } from 'src/features/campaigns/repositories/mongo/campaign-claim/campaign-claim.repository';
import { UserCampaignsRepository } from 'src/features/users/repositories/user-campaigns/mongo/user-campaigns.repository';

describe('CampaignClaimService', () => {
  let campaignClaimService: CampaignClaimService;
  let campaignService: CampaignsService;
  let usersService: UsersService;
  let tokensService: TokensService;
  let campaignStatusService: CampaignStatusService;
  let campaignClaimMongoRepository: CampaignClaimMongoRepository;
  let campaignMongoRepository: CampaignsMongoRepository;
  let userCampaignsMongoRepository: UserCampaignsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignClaimService,
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
          provide: CampaignClaimMongoRepository,
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

    campaignClaimService =
      module.get<CampaignClaimService>(CampaignClaimService);
    campaignService = module.get<CampaignsService>(CampaignsService);
    usersService = module.get<UsersService>(UsersService);
    tokensService = module.get<TokensService>(TokensService);
    campaignStatusService = module.get<CampaignStatusService>(
      CampaignStatusService,
    );
    campaignClaimMongoRepository = module.get<CampaignClaimMongoRepository>(
      CampaignClaimMongoRepository,
    );
    campaignMongoRepository = module.get<CampaignsMongoRepository>(
      CampaignsMongoRepository,
    );
    userCampaignsMongoRepository = module.get<UserCampaignsRepository>(
      UserCampaignsRepository,
    );
  });

  it('should be defined', () => {
    expect(campaignClaimService).toBeDefined();
  });

  describe('create method', () => {
    it('should call create method and fails because arguments are not right', async () => {
      await expect(() =>
        campaignClaimService.create('WrongArgument'),
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
        campaignClaimService.create(campaignClaimArgumentMock),
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
        .spyOn(campaignClaimMongoRepository, 'create')
        .mockResolvedValue(campaignClaimMock as any);
      jest
        .spyOn(campaignStatusService, 'getStatusByCode')
        .mockResolvedValue(mongoClaimedCampaingStatus as any);
      jest.spyOn(campaignMongoRepository, 'update').mockResolvedValue(null);
      jest
        .spyOn(userCampaignsMongoRepository, 'updateUserCampaignByEvent')
        .mockResolvedValue(null);

      await expect(() =>
        campaignClaimService.create(campaignPledgeArgumentMock),
      ).not.toThrow();

      expect(campaignService.findOne).toBeCalledTimes(1);
      expect(usersService.findUserByAddress).toBeCalledTimes(1);
      expect(tokensService.getByDefault).toBeCalledTimes(1);
    });
  });
});
