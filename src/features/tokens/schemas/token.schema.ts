import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TokenDocument = Token & Document;

@Schema({ timestamps: { createdAt: 'created', updatedAt: 'updated' } })
export class Token {
  @Prop({ index: true })
  name: string;

  @Prop()
  symbol: string;

  @Prop({ required: true, unique: true })
  address: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
