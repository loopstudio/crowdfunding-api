import { Test, TestingModule } from '@nestjs/testing';

import { PublicController } from './public.controller';
import { PublicService } from '../services/public.service';
import { checkHealthResponse } from '../tests/mocks';

describe('PublicController', () => {
  let publicController: PublicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicController],
      providers: [
        {
          provide: PublicService,
          useValue: {
            checkHealth: jest.fn().mockResolvedValue(checkHealthResponse),
          },
        },
      ],
    }).compile();

    publicController = module.get<PublicController>(PublicController);
  });

  it('publicController should be defined', () => {
    expect(publicController).toBeDefined();
  });

  describe('checkHealth method', () => {
    it('should call checkHealth publicService method', async () => {
      const response = await publicController.checkHealth();

      expect(response).toStrictEqual(checkHealthResponse);
    });
  });
});
