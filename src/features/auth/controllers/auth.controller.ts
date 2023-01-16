import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { APIResponse } from 'src/common/types';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../../../features/users/services/users.service';
import { ValidateUserSignatureDto } from '../dtos/validate-user-signature.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('/:address/nonce')
  async getUserNonce(@Param('address') address: string): Promise<APIResponse> {
    const user = await this.userService.findUserByAddress(address);
    return { data: user.nonce };
  }

  @Post('/login')
  async loginUser(
    @Body() body: ValidateUserSignatureDto,
  ): Promise<APIResponse> {
    const { accessToken } = await this.authService.generateJWT(body);

    return { data: { accessToken } };
  }
}
