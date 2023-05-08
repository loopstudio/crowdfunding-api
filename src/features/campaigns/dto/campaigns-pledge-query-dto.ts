import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CampaignPledgeQueryDto {
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  readonly page: number;

  @IsNumber()
  @Min(1)
  @Transform(({ value }) => Number(value))
  readonly size: number;

  @IsString()
  @IsOptional()
  search? = '';
}
