import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EthersService } from './services/ethers.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [EthersService],
  exports: [EthersService],
})
export class EthersModule {}
