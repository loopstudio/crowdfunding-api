import { Test, TestingModule } from '@nestjs/testing';

import { CampaignStatusService } from './campaign-statuses.service';
import { CampaignStatusRepository } from '../repositories/mongo/campaign-status.repository';
import {
  mongoBuiltCampaingStatus,
  pendingCampaignStatusMock,
} from '../tests/mocks';
import { CampaignStatusDocument } from '../schemas/campaign-status.schema';

describe('Campaign Statuses Service', () => {
  let campaignStatusesService: CampaignStatusService;
  let campaignStatusesRepository: CampaignStatusRepository;

  const campaignStatusCode = 'pending';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignStatusService,
        {
          provide: CampaignStatusRepository,
          useValue: {
            getStatusByCode: jest.fn(),
          },
        },
      ],
    }).compile();

    campaignStatusesService = module.get<CampaignStatusService>(
      CampaignStatusService,
    );
    campaignStatusesRepository = module.get<CampaignStatusRepository>(
      CampaignStatusRepository,
    );
  });

  describe('campaignStatusesService constructor', () => {
    it('should be defined', () => {
      expect(campaignStatusesService).toBeDefined();
    });
  });

  describe('getStatusByCode method', () => {
    it('should call getStatusByCode without errors', async () => {
      jest
        .spyOn(campaignStatusesRepository, 'getStatusByCode')
        .mockResolvedValue(
          mongoBuiltCampaingStatus as unknown as CampaignStatusDocument,
        );

      const response = await campaignStatusesService.getStatusByCode(
        campaignStatusCode,
      );

      expect(response).toStrictEqual(pendingCampaignStatusMock);
    });
  });
});
