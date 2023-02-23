import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Campaign } from 'src/features/campaigns/schemas/campaign.schema';

export type CampaignLaunchDocument = CampaignLaunch & Document;

@Schema({ timestamps: { createdAt: 'created', updatedAt: 'updated' } })
export class CampaignLaunch {
  @Prop({
    index: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  })
  campaign: Campaign;

  @Prop()
  onchainId: string;

  @Prop()
  date: Date;
}

export const CampaignLaunchSchema =
  SchemaFactory.createForClass(CampaignLaunch);
