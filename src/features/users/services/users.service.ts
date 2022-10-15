import { Injectable } from '@nestjs/common';

import { UsersRepository } from '../repositories/users.repository';
import { User } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  async listUsers(): Promise<User[]> {
    const users = await this.userRepository.listUsers();
    return users;
  }
}
