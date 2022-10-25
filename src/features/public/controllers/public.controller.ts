import { Controller, Get } from '@nestjs/common';

import { PublicService } from '../services/public.service';
import { APIResponse } from 'src/common/types';

@Controller('health')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get()
  checkHealth(): APIResponse {
    return this.publicService.checkHealth();
  }
}
