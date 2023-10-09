import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { getNonce } from 'src/common/utils';

interface UserMethods {
  updateNonce: () => void;
  generateJWT: () => string;
  toJSON: () => Record<string, unknown>;
}

export interface IUser {
  username: string;
  email: string;
  nonce: string;
  publicAddress: string;
  _id: string;
  __v: number;
}

export type UserDocument = User & Document & UserMethods;

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

  updateNonce: () => void;
  generateJWT: () => string;
  toJSON: () => Record<string, unknown>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.updateNonce = async function (this: UserDocument) {
  this.nonce = getNonce();
  await this.save();
};
