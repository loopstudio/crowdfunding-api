import { IsEmail, IsString, IsEthereumAddress } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsEthereumAddress()
  publicAddress: string;
}
