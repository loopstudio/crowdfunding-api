import { Injectable, NotFoundException } from '@nestjs/common';

import { UsersRepository } from '../repositories/users/mongo/users.repository';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  async createUser(body: CreateUserDto): Promise<User> {
    const user = await this.userRepository.createUser(body);
    return user;
  }

  async findUserByAddress(address: string): Promise<User> {
    const user = await this.userRepository.findByAddress(address);
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
