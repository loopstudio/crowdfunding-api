import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsDefined,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  MaxDate,
  MinDate,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

import { maxCampaignDurationInMs } from '../constants';
import { TokenAmount } from '../schemas/campaign.schema';

export class CreateCampaignDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  title: string;

  @IsOptional()
  subtitle = '';

  @IsOptional()
  story = '';

  @IsOptional()
  @IsString()
  url = null;

  @IsOptional()
  @IsString()
  collaborators = null;

  @Transform(
    ({ value }) => {
      return new Date(Number(value) * 1000);
    },
    {
      toClassOnly: true,
    },
  )
  @Type(() => Date)
  @MinDate(new Date())
  startDate: Date;

  @Transform(
    ({ value }) => {
      return new Date(Number(value) * 1000);
    },
    {
      toClassOnly: true,
    },
  )
  @Type(() => Date)
  @MinDate(new Date(Date.now() + 1))
  @MaxDate(new Date(Date.now() + maxCampaignDurationInMs))
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
