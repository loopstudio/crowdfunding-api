import { BadRequestException, Injectable } from '@nestjs/common';
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

  async validateUserSignature(body: ValidateUserSignatureDto): Promise<null> {
    const { publicAddress, signature } = body;

    const user = await this.findUserByAddress(publicAddress);
    const message = `I am signing my one-time nonce: ${user.nonce}`;

    const isSignatureValid = this.isSignatureValid({
      message,
      signature,
      userAddress: publicAddress,
    });

    console.log(`isSignatureValid >> ${isSignatureValid}`);

    // TODO: We can improve this update process
    await this.userRepository.updateUserNonce(publicAddress);

    return null;
  }

  isSignatureValid({
    message,
    signature,
    userAddress,
  }: {
    message: string;
    signature: string;
    userAddress: string;
  }): boolean {
    // TODO: Pending work here!
    return true;

    const signerAddress = ethersVerifyMessage(message, signature);
    return userAddress === signerAddress;
  }
}
