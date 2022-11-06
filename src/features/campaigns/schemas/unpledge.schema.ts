import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { User } from 'src/features/users/schemas/user.schema';
import { Campaign } from 'src/features/campaigns/schemas/campaign.schema';
import { Token } from 'src/features/tokens/schemas/token.schema';

export type UnpledgeDocument = Unpledge & Document;

@Schema({ timestamps: { createdAt: 'created', updatedAt: 'updated' } })
export class Unpledge {
  @Prop({ index: true, type: MongooseSchema.Types.ObjectId, ref: 'Campaign' })
  campaign: Campaign;

  @Prop({ index: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Token' })
  token: Token;

  @Prop()
  amount: string;

  @Prop()
  date: Date;
}

export const UnpledgeSchema = SchemaFactory.createForClass(Unpledge);
