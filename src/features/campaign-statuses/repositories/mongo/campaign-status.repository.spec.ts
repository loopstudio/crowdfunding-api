import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CampaignStatusRepository } from './campaign-status.repository';
import { CampaignStatus } from '../../schemas/campaign-status.schema';
import {
  mongoBuiltCampaingStatus,
  pendingCampaignStatusMock,
} from '../../tests/mocks';

describe('Campaign Statuses Repository', () => {
  let campaignStatusesRepository: CampaignStatusRepository;
  let campaignStatusModel: Model<CampaignStatus>;

  const campaignStatusId = 'pending';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignStatusRepository,
        {
          provide: getModelToken(CampaignStatus.name),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    campaignStatusModel = module.get<Model<CampaignStatus>>(
      getModelToken(CampaignStatus.name),
    );
    campaignStatusesRepository = module.get<CampaignStatusRepository>(
      CampaignStatusRepository,
    );
  });

  describe('getStatusByCode method', () => {
    it('should call getStatusByCode method without errors', async () => {
      jest
        .spyOn(campaignStatusModel, 'findOne')
        .mockResolvedValue(mongoBuiltCampaingStatus);

      const response = await campaignStatusesRepository.getStatusByCode(
        campaignStatusId,
      );

      expect(response).toStrictEqual(pendingCampaignStatusMock);
    });
  });
});
