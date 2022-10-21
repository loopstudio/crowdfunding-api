import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: { createdAt: 'created', updatedAt: 'updated' } })
export class User {
  @Prop({ index: true })
  username: string;

  @Prop({ index: true })
  email: string;

  @Prop({ required: true })
  nonce: string;

  @Prop({ required: true, unique: true, index: true })
  publicAddress: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
