import { IsDefined, IsString } from 'class-validator';

export class LaunchEventDataDto {
  @IsString()
  @IsDefined()
  ownerId: string;

  @IsString()
  @IsDefined()
  amount: string;

  @IsString()
  @IsDefined()
  tokenAddress: string;

  @IsString()
  @IsDefined()
  pendingStatusId: string;

  @IsString()
  @IsDefined()
  startDate: string;

  @IsString()
  @IsDefined()
  endDate: string;
}
