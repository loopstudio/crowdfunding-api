import { Controller, Get } from '@nestjs/common';

import { APIResponse } from 'src/common/types';
import { TokensService } from '../services/tokens.service';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get()
  async findAll(): Promise<APIResponse> {
    const { tokens } = await this.tokensService.findAll();
    return { data: tokens };
  }
}
