import { Test, TestingModule } from '@nestjs/testing';
import { CampaignLaunchService } from './campaign-launch.service';

describe('CampaignLaunchServiceService', () => {
  let service: CampaignLaunchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CampaignLaunchService],
    }).compile();

    service = module.get<CampaignLaunchService>(CampaignLaunchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
