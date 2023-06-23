import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Campaign } from 'src/features/campaigns/schemas/campaign.schema';
import { CampaignClaim } from 'src/features/campaigns/schemas/campaign-claim.schema';
import { CampaignPledge } from 'src/features/campaigns/schemas/campaign-pledge.schema';
import { CampaignRefund } from 'src/features/campaigns/schemas/campaign-refund.schema';
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

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'CampaignPledge' }],
    default: [],
  })
  pledges: CampaignPledge[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Unpledge' }],
    default: [],
  })
  unpledges: Unpledge[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'CampaignClaim' }],
    default: [],
  })
  claims: CampaignClaim[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Refund' }],
    default: [],
  })
  refunds: CampaignRefund[];
}

export const UserCampaignSchema = SchemaFactory.createForClass(UserCampaign);
