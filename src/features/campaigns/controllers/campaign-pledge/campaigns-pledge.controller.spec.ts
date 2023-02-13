import { Test, TestingModule } from '@nestjs/testing';

import { CampaignPledgeService } from '../../services/campaign-pledge/campaign-pledge.service';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'src/common/constants';
import { CampaignsPledgeController } from './campaigns-pledge.controller';

const request = { user: { id: 'user-1' } };

describe('CampaignsPledge Controller', () => {
  let controller: CampaignsPledgeController;
  let campaignPledgeService: CampaignPledgeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignsPledgeController],
      providers: [
        {
          provide: CampaignPledgeService,
          useValue: {
            findAllByUser: jest.fn(),
          },
        },
      ],
    }).compile();

    campaignPledgeService = module.get<CampaignPledgeService>(
      CampaignPledgeService,
    );
    controller = module.get<CampaignsPledgeController>(
      CampaignsPledgeController,
    );
  });

  it('should call campaignPledgeService.findAllByUser with the user from the request and the provided size and page', async () => {
    const size = 10;
    const page = 1;
    const expectedParams = {
      page,
      size,
      user: { id: 'user-1' },
    };

    await controller.findAllByUser(request, size, page);

    expect(campaignPledgeService.findAllByUser).toHaveBeenCalledWith(
      expectedParams,
    );
  });

  it('should call campaignPledgeService.findAllByUser with the user from the request and the default size and page when size and page are not provided', async () => {
    const expectedParams = {
      page: DEFAULT_PAGE,
      size: DEFAULT_PAGE_SIZE,
      user: { id: 'user-1' },
    };

    await controller.findAllByUser(request);

    expect(campaignPledgeService.findAllByUser).toHaveBeenCalledWith(
      expectedParams,
    );
  });
});
