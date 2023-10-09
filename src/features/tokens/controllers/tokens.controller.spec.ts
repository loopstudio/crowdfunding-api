/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';

import { TokensController } from './tokens.controller';
import { TokensService } from '../services/tokens.service';
import { mongoBuiltToken } from '../tests/mocks';

describe('Tokens Controller', () => {
  let tokensService: TokensService;
  let tokensController: TokensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokensController],
      providers: [
        {
          provide: TokensService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    tokensController = module.get<TokensController>(TokensController);
    tokensService = module.get<TokensService>(TokensService);
  });

  describe('findAll method', () => {
    it('should call findAll tokensService method without errors', async () => {
      jest
        .spyOn(tokensService, 'findAll')
        .mockResolvedValue({ tokens: [mongoBuiltToken] } as any);

      const response = await tokensController.findAll();

      expect(response).toStrictEqual({ data: [mongoBuiltToken] });
    });
  });
});
