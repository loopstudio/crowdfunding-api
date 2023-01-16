import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verifyMessage as ethersVerifyMessage } from 'ethers/lib/utils';

import { UsersService } from '../../users/services/users.service';
import { ValidateUserSignatureDto } from '../dtos/validate-user-signature.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async generateJWT(
    body: ValidateUserSignatureDto,
  ): Promise<{ accessToken: string }> {
    const { publicAddress, signature } = body;

    const user = await this.usersService.findUserByAddress(publicAddress);
    const message = `Signing login nonce: ${user.nonce}`;

    this.checkSignatureValidity({
      message,
      signature,
      userAddress: publicAddress,
    });

    await user.updateNonce();
    const userJWT = this.jwtService.sign(user.toJSON());

    return { accessToken: userJWT };
  }

  private checkSignatureValidity({
    message,
    signature,
    userAddress,
  }: {
    message: string;
    signature: string;
    userAddress: string;
  }) {
    const signerAddress = ethersVerifyMessage(message, signature);
    if (userAddress !== signerAddress) {
      throw new UnauthorizedException();
    }
  }
}
