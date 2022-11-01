import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { User } from 'src/features/users/schemas/user.schema';
import { Token } from 'src/features/tokens/schemas/token.schema';
import { CampaignStatus } from 'src/features/campaignStatuses/schemas/campaignStatus.schema';
import { CampaignCategory } from 'src/features/campaignCategories/schemas/campaignCategory.schema';

export type CampaignDocument = Campaign & Document;

@Schema()
export class TokenAmount {
  @Prop()
  amount: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Token' })
  token: Token;
}

@Schema({ timestamps: { createdAt: 'created', updatedAt: 'updated' } })
export class Campaign {
  @Prop({ index: true })
  title: string;

  @Prop()
  subtitle: string;

  @Prop()
  story: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ unique: true })
  code: string;

  @Prop()
  fiatAmount: number;

  @Prop({ default: null })
  image: string;

  @Prop({ default: null })
  video: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  backers: User[];

  @Prop({
    index: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'CampaignStatus',
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
  })
  category: CampaignCategory;

  @Prop({
    index: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  owner: User;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
