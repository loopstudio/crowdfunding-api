import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { User } from 'src/features/users/schemas/user.schema';
import { Campaign } from 'src/features/campaigns/schemas/campaign.schema';
import { Token } from 'src/features/tokens/schemas/token.schema';

export type RefundDocument = Refund & Document;

@Schema({ timestamps: { createdAt: 'created', updatedAt: 'updated' } })
export class Refund {
  @Prop({ index: true, type: MongooseSchema.Types.ObjectId, ref: 'Campaign' })
  campaign: Campaign;

  @Prop({ index: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  pledger: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Token' })
  token: Token;

  @Prop()
  amount: number;

  @Prop()
  date: Date;
}

export const RefundSchema = SchemaFactory.createForClass(Refund);
