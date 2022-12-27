import { Injectable } from '@nestjs/common';

import { TokenRepository } from '../repositories/mongo/tokens.repository';
import { Token } from '../schemas/token.schema';

@Injectable()
export class TokensService {
  constructor(private tokenRepository: TokenRepository) {}

  async areTokensValid(addresses: string[]): Promise<boolean> {
    const tokenPromises = addresses.map((tokenAddress) => {
      return this.tokenRepository.getByAddress(tokenAddress);
    });

    const tokens = await Promise.all(tokenPromises);
    const someNullToken = tokens.some((token) => token === null);

    return !someNullToken;
  }

  async getByAddress(address: string): Promise<Token> {
    const token = this.tokenRepository.getByAddress(address);
    return token;
  }

  // TODO: This method will be changed once we handle different tokens
  // TODO: Right now, we are just returning the only one we have in our DB
  async getByDefault(): Promise<Token> {
    const token = this.tokenRepository.getByDefault();
    return token;
  }

  async findAll() {
    const tokens = await this.tokenRepository.findAll();
    return { tokens };
  }
}
