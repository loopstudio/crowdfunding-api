import { Body, Controller, Post } from '@nestjs/common';

import { UsersService } from '../services/users.service';
import { APIResponse } from '../../../common/types/index';
import { CreateUserDto } from '../dto/CreateUser';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/')
  async createUser(@Body() body: CreateUserDto): Promise<APIResponse> {
    const user = await this.userService.createUser(body);
    return { data: user };
  }
}
