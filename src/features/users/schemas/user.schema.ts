import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as jwt from 'jsonwebtoken';

import { getNonce } from 'src/common/utils';
import { TOKEN_EXPIRATION_TIME } from 'src/common/constants';

const { JWT_PRIVATE_KEY } = process.env;

interface UserMethods {
  updateNonce: () => void;
  generateJWT: () => string;
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
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.updateNonce = async function (this: UserDocument) {
  this.nonce = getNonce();
  await this.save();
};

// TODO: Once we have the auth module, move this section there
UserSchema.methods.generateJWT = async function (this: UserDocument) {
  return await jwt.sign(this.toJSON(), JWT_PRIVATE_KEY, {
    expiresIn: TOKEN_EXPIRATION_TIME,
    algorithm: 'HS256',
  });
};
