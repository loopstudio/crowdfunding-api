import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { PublicModule } from './features/public/public.module';
import { EventsModule } from './features/events/events.module';
import { UsersModule } from './features/users/users.module';

import { dbConnectionFactory } from './common/database';
import { CampaignsModule } from './features/campaigns/campaigns.module';
import { TokensModule } from './features/tokens/tokens.module';
import { CampaignStatusesModule } from './features/campaign-statuses/campaign-statuses.module';
import { CampaignCategoriesModule } from './features/campaign-categories/campaign-categories.module';
import { AuthModule } from './features/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync(dbConnectionFactory),
    PublicModule,
    EventsModule,
    UsersModule,
    CampaignsModule,
    TokensModule,
    CampaignStatusesModule,
    CampaignCategoriesModule,
    AuthModule,
  ],
})
export class AppModule {}
