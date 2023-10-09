import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CampaignStatusDocument = CampaignStatus & Document;

@Schema({ timestamps: { createdAt: 'created', updatedAt: 'updated' } })
export class CampaignStatus {
  @Prop({ index: true, required: true })
  name: string;

  @Prop({ unique: true, index: true, required: true })
  code: string;
}

export const CampaignStatusSchema =
  SchemaFactory.createForClass(CampaignStatus);
