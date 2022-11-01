import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '../../schemas/user.schema';
import { CreateUserDto } from '../../dto/create-user.dto';
import { getNonce } from '../../../../common/utils/index';

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
}
