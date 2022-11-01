import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { PublicModule } from './features/public/public.module';
import { EthersModule } from './features/ethers/ethers.module';
import { UsersModule } from './features/users/users.module';

import { dbConnectionFactory } from './common/database';
import { CampaignsModule } from './features/campaigns/campaigns.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync(dbConnectionFactory),
    PublicModule,
    EthersModule,
    UsersModule,
    CampaignsModule,
  ],
})
export class AppModule {}
