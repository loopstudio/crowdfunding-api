import { Test, TestingModule } from '@nestjs/testing';
import { CampaignPledgeService } from '../../services/campaign-pledge/campaign-pledge.service';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'src/common/constants';
import { CampaignsPledgeController } from './campaigns-pledge.controller';

describe('CampaignsPledge Controller', () => {
  let controller: CampaignsPledgeController;
  let campaignPledgeService: CampaignPledgeService;

  beforeEach(async () => {
    campaignPledgeService = {
      findAllByUser: jest.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignsPledgeController],
      providers: [
        {
          provide: CampaignPledgeService,
          useValue: campaignPledgeService,
        },
      ],
    }).compile();

    controller = module.get<CampaignsPledgeController>(
      CampaignsPledgeController,
    );
  });

  it('should call campaignPledgeService.findAllByUser with the user from the request and the provided size and page', async () => {
    const request = { user: { id: 'user-1' } };
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
    const request = { user: { id: 'user-1' } };
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
