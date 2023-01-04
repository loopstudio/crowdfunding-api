import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyMessage as ethersVerifyMessage } from 'ethers/lib/utils';

import { UsersRepository } from '../repositories/users/mongo/users.repository';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { ValidateUserSignatureDto } from '../dto/validate-user-signature.dto';

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
      throw new BadRequestException();
    }

    return user;
  }

  async generateJWT(
    body: ValidateUserSignatureDto,
  ): Promise<{ accessToken: string }> {
    const { publicAddress, signature } = body;

    const user = await this.findUserByAddress(publicAddress);
    // TODO: Change this message?
    const message = `I am signing my one-time nonce: ${user.nonce}`;

    this.checkSignatureValidity({
      message,
      signature,
      userAddress: publicAddress,
    });

    await user.updateNonce();
    const userJWT = await user.generateJWT();

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
  }): boolean {
    // TODO: Uncomment once the feature is done!
    return true;

    const signerAddress = ethersVerifyMessage(message, signature);
    if (userAddress !== signerAddress) {
      throw new UnauthorizedException();
    }
  }
}
