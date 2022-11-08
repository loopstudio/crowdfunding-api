import { Type } from 'class-transformer';
import {
  IsString,
  IsDefined,
  IsOptional,
  MinDate,
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
  @MinDate(new Date(Date.now()))
  @Type(() => Date)
  startDate: Date;

  @IsDefined()
  @MinDate(new Date(Date.now() + 1))
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
}
