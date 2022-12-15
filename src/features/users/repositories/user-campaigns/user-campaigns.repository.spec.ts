import { Test, TestingModule } from '@nestjs/testing';
import { UserCampaignsService } from './user-campaigns.repository';

describe('UserCampaignsService', () => {
  let service: UserCampaignsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserCampaignsService],
    }).compile();

    service = module.get<UserCampaignsService>(UserCampaignsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
