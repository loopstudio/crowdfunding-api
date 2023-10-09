import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Token, TokenDocument } from '../../schemas/token.schema';

@Injectable()
export class TokenRepository {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {}

  async findAll() {
    const tokens = await this.tokenModel.find();
    return tokens;
  }

  async getById(id: string): Promise<Token> {
    const token = await this.tokenModel.findById(id).lean();
    return token;
  }

  async getByAddress(address: string): Promise<Token> {
    const token = await this.tokenModel.findOne({ address }).lean();
    return token;
  }

  // TODO: This method will be changed once we handle different tokens
  // TODO: Right now, we are just returning the only one we have in our DB
  async getByDefault(): Promise<Token> {
    const token = await this.tokenModel.findOne({}).lean();
    return token;
  }
}
