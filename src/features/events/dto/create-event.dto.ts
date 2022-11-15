import { IsString, IsDefined, IsNumber } from 'class-validator';

export class CreateEventDto {
  @IsDefined()
  @IsString()
  event: string;

  @IsDefined()
  @IsNumber()
  blockNumber: number;

  @IsDefined()
  data: unknown;
}
