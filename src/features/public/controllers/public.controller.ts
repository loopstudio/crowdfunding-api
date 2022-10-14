import { Controller, Get } from '@nestjs/common';

import { PublicService } from '../services/public.service';

@Controller('health')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get()
  checkHealth() {
    return this.publicService.checkHealth();
  }
}
