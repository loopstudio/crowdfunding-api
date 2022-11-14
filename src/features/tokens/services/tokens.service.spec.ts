/* eslint-disable @typescript-eslint/no-explicit-any */

import { Test, TestingModule } from '@nestjs/testing';

import { TokensService } from './tokens.service';
import { TokenRepository } from '../repositories/mongo/tokens.repository';
import { mongoBuiltToken } from '../tests/mocks';

describe('Token Service', () => {
  let tokenService: TokensService;
  let tokenRepository: TokenRepository;

  const tokenId = mongoBuiltToken.address;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokensService,
        {
          provide: TokenRepository,
          useValue: {
            getById: jest.fn(),
          },
        },
      ],
    }).compile();

    tokenService = module.get<TokensService>(TokensService);
    tokenRepository = module.get<TokenRepository>(TokenRepository);
  });

  describe('tokenService constructor', () => {
    it('should be defined', () => {
      expect(tokenService).toBeDefined();
    });
  });

  describe('areTokensValid method', () => {
    it('should call areTokensValid without errors', async () => {
      jest.spyOn(tokenRepository, 'getById').mockResolvedValue(mongoBuiltToken);

      const response = await tokenService.areTokensValid([tokenId]);

      expect(response).toStrictEqual(true);
    });
  });
});
