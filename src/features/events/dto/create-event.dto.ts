import { IsString, IsDefined, IsNumber } from 'class-validator';

export class CreateEventDto {
  @IsDefined()
  @IsString()
  event: string;

  @IsDefined()
  @IsNumber()
  blockNumber: number;

  @IsDefined()
  @IsString()
  blockHash: string;

  @IsDefined()
  @IsString()
  transactionHash: string;

  @IsDefined()
  data: unknown;
}
