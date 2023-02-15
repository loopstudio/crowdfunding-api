/* eslint-disable @typescript-eslint/no-explicit-any */

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserCampaignsRepository } from './user-campaigns.repository';
import { UserCampaign } from 'src/features/users/schemas/user-campaign.schema';
import {
  campaignMock,
  claimMock,
  pledgeMock,
  tokenMock,
  userCampaignMock,
  userMock,
} from 'src/features/users/tests/mocks';
import { CrowdfundingEvent } from 'src/features/events/types';

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

  describe('updateUserCampaignByEvent method when pledging', () => {
    it('should call updateUserCampaignByEvent usersCampaignRepository method without errors for an non existing document', async () => {
      jest.spyOn(userCampaignModel, 'findOne').mockReturnValue(null);
      jest.spyOn(userCampaignModel, 'create').mockReturnValue({
        pledges: [],
        totalPledged: '0',
        save: jest.fn(),
      } as any);

      await expect(() =>
        userCampaignsRepository.updateUserCampaignByEvent({
          campaign: campaignMock,
          user: userMock,
          token: tokenMock,
          eventType: CrowdfundingEvent.Pledge,
          event: pledgeMock,
        }),
      ).not.toThrow();
    });

    it('should call updateUserCampaignByEvent usersCampaignRepository method without errors for an existing document', async () => {
      jest
        .spyOn(userCampaignModel, 'findOne')
        .mockReturnValue(userCampaignMock as any);

      await expect(() =>
        userCampaignsRepository.updateUserCampaignByEvent({
          campaign: campaignMock,
          user: userMock,
          token: tokenMock,
          eventType: CrowdfundingEvent.Pledge,
          event: pledgeMock,
        }),
      ).not.toThrow();
    });
  });

  describe('updateUserCampaignByEvent method when pledging', () => {
    it('should call updateUserCampaignByEvent usersCampaignRepository method without errors for an non existing document', async () => {
      jest.spyOn(userCampaignModel, 'findOne').mockReturnValue(null);
      jest.spyOn(userCampaignModel, 'create').mockReturnValue({
        claims: [],
        totalClaimed: '0',
        save: jest.fn(),
      } as any);

      await expect(() =>
        userCampaignsRepository.updateUserCampaignByEvent({
          campaign: campaignMock,
          user: userMock,
          token: tokenMock,
          eventType: CrowdfundingEvent.Claim,
          event: claimMock,
        }),
      ).not.toThrow();
    });

    it('should call updateUserCampaignByEvent usersCampaignRepository method without errors for an existing document', async () => {
      jest
        .spyOn(userCampaignModel, 'findOne')
        .mockReturnValue(userCampaignMock as any);

      await expect(() =>
        userCampaignsRepository.updateUserCampaignByEvent({
          campaign: campaignMock,
          user: userMock,
          token: tokenMock,
          eventType: CrowdfundingEvent.Claim,
          event: claimMock,
        }),
      ).not.toThrow();
    });
  });
});
