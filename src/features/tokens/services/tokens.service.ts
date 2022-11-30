import { Injectable } from '@nestjs/common';

import { TokenRepository } from '../repositories/mongo/tokens.repository';

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

  async findAll() {
    const tokens = await this.tokenRepository.findAll();
    return { tokens };
  }
}
