/* eslint-disable @typescript-eslint/no-explicit-any */

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TokenRepository } from './tokens.repository';
import { Token } from '../../schemas/token.schema';
import { mongoBuiltToken } from '../../tests/mocks';

describe('Token Repository', () => {
  let tokensRepository: TokenRepository;
  let tokenModel: Model<Token>;

  const tokenId = mongoBuiltToken.address;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenRepository,
        {
          provide: getModelToken(Token.name),
          useValue: {
            findById: jest.fn(),
            lean: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    tokenModel = module.get<Model<Token>>(getModelToken(Token.name));
    tokensRepository = module.get<TokenRepository>(TokenRepository);
  });

  describe('getById method', () => {
    it('should call getById method without errors', async () => {
      jest.spyOn(tokenModel, 'findById').mockReturnValue({
        lean: jest.fn().mockResolvedValue(mongoBuiltToken),
      } as any);

      const response = await tokensRepository.getById(tokenId);
      expect(response).toStrictEqual(mongoBuiltToken);
    });
  });

  describe('findAll method', () => {
    it('should call findAll method without errors', async () => {
      jest.spyOn(tokenModel, 'find').mockResolvedValue([mongoBuiltToken]);

      const response = await tokensRepository.findAll();
      expect(response).toStrictEqual([mongoBuiltToken]);
    });
  });
});
