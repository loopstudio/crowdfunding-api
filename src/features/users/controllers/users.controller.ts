import { Body, Controller, Post } from '@nestjs/common';

import { UsersService } from '../services/users.service';
import { APIResponse } from '../../../common/types/index';
import { CreateUserDto } from '../dto/create-user.dto';
import { Public } from 'src/features/auth/decorators';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Public()
  @Post('/')
  async createUser(@Body() body: CreateUserDto): Promise<APIResponse> {
    const user = await this.userService.createUser(body);
    return { data: user };
  }
}
