import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { UsersService } from '../services/users.service';
import { APIResponse } from '../../../common/types/index';
import { CreateUserDto } from '../dto/create-user.dto';
import { ValidateUserSignatureDto } from '../dto/validate-user-signature.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/')
  async createUser(@Body() body: CreateUserDto): Promise<APIResponse> {
    const user = await this.userService.createUser(body);
    return { data: user };
  }

  @Get('/:address/nonce')
  async getUserNonce(@Param('address') address: string): Promise<APIResponse> {
    const user = await this.userService.findUserByAddress(address);
    return { data: user.nonce };
  }

  @Post('/access')
  async loginUser(
    @Body() body: ValidateUserSignatureDto,
  ): Promise<APIResponse> {
    // TODO: Add authentication middleware and decorators
    // TODO: Use user id from request.user

    const { accessToken } = await this.userService.generateJWT(body);

    return { data: { accessToken } };
  }
}
