import { IsString, IsDefined } from 'class-validator';

export class CampaignLaunchEventDto {
  @IsDefined()
  @IsString()
  creator: string;

  @IsDefined()
  @IsString()
  goal: string;

  @IsDefined()
  @IsString()
  tokenAddress: string;

  @IsDefined()
  @IsString()
  startDate: string;

  @IsDefined()
  @IsString()
  endDate: string;
}
