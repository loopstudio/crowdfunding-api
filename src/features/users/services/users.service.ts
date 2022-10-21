import { Injectable } from '@nestjs/common';

import { UsersRepository } from '../repositories/users.repository';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/CreateUser';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  async createUser(body: CreateUserDto): Promise<User> {
    const user = await this.userRepository.createUser(body);
    return user;
  }
}
