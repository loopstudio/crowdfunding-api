import { Type } from 'class-transformer';
import {
  IsString,
  IsDefined,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';

import { TokenAmount } from '../schemas/campaign.schema';

export class CreateCampaignDto {
  @IsDefined()
  @IsString()
  title: string;

  @IsOptional()
  subtitle = '';

  @IsOptional()
  story = '';

  @IsDefined()
  // FIXME
  //@MinDate(new Date(Date.now()))
  @Type(() => Date)
  startDate: Date;

  @IsDefined()
  // FIXME
  //@MinDate(new Date(Date.now() + 1))
  //@MaxDate(new Date(Date.now() + maxCampaignDurationInMs))
  @Type(() => Date)
  endDate: Date;

  @IsOptional()
  @IsString()
  image = null;

  @IsOptional()
  @IsString()
  video = null;

  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  goal: TokenAmount[];

  @IsOptional()
  status: string;

  @IsOptional()
  onchainId: string;
}
