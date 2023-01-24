import { Controller, Get } from '@nestjs/common';

import { PublicService } from '../services/public.service';
import { APIResponse } from 'src/common/types';
import { Public } from 'src/features/auth/decorators';

@Controller('health')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Public()
  @Get()
  checkHealth(): APIResponse {
    return this.publicService.checkHealth();
  }
}
