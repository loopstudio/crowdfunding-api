import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { User } from 'src/features/users/schemas/user.schema';
import { CampaignStatus } from 'src/features/campaign-statuses/schemas/campaign-status.schema';
import { CampaignCategory } from 'src/features/campaign-categories/schemas/campaign-category.schema';

export type CampaignDocument = Campaign & Document;

@Schema()
export class TokenAmount {
  @Prop()
  amount: string;

  @Prop({})
  tokenAddress: string;
}

@Schema({ timestamps: { createdAt: 'created', updatedAt: 'updated' } })
export class Campaign {
  @Prop({ index: true, required: true })
  title: string;

  @Prop({ required: true })
  subtitle: string;

  @Prop()
  story: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({
    default: null,
    index: {
      unique: true,
      partialFilterExpression: { onchainId: { $type: 'string' } },
    },
  })
  @Prop({ required: true })
  onchainId: string;

  @Prop({ default: 0 })
  fiatAmount: number;

  @Prop({ default: null })
  image: string;

  @Prop({ default: null })
  video: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  backers: User[];

  @Prop({
    index: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'CampaignStatus',
    required: true,
  })
  status: CampaignStatus;

  @Prop([TokenAmount])
  goal: TokenAmount[];

  @Prop([TokenAmount])
  currentAmount: TokenAmount[];

  @Prop({
    index: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'CampaignCategory',
    required: true,
  })
  category: CampaignCategory;

  @Prop({
    index: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  @Prop({ required: true })
  owner: User;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
