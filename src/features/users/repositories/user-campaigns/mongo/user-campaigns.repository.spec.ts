/* eslint-disable @typescript-eslint/no-explicit-any */

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserCampaignsRepository } from './user-campaigns.repository';
import { UserCampaign } from 'src/features/users/schemas/user-campaign.schema';
import {
  campaignMock,
  pledgeMock,
  tokenMock,
  userCampaignMock,
  userMock,
} from 'src/features/users/tests/mocks';

describe('UserCampaignsRepository', () => {
  let userCampaignsRepository: UserCampaignsRepository;
  let userCampaignModel: Model<UserCampaign>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCampaignsRepository,
        {
          provide: getModelToken(UserCampaign.name),
          useValue: {
            save: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    userCampaignModel = module.get<Model<UserCampaign>>(
      getModelToken(UserCampaign.name),
    );
    userCampaignsRepository = module.get<UserCampaignsRepository>(
      UserCampaignsRepository,
    );
  });

  describe('updateUserCampaignByPledge method', () => {
    it('should call updateUserCampaignByPledge usersCampaignRepository method without errors for an non existing document', async () => {
      jest.spyOn(userCampaignModel, 'findOne').mockReturnValue(null);
      jest.spyOn(userCampaignModel, 'create').mockReturnValue({
        save: jest.fn(),
      } as any);

      await expect(() =>
        userCampaignsRepository.updateUserCampaignByPledge({
          campaign: campaignMock,
          user: userMock,
          token: tokenMock,
          pledge: pledgeMock,
        }),
      ).not.toThrow();
    });

    it('should call updateUserCampaignByPledge usersCampaignRepository method without errors for an existing document', async () => {
      jest
        .spyOn(userCampaignModel, 'findOne')
        .mockReturnValue(userCampaignMock as any);

      await expect(() =>
        userCampaignsRepository.updateUserCampaignByPledge({
          campaign: campaignMock,
          user: userMock,
          token: tokenMock,
          pledge: pledgeMock,
        }),
      ).not.toThrow();
    });
  });
});
