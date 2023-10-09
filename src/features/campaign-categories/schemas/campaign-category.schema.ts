import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CampaignCategoryDocument = CampaignCategory & Document;

@Schema({ timestamps: { createdAt: 'created', updatedAt: 'updated' } })
export class CampaignCategory {
  @Prop({ index: true, required: true })
  name: string;

  @Prop({ unique: true, index: true, required: true })
  code: string;
}

export const CampaignCategorySchema =
  SchemaFactory.createForClass(CampaignCategory);
