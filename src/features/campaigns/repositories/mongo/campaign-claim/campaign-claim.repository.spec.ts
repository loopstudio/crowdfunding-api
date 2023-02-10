import { Test, TestingModule } from '@nestjs/testing';
import { CampaignClaimService } from './campaign-claim.repository';

describe('CampaignClaimService', () => {
  let service: CampaignClaimService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CampaignClaimService],
    }).compile();

    service = module.get<CampaignClaimService>(CampaignClaimService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
