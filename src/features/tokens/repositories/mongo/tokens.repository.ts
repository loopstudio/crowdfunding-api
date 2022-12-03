import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Token, TokenDocument } from '../../schemas/token.schema';

@Injectable()
export class TokenRepository {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {}

  async getById(id: string): Promise<Token> {
    const token = await this.tokenModel.findById(id).lean();
    return token;
  }

  async getByAddress(address: string): Promise<Token> {
    const token = await this.tokenModel.findOne({ address }).lean();
    return token;
  }
}
