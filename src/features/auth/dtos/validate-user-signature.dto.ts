import { IsString, IsEthereumAddress } from 'class-validator';

export class ValidateUserSignatureDto {
  @IsString()
  signature: string;

  @IsEthereumAddress()
  publicAddress: string;
}
