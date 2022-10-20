import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/CreateUser';
import { getNonce } from 'src/common/utils';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(body: CreateUserDto): Promise<User> {
    const { username, email, publicAddress } = body;

    const existingUser = await this.userModel.count({ publicAddress }).exec();
    if (existingUser > 0) {
      throw new ConflictException('User conflict');
    }

    const user = await new this.userModel({
      username,
      email,
      publicAddress,
      nonce: getNonce(),
    }).save();

    return user;
  }
}
