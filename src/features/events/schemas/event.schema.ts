import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: { createdAt: 'created', updatedAt: 'updated' } })
export class Event {
  @Prop({ index: true })
  event: string;

  @Prop()
  blockNumber: number;

  @Prop()
  data: MongooseSchema.Types.Mixed;

  @Prop({ index: true })
  date: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
