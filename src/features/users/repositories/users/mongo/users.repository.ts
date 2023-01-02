import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '../../../schemas/user.schema';
import { CreateUserDto } from '../../../dto/create-user.dto';
import { getNonce } from '../../../../../common/utils/index';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(body: CreateUserDto): Promise<User> {
    const { username, email, publicAddress } = body;

    const user = await this.userModel.create({
      username,
      email,
      publicAddress,
      nonce: getNonce(),
    });

    return user;
  }

  async findByAddress(address: string) {
    const user = await this.userModel
      .findOne({ publicAddress: address })
      .lean();
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async updateUserNonce(publicAddress: string): Promise<User> {
    const user = await this.userModel.findOne({ publicAddress });
    if (!user) {
      throw new NotFoundException();
    }

    user.nonce = getNonce();
    await user.save();

    return user;
  }
}
