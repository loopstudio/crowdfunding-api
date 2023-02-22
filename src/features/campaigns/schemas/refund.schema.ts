import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { User } from 'src/features/users/schemas/user.schema';
import { Campaign } from 'src/features/campaigns/schemas/campaign.schema';
import { Token } from 'src/features/tokens/schemas/token.schema';

export type RefundDocument = Refund & Document;

@Schema({ timestamps: { createdAt: 'created', updatedAt: 'updated' } })
export class Refund {
  @Prop({
    index: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  })
  campaign: Campaign;

  @Prop({
    index: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Token', required: true })
  token: Token;

  @Prop({ required: true })
  amount: string;

  @Prop()
  date: Date;
}

export const RefundSchema = SchemaFactory.createForClass(Refund);
