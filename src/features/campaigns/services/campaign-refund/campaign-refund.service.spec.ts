/* eslint-disable @typescript-eslint/no-explicit-any */

import { Test, TestingModule } from '@nestjs/testing';

import { CampaignsService } from '.././campaigns.service';
import { CampaignsMongoRepository } from '../../repositories/mongo/campaigns.repository';
import { TokensService } from 'src/features/tokens/services/tokens.service';
import {
  campaignRefundArgumentMock,
  campaignRefundMock,
  tokenMock,
  userMock,
} from '../../tests/mocks';
import { UsersService } from 'src/features/users/services/users.service';
import { CampaignRefundMongoRepository } from '../../repositories/mongo/campaign-refund/campaign-refund.repository';
import { UserCampaignsRepository } from 'src/features/users/repositories/user-campaigns/mongo/user-campaigns.repository';
import { CampaignRefundService } from './campaign-refund.service';
import { campaignMock } from 'src/features/users/tests/mocks';

describe('CampaignRefundService', () => {
  let campaignRefundService: CampaignRefundService;
  let campaignService: CampaignsService;
  let usersService: UsersService;
  let tokensService: TokensService;
  let campaignRefundMongoRepository: CampaignRefundMongoRepository;
  let userCampaignsMongoRepository: UserCampaignsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignRefundService,
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
          provide: CampaignRefundMongoRepository,
          useValue: {
            create: jest.fn(),
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
            updateUserCampaignByEvent: jest.fn(),
          },
        },
      ],
    }).compile();

    campaignRefundService = module.get<CampaignRefundService>(
      CampaignRefundService,
    );
    campaignService = module.get<CampaignsService>(CampaignsService);
    usersService = module.get<UsersService>(UsersService);
    tokensService = module.get<TokensService>(TokensService);
    campaignRefundMongoRepository = module.get<CampaignRefundMongoRepository>(
      CampaignRefundMongoRepository,
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
        campaignRefundService.create('WrongArgument'),
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
        .spyOn(campaignRefundMongoRepository, 'create')
        .mockResolvedValue(campaignRefundMock as any);
      jest
        .spyOn(userCampaignsMongoRepository, 'updateUserCampaignByEvent')
        .mockResolvedValue(null);

      await expect(() =>
        campaignRefundService.create(campaignRefundArgumentMock),
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
        campaignRefundService.create(campaignRefundArgumentMock),
      ).rejects.toThrow();

      expect(campaignService.findOne).toBeCalledTimes(1);
      expect(usersService.findUserByAddress).toBeCalledTimes(1);
      expect(tokensService.getByDefault).toBeCalledTimes(1);
    });
  });
});
