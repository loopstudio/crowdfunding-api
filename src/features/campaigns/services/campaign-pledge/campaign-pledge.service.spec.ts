/* eslint-disable @typescript-eslint/no-explicit-any */

import { Test, TestingModule } from '@nestjs/testing';

import { CampaignsService } from '.././campaigns.service';
import { CampaignsMongoRepository } from '../../repositories/mongo/campaigns.repository';
import { TokensService } from 'src/features/tokens/services/tokens.service';
import {
  campaignPledgeArgumentMock,
  campaignPledgeMock,
  tokenMock,
  userMock,
} from '../../tests/mocks';
import { UsersService } from 'src/features/users/services/users.service';
import { CampaignPledgeMongoRepository } from '../../repositories/mongo/campaign-pledge/campaign-pledge.repository';
import { UserCampaignsRepository } from 'src/features/users/repositories/user-campaigns/mongo/user-campaigns.repository';
import { CampaignPledgeService } from './campaign-pledge.service';
import { campaignMock } from 'src/features/users/tests/mocks';

describe('CampaignPledgeService', () => {
  let campaignPledgeService: CampaignPledgeService;
  let campaignService: CampaignsService;
  let usersService: UsersService;
  let tokensService: TokensService;
  let campaignPledgeMongoRepository: CampaignPledgeMongoRepository;
  let campaignMongoRepository: CampaignsMongoRepository;
  let userCampaignsMongoRepository: UserCampaignsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignPledgeService,
        {
          provide: CampaignsService,
          useValue: {
            findOne: jest.fn(),
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
          provide: CampaignPledgeMongoRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: CampaignsMongoRepository,
          useValue: {
            updateTokenAmount: jest.fn(),
          },
        },
        {
          provide: UserCampaignsRepository,
          useValue: {
            updateUserCampaignByPledge: jest.fn(),
          },
        },
      ],
    }).compile();

    campaignPledgeService = module.get<CampaignPledgeService>(
      CampaignPledgeService,
    );
    campaignService = module.get<CampaignsService>(CampaignsService);
    usersService = module.get<UsersService>(UsersService);
    tokensService = module.get<TokensService>(TokensService);
    campaignPledgeMongoRepository = module.get<CampaignPledgeMongoRepository>(
      CampaignPledgeMongoRepository,
    );
    campaignMongoRepository = module.get<CampaignsMongoRepository>(
      CampaignsMongoRepository,
    );
    userCampaignsMongoRepository = module.get<UserCampaignsRepository>(
      UserCampaignsRepository,
    );
  });

  describe('create method', () => {
    it('should call create method and fails because arguments are not right', async () => {
      await expect(() =>
        campaignPledgeService.create('WrongArgument'),
      ).rejects.toThrow();
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
        .spyOn(campaignPledgeMongoRepository, 'create')
        .mockResolvedValue(campaignPledgeMock as any);
      jest
        .spyOn(campaignMongoRepository, 'updateTokenAmount')
        .mockResolvedValue(null);
      jest
        .spyOn(userCampaignsMongoRepository, 'updateUserCampaignByPledge')
        .mockResolvedValue(null);

      await expect(() =>
        campaignPledgeService.create(campaignPledgeArgumentMock),
      ).not.toThrow();

      expect(campaignService.findOne).toBeCalledTimes(1);
      expect(usersService.findUserByAddress).toBeCalledTimes(1);
      expect(tokensService.getByDefault).toBeCalledTimes(1);
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
        campaignPledgeService.create(campaignPledgeArgumentMock),
      ).rejects.toThrow();

      expect(campaignService.findOne).toBeCalledTimes(1);
      expect(usersService.findUserByAddress).toBeCalledTimes(1);
      expect(tokensService.getByDefault).toBeCalledTimes(1);
    });
  });

  describe('findAllByUser', () => {
    it('should return campaigns', async () => {
      const campaigns = [
        {
          _id: '63e3cf5e686d726c68efa3fa',
          title: 'My campaign',
          userId: 'user-1',
        },
        {
          _id: '63e3cf5e686d726c68efa3fb',
          title: 'My campaign2',
          userId: 'user-1',
        },
      ];
      jest
        .spyOn(campaignPledgeMongoRepository, 'findAll')
        .mockResolvedValue(campaigns);

      const result = await campaignPledgeService.findAllByUser({
        page: 1,
        size: 10,
        userId: 'user-1',
      });

      expect(result).toEqual(campaigns);
    });
  });
});
