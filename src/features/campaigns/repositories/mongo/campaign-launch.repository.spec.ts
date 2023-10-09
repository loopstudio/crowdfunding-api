/* eslint-disable @typescript-eslint/no-explicit-any */

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CampaignLaunchMongoRepository } from './campaign-launch.repository';
import { CampaignLaunch } from '../../schemas/campaign-launch.schema';
import { mongoCampaignLaunch } from '../../tests/mocks';

describe('Campaign Launch Repository', () => {
  let campaignLaunchRepository: CampaignLaunchMongoRepository;
  let campaignLaunchModel: Model<CampaignLaunch>;

  const campaignId = '1';
  const onchainId = '2';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignLaunchMongoRepository,
        {
          provide: getModelToken(CampaignLaunch.name),
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    campaignLaunchModel = module.get<Model<CampaignLaunch>>(
      getModelToken(CampaignLaunch.name),
    );
    campaignLaunchRepository = module.get<CampaignLaunchMongoRepository>(
      CampaignLaunchMongoRepository,
    );
  });

  describe('create method', () => {
    it('should create campaign launch succesfully', async () => {
      jest
        .spyOn(campaignLaunchModel, 'create')
        .mockReturnValue(mongoCampaignLaunch as any);

      const result = await campaignLaunchRepository.create(
        campaignId,
        onchainId,
      );

      expect(result).toEqual(mongoCampaignLaunch);
    });
  });
});
