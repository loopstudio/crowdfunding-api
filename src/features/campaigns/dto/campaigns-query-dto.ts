import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'src/common/constants';

export class CampaignQueryDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number = DEFAULT_PAGE;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  size?: number = DEFAULT_PAGE_SIZE;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  own? = false;

  @IsString()
  @IsOptional()
  search? = '';
}
