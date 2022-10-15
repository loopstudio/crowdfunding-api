import { Controller, Get } from '@nestjs/common';

import { UsersService } from '../services/users.service';
import { User } from '../schemas/user.schema';
import { APIResponse } from '../../../common/types/index';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/')
  async listUsers(): Promise<APIResponse> {
    const users = await this.userService.listUsers();
    return { data: users };
  }
}
