import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { PublicModule } from './features/public/public.module';
import { EthersModule } from './features/ethers/ethers.module';
import { UsersModule } from './features/users/users.module';
import { InitializationsModule } from './features/initializations/initializations.module';

import { dbConnectionFactory } from './common/database';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync(dbConnectionFactory),
    PublicModule,
    EthersModule,
    UsersModule,
    InitializationsModule,
  ],
})
export class AppModule {}
