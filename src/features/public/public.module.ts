import { Module } from '@nestjs/common';

import { PublicService } from './services/public.service';
import { PublicController } from './controllers/public.controller';

@Module({
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
