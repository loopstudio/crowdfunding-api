import { Test, TestingModule } from '@nestjs/testing';

import { PublicService } from './public.service';
import { checkHealthResponse } from '../tests/mocks';

describe('PublicService', () => {
  let publicService: PublicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicService],
    }).compile();

    publicService = module.get<PublicService>(PublicService);
  });

  it('should be defined', () => {
    expect(publicService).toBeDefined();
  });

  describe('checkHealth method', () => {
    it('should call checkHealth publicService method', () => {
      const response = publicService.checkHealth();

      expect(response).toStrictEqual(checkHealthResponse);
    });
  });
});
