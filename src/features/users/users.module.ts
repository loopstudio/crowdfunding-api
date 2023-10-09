import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UsersRepository } from './repositories/users/mongo/users.repository';
import { UserCampaignsRepository } from './repositories/user-campaigns/mongo/user-campaigns.repository';
import {
  UserCampaign,
  UserCampaignSchema,
} from './schemas/user-campaign.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: UserCampaign.name,
        schema: UserCampaignSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserCampaignsRepository],
  exports: [UsersService, UserCampaignsRepository],
})
export class UsersModule {}
