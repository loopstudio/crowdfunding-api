import { Type } from 'class-transformer';
import {
  IsString,
  IsDefined,
  IsOptional,
  IsDate,
  MinDate,
  Min,
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

  @IsDefined()
  @IsString()
  code: string;

  @IsOptional()
  @Min(0)
  fiatAmount = 0;

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

  @IsDefined()
  @IsString()
  category: string;
}
