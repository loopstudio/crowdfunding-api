import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { EthersService } from './events.service';

describe('EthersService', () => {
  let service: EthersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EthersService, ConfigService],
    }).compile();

    service = module.get<EthersService>(EthersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
