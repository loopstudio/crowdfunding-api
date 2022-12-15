import { Injectable } from '@nestjs/common';

import { TokenRepository } from '../repositories/mongo/tokens.repository';
import { Token } from '../schemas/token.schema';

@Injectable()
export class TokensService {
  constructor(private tokenRepository: TokenRepository) {}

  private async getById(id: string): Promise<Token> {
    const token = await this.tokenRepository.getById(id);
    return token;
  }

  async areTokensValid(ids: string[]): Promise<boolean> {
    const tokenPromises = ids.map((tokenId) => {
      return this.getById(tokenId);
    });

    const tokens = await Promise.all(tokenPromises);
    const someNullToken = tokens.some((token) => token === null);

    return !someNullToken;
  }

  async getByAddress(address: string): Promise<Token> {
    const token = this.tokenRepository.getByAddress(address);
    return token;
  }

  async getByDefault(): Promise<Token> {
    const token = this.tokenRepository.getByDefault();
    return token;
  }
}
