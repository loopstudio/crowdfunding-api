import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Campaign } from 'src/features/campaigns/schemas/campaign.schema';
import { Claim } from 'src/features/campaigns/schemas/claim.schema';
import { Pledge } from 'src/features/campaigns/schemas/pledge.schema';
import { Refund } from 'src/features/campaigns/schemas/refund.schema';
import { Unpledge } from 'src/features/campaigns/schemas/unpledge.schema';
import { Token } from 'src/features/tokens/schemas/token.schema';
import { User } from './user.schema';

export type UserCampaignDocument = UserCampaign & Document;

@Schema({ timestamps: { createdAt: 'created', updatedAt: 'updated' } })
export class UserCampaign {
  @Prop({
    index: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Campaign',
  })
  campaign: Campaign;

  @Prop({
    index: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  user: User;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Token',
  })
  token: Token;

  @Prop()
  totalPledged: string;

  @Prop()
  totalUnpledged: string;

  @Prop()
  totalClaimed: string;

  @Prop()
  totalRefunded: string;

  @Prop([Pledge])
  pledges: Pledge[];

  @Prop([Unpledge])
  unpledges: Unpledge[];

  @Prop([Claim])
  claims: Claim[];

  @Prop([Refund])
  refunds: Refund[];
}

export const UserCampaignSchema = SchemaFactory.createForClass(UserCampaign);
