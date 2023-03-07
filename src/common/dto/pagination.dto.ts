import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants';

export class PaginationDto {
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  page: number = DEFAULT_PAGE;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  size: number = DEFAULT_PAGE_SIZE;
}
